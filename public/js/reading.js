"use strict";
(() => {
  const root = document.getElementById("reading-root");
  if (!root) return;
  const el = (tag, text, cls) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  };
  const btn = (text, action, cls = "") => {
    const b = el("button", text, "read-button " + cls);
    b.type = "button";
    b.onclick = action;
    return b;
  };
  const labels = {
    new: "Chưa bắt đầu",
    progress: "Đang đọc",
    done: "Đã hoàn thành",
  };
  let user = Auth.user,
    rows = [],
    current = null,
    workspace = load(),
    tab = "text",
    scroll = { text: 0, questions: 0 },
    scrollSave;
  function key() {
    return "elio:reading-ui:v1:" + user;
  }
  function load() {
    try {
      const state = JSON.parse(sessionStorage.getItem(key()));
      return state && typeof state === "object" && !Array.isArray(state)
        ? { filters: {}, attempts: {}, listY: 0, ...state }
        : { filters: {}, attempts: {}, listY: 0 };
    } catch {
      return { filters: {}, attempts: {}, listY: 0 };
    }
  }
  function persist() {
    if (user !== Auth.user) return;
    try {
      sessionStorage.setItem(key(), JSON.stringify(workspace));
    } catch {
      const status = root.querySelector("[data-save]");
      if (status)
        status.textContent =
          "Không lưu được trên trình duyệt. Giữ trang mở để tiếp tục bài.";
    }
  }
  function sourceRows() {
    const imported = ReadingCore.catalog(Auth.get("materials", []));
    const samples = Object.values(EXAM_FORMATS).flatMap((profile) =>
      ReadingCore.catalog([
        {
          id: "sample:" + profile.exam + ":" + profile.level,
          type: "exam",
          name:
            "Elio · Bài luyện có sẵn · " + profile.exam + " " + profile.level,
          level: profile.level,
          items: examPracticeBank(profile),
        },
      ]),
    );
    return [...imported, ...samples];
  }
  function refresh() {
    if (user !== Auth.user) {
      user = Auth.user;
      workspace = load();
      current = null;
    }
    if (!Account.current()) {
      root.replaceChildren(el("p", "Vui lòng đăng nhập để mở bài đọc."));
      return;
    }
    rows = sourceRows();
    render();
  }
  function route() {
    const p = new URLSearchParams(location.hash.slice(1));
    return { id: p.get("lesson"), result: p.get("view") === "result" };
  }
  function navigate(id, result = false) {
    capture();
    location.hash = id
      ? new URLSearchParams({
          lesson: id,
          ...(result ? { view: "result" } : {}),
        }).toString()
      : "";
  }
  function state(row) {
    const found = workspace.attempts[row.id];
    return found?.version === row.version ? found : null;
  }
  function status(row) {
    const a = state(row);
    return !a ? "new" : a.finished ? "done" : "progress";
  }
  function start(row) {
    workspace.listY = window.scrollY;
    if (!state(row))
      workspace.attempts[row.id] = {
        version: row.version,
        answers: {},
        flags: {},
        scroll: { text: 0, questions: 0 },
        updated: Date.now(),
      };
    persist();
    navigate(row.id);
  }
  function capture() {
    if (current) {
      const a = state(current);
      if (a) {
        a.scroll = { ...scroll };
        a.tab = tab;
        persist();
      }
    }
  }
  function activate(which) {
    capture();
    tab = which;
    for (const name of ["text", "questions"]) {
      const pane = root.querySelector('[data-pane="' + name + '"]');
      if (pane) pane.dataset.active = String(name === tab);
      const b = root.querySelector('[data-tab="' + name + '"]');
      if (b) b.setAttribute("aria-selected", String(name === tab));
    }
    requestAnimationFrame(() => {
      for (const name of ["text", "questions"]) {
        const pane = root.querySelector('[data-pane="' + name + '"]');
        if (pane && pane.clientHeight) pane.scrollTop = scroll[name] || 0;
      }
    });
    const a = current && state(current);
    if (a) {
      a.tab = tab;
      persist();
    }
  }
  function card(row) {
    const node = el("article", undefined, "read-card"),
      meta = el("div", undefined, "read-meta");
    meta.append(
      el("span", [row.level, row.kind].filter(Boolean).join(" · ")),
      el("span", labels[status(row)]),
    );
    node.append(
      meta,
      el("h3", row.title),
      el(
        "p",
        row.task.description ||
          String(row.task.content || row.task.passage || row.collection)
            .replace(/[#*_]/g, "")
            .slice(0, 220),
        "read-muted",
      ),
    );
    const foot = el("footer");
    foot.append(
      el("span", (row.task.questions?.length || 0) + " câu hỏi", "read-muted"),
      btn(
        status(row) === "progress"
          ? "Tiếp tục →"
          : status(row) === "done"
            ? "Đọc lại →"
            : "Bắt đầu →",
        () => start(row),
      ),
    );
    node.append(foot);
    return node;
  }
  function library() {
    current = null;
    root.replaceChildren();
    const hero = el("header", undefined, "read-hero");
    hero.append(
      el("div", "LESEN / KHÔNG GIAN ĐỌC", "read-kicker"),
      el("h1", "Đọc để hiểu sâu hơn."),
      el(
        "p",
        "Chọn bài đọc, khám phá văn bản và luyện trả lời câu hỏi.",
        "read-muted",
      ),
    );
    root.append(hero);
    const f = workspace.filters,
      filters = el("section", undefined, "read-filters read-panel"),
      searchLabel = el("label", "Tìm bài đọc", "read-search"),
      search = el("input");
    search.type = "search";
    search.placeholder = "Tên bài, bộ đề hoặc nội dung…";
    search.value = f.search || "";
    searchLabel.append(search);
    filters.append(searchLabel);
    const ongoing = el("section"),
      list = el("section"),
      heading = el("h2"),
      grid = el("div", undefined, "read-grid");
    list.append(heading, grid);
    root.append(filters, ongoing, list);
    const draw = () => {
      const active = rows.filter(
        (r) =>
          (!f.search ||
            [r.title, r.collection, r.task.content, r.task.passage]
              .join(" ")
              .toLocaleLowerCase()
              .includes(f.search.toLocaleLowerCase())) &&
          (!f.level || r.level === f.level) &&
          (!f.topic || r.topic === f.topic) &&
          (!f.kind || r.kind === f.kind) &&
          (!f.status || status(r) === f.status),
      );
      heading.textContent = "Thư viện bài đọc · " + active.length;
      grid.replaceChildren(...active.map(card));
      if (!active.length) {
        const box = el("div", undefined, "read-empty read-panel");
        box.append(
          el("h3", "Không có bài đọc phù hợp"),
          el(
            "p",
            "Đổi bộ lọc hoặc nhập bài đọc trong phần Luyện thi.",
            "read-muted",
          ),
        );
        const link = el("a", "Mở Luyện thi →", "read-link");
        link.href = "pruefung.html";
        box.append(link);
        grid.append(box);
      }
    };
    search.oninput = () => {
      f.search = search.value;
      workspace.listY = 0;
      persist();
      draw();
    };
    for (const [field, label] of [
      ["level", "Cấp độ"],
      ["topic", "Chủ đề"],
      ["kind", "Dạng bài"],
      ["status", "Trạng thái"],
    ]) {
      const wrap = el("label", label),
        select = el("select"),
        all = el("option", "Tất cả");
      all.value = "";
      select.append(all);
      const options =
        field === "status"
          ? Object.keys(labels)
          : [...new Set(rows.map((r) => r[field]).filter(Boolean))].sort();
      for (const value of options) {
        const o = el("option", labels[value] || value);
        o.value = value;
        select.append(o);
      }
      select.value = f[field] || "";
      select.onchange = () => {
        f[field] = select.value;
        workspace.listY = 0;
        persist();
        draw();
      };
      wrap.append(select);
      filters.append(wrap);
    }
    filters.append(
      btn("Xóa bộ lọc", () => {
        workspace.filters = {};
        workspace.listY = 0;
        persist();
        library();
      }),
    );
    const pending = rows
      .filter((r) => status(r) === "progress")
      .sort((a, b) => state(b).updated - state(a).updated)
      .slice(0, 2);
    if (pending.length) {
      ongoing.append(el("h2", "Bài đang đọc dở"));
      const resume = el("div", undefined, "read-grid");
      resume.append(...pending.map(card));
      ongoing.append(resume);
    }
    draw();
    requestAnimationFrame(() =>
      window.scrollTo({ top: workspace.listY || 0, behavior: "instant" }),
    );
  }
  function enhanceSource(container, row, done) {
    if (done) {
      const quotes = (row.task.questions || [])
        .map((q) => q.evidence)
        .filter((q) => typeof q === "string" && q);
      for (const quote of quotes) {
        const walker = document.createTreeWalker(
          container,
          NodeFilter.SHOW_TEXT,
        );
        let text;
        while ((text = walker.nextNode())) {
          if (text.parentElement.closest("mark,button,script,style")) continue;
          const start = text.data.indexOf(quote);
          if (start < 0) continue;
          const tail = text.splitText(start);
          tail.splitText(quote.length);
          const mark = el("mark");
          tail.replaceWith(mark);
          mark.append(tail);
          break;
        }
      }
    }
    // Delegated word selection leaves source markup, tables and scroll untouched.
    container.addEventListener("click", (event) => {
      if (event.target.closest("a,button,input,textarea,select")) return;
      const selected = window.getSelection();
      if (selected && !selected.isCollapsed) return;
      const range = document.caretRangeFromPoint?.(
        event.clientX,
        event.clientY,
      );
      if (
        !range ||
        range.startContainer.nodeType !== Node.TEXT_NODE ||
        !container.contains(range.startContainer)
      )
        return;
      const text = range.startContainer.data,
        at = range.startOffset;
      let match;
      const regex = /[\p{L}]+(?:['’\-][\p{L}]+)*/gu;
      while ((match = regex.exec(text)))
        if (at >= match.index && at <= match.index + match[0].length) {
          WordDictionary.open(
            match[0],
            {
              sentence: text,
              sourceLabel: "Câu trong bài đọc",
              collection: "Từ bài đọc",
              level: row.level,
            },
            event.target,
          );
          break;
        }
    });
    container.addEventListener("pointerup", () => {
      const selection = window.getSelection();
      const control = root.querySelector("[data-lookup]");
      if (!control) return;
      const valid =
        selection &&
        !selection.isCollapsed &&
        container.contains(selection.anchorNode) &&
        container.contains(selection.focusNode) &&
        selection.toString().trim().length <= 120;
      control.hidden = !valid;
      if (valid) {
        const value = selection.toString().trim();
        control.onclick = () =>
          WordDictionary.open(
            value,
            {
              sentence: selection.anchorNode?.parentElement?.textContent || "",
              sourceLabel: "Cụm trong bài đọc",
              collection: "Từ bài đọc",
              level: row.level,
            },
            control,
          );
      }
    });
  }
  function lesson(row, result) {
    current = row;
    let a = state(row);
    const stale = !!workspace.attempts[row.id] && !a;
    if (!a) {
      a = workspace.attempts[row.id] = {
        version: row.version,
        answers: {},
        flags: {},
        scroll: { text: 0, questions: 0 },
        updated: Date.now(),
      };
      persist();
    }
    tab = a.tab || "text";
    scroll = { text: 0, questions: 0, ...a.scroll };
    root.replaceChildren();
    const crumb = el("nav", undefined, "read-breadcrumb");
    crumb.setAttribute("aria-label", "Breadcrumb");
    crumb.append(
      btn("← Đọc", () => navigate(null)),
      el(
        "span",
        [row.level, row.topic, row.kind, result ? "Kết quả" : row.title]
          .filter(Boolean)
          .join(" / "),
      ),
    );
    root.append(crumb);
    const hero = el("header", undefined, "read-hero");
    hero.append(el("div", row.collection, "read-kicker"), el("h1", row.title));
    if (row.task.instructions) hero.append(el("p", row.task.instructions));
    if (row.task.minutes)
      hero.append(
        el(
          "p",
          "Thời gian theo nguồn: " + row.task.minutes + " phút",
          "read-muted",
        ),
      );
    hero.append(
      el(
        "p",
        "Nhấp từ hoặc chọn cụm từ trong văn bản để tra nghĩa.",
        "read-muted",
      ),
    );
    root.append(hero);
    if (stale)
      root.append(
        el(
          "p",
          "Nguồn bài đã thay đổi. Đang mở bản hiện tại; câu trả lời cũ không được chấm với đáp án mới.",
          "read-status",
        ),
      );
    const report = ReadingCore.results({
      items: [row.task],
      answers: [a.answers],
    });
    if (result && !a.finished) {
      root.append(
        el(
          "p",
          "Bài này chưa được nộp. Tiếp tục trả lời rồi bấm Nộp bài.",
          "read-status",
        ),
      );
    }
    if (result && a.finished) {
      const summary = el("section", undefined, "read-panel read-result"),
        graded = report.filter((r) => r.graded),
        correct = graded.filter((r) => r.correct).length,
        blank = report.filter((r) => !String(r.provided).trim()).length;
      summary.append(
        el("div", "KẾT QUẢ BÀI ĐỌC", "read-kicker"),
        el("strong", correct + " / " + graded.length),
        el(
          "p",
          correct +
            " đúng · " +
            report.filter(
              (r) => r.graded && !r.correct && String(r.provided).trim(),
            ).length +
            " sai · " +
            blank +
            " bỏ trống · " +
            report.filter((r) => !r.graded).length +
            " chưa có đáp án nguồn",
          "read-muted",
        ),
      );
      const actions = el("div", undefined, "read-actions");
      actions.append(
        btn("Đọc lại", () => {
          a.tab = "text";
          persist();
          navigate(row.id);
        }),
        btn(
          "Làm lại câu sai / bỏ trống",
          () => retry(row, a, report, true),
          "primary",
        ),
        btn("Làm lại toàn bài", () => retry(row, a, report, false)),
      );
      summary.append(actions);
      root.append(summary);
    }
    const tabs = el("div", undefined, "read-mobile-tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Văn bản và câu hỏi");
    for (const [name, label] of [
      ["text", "Văn bản"],
      ["questions", result ? "Đáp án" : "Câu hỏi"],
    ]) {
      const b = btn(label, () => activate(name));
      b.dataset.tab = name;
      b.id = "read-tab-" + name;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", "read-pane-" + name);
      b.setAttribute("aria-selected", String(tab === name));
      b.onkeydown = (e) => {
        if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault();
          const next = name === "text" ? "questions" : "text";
          activate(next);
          tabs.querySelector('[data-tab="' + next + '"]').focus();
        }
      };
      tabs.append(b);
    }
    root.append(tabs);
    const work = el("div", undefined, "read-workspace"),
      text = el("section", undefined, "read-panel read-pane read-text"),
      questions = el("section", undefined, "read-panel read-pane");
    for (const [pane, name] of [
      [text, "text"],
      [questions, "questions"],
    ]) {
      pane.dataset.pane = name;
      pane.id = "read-pane-" + name;
      pane.dataset.active = String(tab === name);
      pane.setAttribute(
        "aria-label",
        name === "text" ? "Văn bản bài đọc" : "Câu hỏi bài đọc",
      );
      pane.onscroll = () => {
        if (pane.clientHeight) {
          scroll[name] = pane.scrollTop;
          clearTimeout(scrollSave);
          scrollSave = setTimeout(capture, 150);
        }
      };
    }
    work.append(text, questions);
    root.append(work);
    text.append(el("h2", row.title));
    const source = el("div", undefined, "read-source learning-content");
    source.lang = "de";
    source.innerHTML = TelcExam.sourceHTML(row.task);
    if (TelcExam.imageURL(row.task.imageUrl)) {
      const image = el("img");
      image.src = row.task.imageUrl;
      image.alt = "Trang nguồn · " + row.title;
      source.append(image);
    }
    text.append(source);
    const lookup = btn("Tra nghĩa cụm đã chọn", () => {});
    lookup.dataset.lookup = "";
    lookup.hidden = true;
    text.append(lookup);
    enhanceSource(source, row, a.finished);
    questions.append(el("h2", a.finished ? "Đối chiếu đáp án" : "Câu hỏi"));
    const count = el("p", undefined, "read-muted"),
      nav = el("nav", undefined, "read-q-nav");
    nav.setAttribute("aria-label", "Điều hướng câu hỏi");
    questions.append(count, nav);
    const navButtons = [];
    function progress() {
      const filled = report.filter((r) =>
        String(a.answers[r.questionId] ?? "").trim(),
      ).length;
      count.textContent = filled + " / " + report.length + " đã trả lời";
      navButtons.forEach((b, i) => {
        b.classList.toggle(
          "answered",
          !!String(a.answers[report[i].questionId] ?? "").trim(),
        );
        b.classList.toggle("flagged", !!a.flags[report[i].questionId]);
        b.textContent = i + 1 + (a.flags[report[i].questionId] ? " ⚑" : "");
      });
    }
    (row.task.questions || []).forEach((q, index) => {
      const id = q.id || "q" + index,
        section = el("article", undefined, "read-question");
      section.id = "read-question-" + index;
      const jump = btn(String(index + 1), () => {
        questions.scrollTo({
          top:
            section.getBoundingClientRect().top -
            questions.getBoundingClientRect().top +
            questions.scrollTop -
            20,
          behavior: "smooth",
        });
        section.querySelector("input,button")?.focus({ preventScroll: true });
      });
      jump.setAttribute("aria-label", "Câu " + (index + 1));
      nav.append(jump);
      navButtons.push(jump);
      const head = el("div", undefined, "read-q-head"),
        flag = btn(
          "⚑",
          () => {
            a.flags[id] = !a.flags[id];
            flag.setAttribute("aria-pressed", String(!!a.flags[id]));
            progress();
            persist();
          },
          "read-flag",
        );
      flag.setAttribute("aria-label", "Đánh dấu xem lại câu " + (index + 1));
      flag.setAttribute("aria-pressed", String(!!a.flags[id]));
      head.append(
        el("h3", index + 1 + ". " + (q.prompt || q.question || id)),
        flag,
      );
      section.append(head);
      if (q.instructions) section.append(el("p", q.instructions, "read-muted"));
      const change = (value) => {
        if (a.finished || user !== Auth.user) return;
        a.answers[id] = value;
        a.updated = Date.now();
        progress();
        persist();
      };
      if (Array.isArray(q.options) && q.options.length) {
        const opts = el("div", undefined, "read-options");
        q.options.forEach((value, j) => {
          const label = el("label", undefined, "read-option"),
            radio = el("input");
          radio.type = "radio";
          radio.name = "read-answer-" + index;
          radio.value = String(value);
          radio.checked = String(a.answers[id] ?? "") === String(value);
          radio.disabled = !!a.finished;
          radio.onchange = () => change(radio.value);
          const display = Array.isArray(q.optionTexts)
            ? q.optionTexts[j]
            : q.optionTexts?.[value];
          label.append(
            radio,
            el("span", String(value) + (display ? " · " + display : "")),
          );
          opts.append(label);
        });
        section.append(opts);
      } else {
        const label = el("label", "Câu trả lời"),
          input = el("input");
        input.value = a.answers[id] ?? "";
        input.disabled = !!a.finished;
        input.oninput = () => change(input.value);
        label.append(input);
        section.append(label);
      }
      if (a.finished) {
        const r = report[index],
          feedback = el("div", undefined, "read-feedback");
        feedback.append(
          el(
            "strong",
            !r.graded
              ? "Chưa chấm · thiếu đáp án nguồn"
              : !String(r.provided).trim()
                ? "Bỏ trống"
                : r.correct
                  ? "✓ Đúng"
                  : "× Sai",
            r.correct ? "read-correct" : "",
          ),
          el("p", "Bạn trả lời: " + (r.provided || "Chưa trả lời")),
          el(
            "p",
            "Đáp án nguồn: " + (r.graded ? r.keys.join(" / ") : "Chưa có"),
          ),
        );
        if (typeof q.explanation === "string")
          feedback.append(el("p", q.explanation));
        if (typeof q.evidence === "string" && q.evidence) {
          const quote = el("blockquote");
          quote.append(el("mark", q.evidence));
          feedback.append(quote);
        }
        section.append(feedback);
      }
      questions.append(section);
    });
    progress();
    const action = el("div", undefined, "read-submit");
    if (!a.finished) {
      const submit = btn(
        "Nộp bài",
        () => {
          if (user !== Auth.user) return;
          capture();
          a.finished = true;
          a.updated = Date.now();
          persist();
          navigate(row.id, true);
        },
        "primary",
      );
      submit.disabled = !report.length;
      action.append(
        el(
          "p",
          report.length
            ? "Có thể nộp khi chưa trả lời hết; câu bỏ trống được giữ để đối chiếu."
            : "Bài chưa có câu hỏi. Bạn vẫn có thể đọc văn bản nguồn.",
          "read-muted",
        ),
        submit,
      );
    } else
      action.append(
        btn("Xem kết quả", () => navigate(row.id, true), "primary"),
      );
    questions.append(action);
    const save = el(
      "p",
      "Bài đang làm được giữ trong phiên trình duyệt, theo tài khoản.",
      "read-status",
    );
    save.dataset.save = "";
    root.append(save);
    requestAnimationFrame(() => {
      activate(tab);
    });
  }
  function retry(row, a, report, wrongOnly) {
    const next = wrongOnly
      ? Object.fromEntries(
          report
            .filter((r) => r.graded && r.correct)
            .map((r) => [r.questionId, a.answers[r.questionId]]),
        )
      : {};
    workspace.attempts[row.id] = {
      version: row.version,
      answers: next,
      flags: {},
      tab: "questions",
      scroll: { text: 0, questions: 0 },
      updated: Date.now(),
    };
    persist();
    current = null;
    navigate(row.id);
    if (route().result === false) render();
  }
  function render() {
    const requested = route();
    if (!requested.id) {
      library();
      return;
    }
    const row = rows.find((r) => r.id === requested.id);
    if (!row) {
      current = null;
      root.replaceChildren(
        el("h1", "Không tìm thấy bài đọc"),
        el(
          "p",
          "Bài đã được chuyển, xóa hoặc tài khoản hiện tại không có quyền xem.",
          "read-muted",
        ),
        btn("← Danh sách bài đọc", () => navigate(null)),
      );
      return;
    }
    lesson(row, requested.result);
  }
  window.addEventListener("hashchange", () => {
    capture();
    render();
    if (route().id) window.scrollTo({ top: 0, behavior: "instant" });
  });
  window.addEventListener("pagehide", capture);
  document.addEventListener("authchange", refresh);
  document.addEventListener("cloudchange", () => {
    capture();
    refresh();
  });
  document.addEventListener("exam-library-change", () => {
    capture();
    refresh();
  });
  refresh();
})();
