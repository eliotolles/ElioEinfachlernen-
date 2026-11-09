/**
 * YouTube Transcript Extractor - Module độc lập (Self-contained)
 * Tự động lấy phụ đề (bản hiện lời / cues) từ link hoặc ID video YouTube.
 * Hoạt động trên cả Node.js (v18+), Cloudflare Workers, Vercel Serverless.
 *
 * Tính năng:
 * - Trích xuất Video ID từ mọi dạng link YouTube (watch, shorts, youtu.be, embed).
 * - Bóc tách captionTracks trực tiếp từ YouTube (không cần API key).
 * - Hỗ trợ cả phụ đề tạo thủ công (Manual CC) và tạo tự động (ASR).
 * - Hỗ trợ phân tích cả 3 định dạng: JSON3, XML timedtext, và WebVTT.
 * - Xuất kết quả dạng mảng Cues [{ start, end, text }], hoặc chuyển đổi sang SRT / VTT.
 */

/**
 * 1. Trích xuất YouTube Video ID từ URL bất kỳ
 */
export function extractYouTubeId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const str = urlOrId.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(str)) return str;
  const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

/**
 * 2. Phân tích nội dung thô của tệp phụ đề (JSON3, XML timedtext, WebVTT)
 */
function parseCaptionPayload(raw) {
  // A. Trường hợp JSON3
  try {
    const json = JSON.parse(raw);
    if (Array.isArray(json?.events)) return json;
  } catch {}

  // Hàm giải mã HTML Entities
  const decode = text => text
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, v) => {
      if (v[0] === '#') {
        const n = v[1].toLowerCase() === 'x' ? parseInt(v.slice(2), 16) : parseInt(v.slice(1), 10);
        return n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '';
      }
      return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[v.toLowerCase()] || '';
    });

  const attr = (text, name) => text.match(new RegExp('(?:^|\\s)' + name + '=["\']([^"\']*)["\']'))?.[1];
  const events = [];

  // B. Trường hợp XML timedtext (<transcript> hoặc <timedtext>)
  if (/<(?:transcript|timedtext)(?:\s|>)/i.test(raw)) {
    for (const m of raw.matchAll(/<(text|p)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
      const isP = m[1].toLowerCase() === 'p';
      const start = attr(m[2], isP ? 't' : 'start');
      const duration = attr(m[2], isP ? 'd' : 'dur');
      if (start === undefined) continue;
      events.push({
        tStartMs: Number(start) * (isP ? 1 : 1000),
        ...(duration === undefined ? {} : { dDurationMs: Number(duration) * (isP ? 1 : 1000) }),
        segs: [{ utf8: decode(m[3]) }]
      });
    }
    return { events };
  }

  // C. Trường hợp WebVTT
  if (/^\s*WEBVTT/.test(raw)) {
    const toSeconds = v => v.split(':').reduce((n, p) => n * 60 + Number(p), 0);
    for (const block of raw.replace(/\r/g, '').split(/\n\s*\n/)) {
      const lines = block.split('\n');
      const i = lines.findIndex(l => l.includes('-->'));
      if (i < 0) continue;
      const t = lines[i].match(/([\d:.]+)\s+-->\s+([\d:.]+)/);
      if (!t) continue;
      const start = toSeconds(t[1]);
      const end = toSeconds(t[2]);
      events.push({
        tStartMs: start * 1000,
        dDurationMs: (end - start) * 1000,
        segs: [{ utf8: decode(lines.slice(i + 1).join(' ')) }]
      });
    }
    return { events };
  }

  return null;
}

/**
 * 3. Trích xuất JSON nhúng trong trang YouTube (ytInitialPlayerResponse)
 */
function extractEmbeddedJSON(html, pattern) {
  pattern.lastIndex = 0;
  let match, count = 0;
  while ((match = pattern.exec(html)) && count++ < 12) {
    let start = pattern.lastIndex;
    while (/\s/.test(html[start] || '') && start < html.length) start++;
    if (html[start] === '{') {
      // Đếm dấu ngoặc lồng nhau
      let depth = 0, inString = false, escape = false;
      for (let i = start; i < html.length; i++) {
        const c = html[i];
        if (inString) {
          if (escape) escape = false;
          else if (c === '\\') escape = true;
          else if (c === '"') inString = false;
        } else {
          if (c === '"') inString = true;
          else if (c === '{') depth++;
          else if (c === '}') {
            depth--;
            if (depth === 0) {
              try { return JSON.parse(html.slice(start, i + 1)); } catch { break; }
            }
          }
        }
      }
    }
  }
  return null;
}

/**
 * 4. Tải nội dung web với xử lý redirect và user-agent
 */
async function fetchWithRedirect(url, timeoutMs = 25000) {
  let current = new URL(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6',
    'Accept': '*/*'
  };

  try {
    for (let hop = 0; hop < 5; hop++) {
      const res = await fetch(current.href, {
        headers,
        redirect: 'manual',
        signal: controller.signal
      });

      if ([301, 302, 303, 307, 308].includes(res.status)) {
        const location = res.headers.get('Location');
        if (!location) throw new Error('Redirect thiếu Location');
        current = new URL(location, current);
        continue;
      }
      return res;
    }
    throw new Error('Chuyển hướng quá nhiều lần');
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 5. HÀM CHÍNH: Lấy phụ đề tiếng Đức (hoặc ngôn ngữ tùy chọn)
 * @param {string} videoUrlOrId - Đường dẫn hoặc ID video YouTube
 * @param {string} [lang='de'] - Mã ngôn ngữ (mặc định 'de' - tiếng Đức)
 * @returns {Promise<{available: boolean, language: string, source: string, cues: Array<{start: number, end: number, text: string}>, reason?: string}>}
 */
export async function getYouTubeTranscript(videoUrlOrId, lang = 'de') {
  const videoId = extractYouTubeId(videoUrlOrId);
  if (!videoId) {
    return { available: false, reason: 'ID video YouTube không hợp lệ.', cues: [] };
  }

  try {
    // Bước 1: Tải trang xem video từ YouTube
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}&hl=${lang}`;
    const pageRes = await fetchWithRedirect(watchUrl);
    if (!pageRes.ok) {
      return { available: false, reason: `YouTube trả mã lỗi HTTP ${pageRes.status}`, cues: [] };
    }

    const html = await pageRes.text();

    // Bước 2: Tìm ytInitialPlayerResponse
    const playerResponse = 
      extractEmbeddedJSON(html, /(?:\bytInitialPlayerResponse\b|window\s*\[\s*["']ytInitialPlayerResponse["']\s*\])\s*=\s*/g) ||
      extractEmbeddedJSON(html, /"(?:player_response|playerResponse|ytInitialPlayerResponse)"\s*:\s*/g);

    if (!playerResponse) {
      return { available: false, reason: 'Không tìm thấy dữ liệu player trong trang YouTube.', cues: [] };
    }

    // Kiểm tra playability
    const playStatus = playerResponse?.playabilityStatus?.status;
    if (playStatus && playStatus !== 'OK') {
      return { available: false, reason: `Video không khả dụng hoặc bị chặn nhúng (${playStatus}).`, cues: [] };
    }

    // Lấy danh sách captionTracks
    const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!Array.isArray(captionTracks) || !captionTracks.length) {
      return { available: false, reason: 'Video này không có phụ đề (caption tracks) khả dụng.', cues: [] };
    }

    // Bước 3: Lọc track theo ngôn ngữ (ưu tiên phụ đề chuẩn người tạo trước tự động ASR)
    const langRegex = new RegExp(`^${lang}(?:[-_]|$)`, 'i');
    const candidates = captionTracks
      .filter(t => langRegex.test(t.languageCode || ''))
      .sort((a, b) => Number(a.kind === 'asr') - Number(b.kind === 'asr'));

    if (!candidates.length) {
      return { 
        available: false, 
        reason: `Không tìm thấy phụ đề ngôn ngữ "${lang}". Có sẵn các ngôn ngữ: ` + 
          captionTracks.map(t => t.languageCode).join(', '), 
        cues: [] 
      };
    }

    // Bước 4: Tải tệp phụ đề
    const selectedTrack = candidates[0];
    let payload = null;

    // Thử định dạng json3 trước
    const formatsToTry = [
      selectedTrack.baseUrl + '&fmt=json3',
      selectedTrack.baseUrl
    ];

    for (const url of formatsToTry) {
      try {
        const subRes = await fetchWithRedirect(url);
        if (subRes.ok) {
          const raw = await subRes.text();
          const parsed = parseCaptionPayload(raw);
          if (parsed && Array.isArray(parsed.events) && parsed.events.length) {
            payload = parsed;
            break;
          }
        }
      } catch {}
    }

    if (!payload) {
      return { available: false, reason: 'Không phân tích được nội dung tệp phụ đề.', cues: [] };
    }

    // Bước 5: Chuyển đổi events thành mảng cues [{ start, end, text }]
    const cues = [];
    const events = payload.events;

    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      if (!e || e.tStartMs === undefined || e.tStartMs === null) continue;

      const text = (Array.isArray(e.segs) ? e.segs : [])
        .map(s => typeof s?.utf8 === 'string' ? s.utf8 : '')
        .join('')
        .replace(/\s+/g, ' ')
        .trim();

      const start = Number(e.tStartMs) / 1000;
      let end = (Number(e.tStartMs) + Number(e.dDurationMs)) / 1000;

      // Xử lý duration bị thiếu
      if (e.dDurationMs === undefined || e.dDurationMs === null || !Number.isFinite(end) || end <= start) {
        const next = events.slice(i + 1).find(n => n?.tStartMs !== undefined && Number(n.tStartMs) / 1000 > start);
        end = next ? Number(next.tStartMs) / 1000 : start + 3;
      }

      if (!text || !Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) continue;

      // Loại bỏ câu trùng lặp liên tiếp
      const prev = cues[cues.length - 1];
      if (prev && prev.text === text && prev.start === start) continue;

      cues.push({
        start: Math.round(start * 1000) / 1000,
        end: Math.round(end * 1000) / 1000,
        text
      });
    }

    return {
      available: true,
      videoId,
      language: selectedTrack.languageCode,
      source: selectedTrack.kind === 'asr' ? 'youtube-auto' : 'youtube',
      cues
    };

  } catch (error) {
    return {
      available: false,
      reason: 'Lỗi trong quá trình lấy phụ đề: ' + (error.message || String(error)),
      cues: []
    };
  }
}

/**
 * 6. Các hàm tiện ích xuất ra định dạng SRT và VTT
 */
export function cuesToSrt(cues) {
  const pad = (n, len = 2) => String(n).padStart(len, '0');
  const formatTime = seconds => {
    const ms = Math.round(seconds * 1000);
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const msec = ms % 1000;
    return `${pad(h)}:${pad(m)}:${pad(s)},${pad(msec, 3)}`;
  };

  return cues.map((c, i) => `${i + 1}\n${formatTime(c.start)} --> ${formatTime(c.end)}\n${c.text}`).join('\n\n') + '\n';
}

export function cuesToVtt(cues) {
  const pad = (n, len = 2) => String(n).padStart(len, '0');
  const formatTime = seconds => {
    const ms = Math.round(seconds * 1000);
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const msec = ms % 1000;
    return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(msec, 3)}`;
  };

  return 'WEBVTT\n\n' + cues.map(c => `${formatTime(c.start)} --> ${formatTime(c.end)}\n${c.text}`).join('\n\n') + '\n';
}
