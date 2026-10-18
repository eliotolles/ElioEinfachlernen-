# Elio Einfach — chuyển sang Cloudflare Workers Free

Mã nguồn độc lập với Sites/ChatGPT. Sau khi triển khai trong tài khoản Cloudflare của bạn, website chạy bằng Cloudflare + Turso + API AI; không gọi ChatGPT để phục vụ người dùng.
Không cần chuyển framework hoặc tạo database khác. Giữ Workers Free và Turso Free; không bật gói trả phí.

## Triển khai qua GitHub

1. Cloudflare Dashboard → Workers & Pages → Create application → Import a repository / Connect to Git.
2. Chọn repo `eliotolles/ElioEinfachlernen-`, nhánh `main` và loại **Worker**, không phải Pages static.
3. Tên Worker: `elio-einfach` (phải khớp `name` trong `wrangler.jsonc`). Root directory: `/`.
4. Build command: `npm run build:cloudflare`.
5. Deploy command: `npx wrangler@4 deploy`.
6. Chọn Free; không nâng cấp hay bật dịch vụ tính phí. Deploy lần đầu có thể mở được trang giới thiệu nhưng API đăng nhập chưa chạy khi thiếu secrets.
7. Mở Settings → Variables and Secrets, thêm các giá trị dưới đây vào môi trường **production**, rồi Deploy lại.
8. URL thực tế sẽ có dạng `https://elio-einfach.<subdomain-cua-ban>.workers.dev`. Cloudflare cấp phần `<subdomain-cua-ban>`; không tự đoán URL.

Worker Builds có thể build lại vì cấu hình `build.command` trong Wrangler; cả hai lệnh build đều không có tác dụng phụ. Nếu dashboard cho bỏ trống build command, có thể để Wrangler tự build theo file cấu hình.

## Các biến môi trường

File `.env.cloudflare.example` là mẫu, không có token/mật khẩu thật.

| Key | Cách lấy |
| --- | --- |
| `TURSO_DATABASE_URL` | URL **database elio-einfach hiện có**, lấy trong màn hình Connect của Turso; file mẫu chỉ có placeholder. |
| `TURSO_AUTH_TOKEN` | Tạo token mới cho chính database đó trong Turso. Không tạo database mới và không thu hồi token đang dùng trên Sites khi chưa kiểm tra xong. |
| `AI_ENCRYPTION_KEY` | Dùng lại khóa gốc nếu bạn đã lưu riêng; nếu không có, tự tạo khóa mới như lệnh dưới rồi nhập vào Cloudflare dưới dạng Secret. |
| `ADMIN_EMAILS` | Ba email Super Admin đã chọn, ngăn cách bằng dấu phẩy; nhập trực tiếp vào Cloudflare, không đưa danh sách thật lên repo. |
| `ADMIN_INITIAL_PASSWORD` | **Không cần khi dùng database cũ**. Không đặt lại mật khẩu tài khoản có sẵn. Chỉ dùng để seed database trống. |

Tạo khóa mã hóa mới trên máy của bạn, không gửi lên GitHub:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Sites không trả lại giá trị đã đánh dấu Secret. Vì vậy không thể xuất đầy đủ các secret gốc bằng màn hình đó.
Nếu đổi `AI_ENCRYPTION_KEY`, các API key AI cũ trong Turso vẫn được mã hóa bằng khóa cũ và không giải mã được ở hosting mới.
Trong Admin trên hosting mới, thêm lại các API key AI của bạn, kiểm tra thành công rồi mới xóa từng cấu hình cũ nếu muốn.
Việc này chỉ liên quan API key; tài khoản, mật khẩu, bài làm và tài liệu giữ nguyên.
Nếu chạy cả hai hosting với khóa mã hóa khác nhau trên cùng database, mỗi hosting có thể không đọc được key do hosting kia thêm. Chuyển người dùng sang hosting mới sau khi kiểm tra; không coi hai hosting là một cụm chạy song song lâu dài.

## Chạy bằng CLI (tùy chọn)

```sh
npm run build:cloudflare
npx wrangler@4 login
npx wrangler@4 secret put TURSO_DATABASE_URL
npx wrangler@4 secret put TURSO_AUTH_TOKEN
npx wrangler@4 secret put AI_ENCRYPTION_KEY
npx wrangler@4 secret put ADMIN_EMAILS
npm run deploy:cloudflare
```

Wrangler có thể yêu cầu tạo Worker lần đầu trước khi đặt secrets: deploy một lần rồi nhập secrets và deploy lại.
Không commit `.env`, `.dev.vars`, token, mật khẩu hoặc key thật.

## Kiểm tra trước khi chuyển hẳn

- Mở URL `workers.dev` bằng cửa sổ ẩn danh: trang giới thiệu không yêu cầu tài khoản ChatGPT.
- Đăng nhập bằng tài khoản Elio cũ: dữ liệu từ Turso còn nguyên; tạo nháp và kiểm tra trên thiết bị thứ hai.
- Kiểm tra một tài khoản thường không vào được `/api/admin/*`.
- Thêm lại key AI nếu đổi khóa mã hóa, rồi thử chữa bài và import.
- Theo dõi CPU time và lỗi thực tế trong Cloudflare. Free có giới hạn yêu cầu và CPU; không hứa chạy không giới hạn. Không hạ độ an toàn hash mật khẩu để né giới hạn.
- File ảnh/PDF gốc và các bản nháp chưa đồng bộ chỉ ở thiết bị/trình duyệt cũ. Đồng bộ/xuất backup trước khi đổi tên miền; dữ liệu localStorage/IndexedDB không tự chuyển giữa hai tên miền.
- Chưa xóa website Sites, database hoặc token cũ trước khi kiểm tra xong.

## Google Search

Trang `/` là trang giới thiệu công khai, có title/description/canonical/structured data. Các tính năng học vẫn yêu cầu đăng nhập; API vẫn xác thực và phân quyền ở backend.
`/robots.txt` và `/sitemap.xml` dùng đúng origin mới. Các trang tài khoản/học tập có `noindex`.
Thêm URL thật vào Google Search Console dưới dạng URL-prefix, xác minh quyền sở hữu, gửi `/sitemap.xml` và yêu cầu lập chỉ mục trang chủ.
Google không bảo đảm lập chỉ mục hoặc thời gian xuất hiện khi tìm tên.

## Tài liệu chính thức đã kiểm tra 18/10/2026

- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/workers/ci-cd/builds/
- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.google.com/search/docs/essentials/technical
