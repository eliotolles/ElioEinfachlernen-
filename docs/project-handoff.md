# Bàn giao Elio Einfach — 21/10/2026

## Phạm vi và nguyên tắc
Chủ dự án: Nguyễn Viết Đạt; GitHub: eliotolles.
Repo: https://github.com/eliotolles/ElioEinfachlernen-
Production: https://elio-einfach.dat-nguyenviet-1999.workers.dev/
Chỉ dùng dịch vụ miễn phí. Không tạo lại app, rollback, thay database hoặc thay quyền.
Nhiệm vụ hiện tại chỉ bổ sung dữ liệu từ vựng; không sửa UI hoặc triển khai web.
Không đưa credential, backup dữ liệu người dùng, token hoặc API key vào repo.

## Trạng thái đã xác minh
- Remote HEAD khi kiểm tra: fad90ce0f6848a89791dc7a6c7e4fe446d75763f.
- Commit ngày 20/10/2026: Stop rebuilding hidden vocabulary tabs and eliminate per-word collection cloning.
- GitHub connector xác nhận repository có quyền push/admin. Đây là quyền repo, không phải quyền trong ứng dụng.
- Web production hiển thị trang bìa; đăng nhập email/mật khẩu qua biểu mẫu bảo mật thành công, sau đó thấy dashboard.
- Chưa xác minh vai trò ứng dụng của phiên này. Không tự nâng quyền.
- Khi bắt đầu xuất backup, runtime trình duyệt từ chối thao tác vì retained browser data remains restricted after native credential delivery. Recovery qua tab mới cũng báo native credential state cannot be safely resumed.
- Không nhận được đường dẫn tệp backup, chưa đọc được JSON mới nhất, chưa xác minh số mục hay version hiện tại.
- Chưa kết nối trực tiếp Turso/Cloudflare; chưa xác minh gói dịch vụ hay commit production.
- Không có dữ liệu nào được cập nhật. Số trường bổ sung: 0. Số trống trước/sau: chưa đo.

## Cấu trúc source và triển khai
- public/: HTML/CSS/JavaScript frontend; public/js/session.js quản lý tài khoản, dữ liệu và đồng bộ.
- worker/index.js: xác thực, API, Turso SQL, AI backend.
- db/schema.sql: schema SQL; scripts/: build; tests/: kiểm thử; docs/: tài liệu.
- wrangler.jsonc: Worker elio-einfach, entry cloudflare/worker.mjs, compatibility_date 2026-10-18, build npm run build:cloudflare.
- scripts/build-cloudflare.mjs ghép assets public và worker/index.js thành entry trên; assets có version và ảnh được tách.
- package.json có build, test, build:cloudflare, deploy:cloudflare.
- Không thấy thư mục .github trong checkout đã đọc; chưa xác minh cấu hình tự triển khai trong dashboard Cloudflare.
- Không chạy deploy hoặc thay cấu hình hosting.

## Nguồn từ vựng và kiểm soát version
- app_records có khóa (user_id,name); app_shared có khóa name. Cả hai lưu value JSON, version, updated_at.
- worker/index.js: GET /api/state trả dữ liệu cá nhân, shared và version; không dùng API admin cấu hình AI để kiểm tra từ vựng.
- PUT /api/state cập nhật dữ liệu cá nhân; PUT /api/shared yêu cầu super_admin.
- saveRecord dùng UPDATE ... WHERE ... AND version=? và tăng version. Không khớp trả 409 kèm latest.
- Giới hạn payload của một bản ghi: 1.500.000 byte; dữ liệu bổ sung có thể vượt giới hạn này. Phải đo kích thước trước khi ghi, không tự sửa backend/triển khai để lách giới hạn.
- public/js/session.js Account.get gộp shared và own, ưu tiên shared theo ID. Bản xuất UI gộp dữ liệu, không kèm version/ranh giới sở hữu; không đủ làm snapshot phục hồi chính xác từng row.
- Account.set khi là super_admin ghi các key shared; dùng restore một bản gộp có thể đưa dữ liệu riêng thành chung. Không dùng restore backup để cập nhật nhiệm vụ này khi chưa đối chiếu ownership.
- public/js/vocab-catalog.js và vocab-catalog-ui.js lấy các từ học từ vocab; materials cung cấp thông tin bộ.
- public/js/import.js lưu danh sách gốc tại materials[].items; public/js/wortschatz.js addWords tạo bản vocab riêng. Phải đối chiếu cả hai theo ID và ngữ cảnh; không giả định ID của hai bản giống nhau.
- public/js/vocabulary.js enrichSavedDeck chỉ bổ sung vocab, không bảo đảm materials.items đã được bổ sung.
- UI có quy tắc coi một số placeholder là trống. Với yêu cầu “không ghi đè nội dung đã có”, phải thống kê placeholder riêng và không tự coi mọi giá trị không phải string là được phép ghi đè.
- synonyms/phrases có thể là mảng object gồm de,vi,en,meaningDe,example. Giữ nguyên mục đã có, thứ tự và ô đã điền. Không ép mọi từ phải có từ đồng nghĩa; [] có thể là kết quả hợp lệ.

## Hai bộ cần xử lý
| Bộ | deckId | Số mục do chủ dự án cung cấp, chưa xác minh lại |
| --- | --- | --- |
| Goethe-Zertifikat B1 Wortliste | fbaaf2fe-c8a9-4d7b-b612-d8b8e5d05266 | 1.500 |
| Netzwerk neu B1 | 64ab1e8c-f2c9-4cc8-ba57-3c22d120cd2e | 1.828 |

Chỉ được bổ sung vi, en, meaningDe, type, example, exampleVi, synonyms, phrases.
Giữ nguyên ID, tên bộ, level, ownership, tiến độ và tất cả giá trị đã có.

## Tiếp tục công việc
1. Khôi phục một phiên truy cập bảo mật hoạt động. Không yêu cầu người dùng gửi mật khẩu/token/API key trong chat.
2. Đọc mới nhất đúng các row vocab/materials trong app_shared và app_records thuộc phạm vi được phép; xác định row chứa hai bộ. Không đọc bảng session/password/AI secrets.
3. Lưu snapshot riêng tư trước sửa gồm value nguyên bản, row scope, version, updated_at, thời điểm và checksum. Không commit backup vào repo.
4. Đếm ô trống theo bộ, nguồn và trường; tách missing/null/chuỗi trắng, placeholder, mảng rỗng và các ô con.
5. Tạo patch theo ID + trường, chỉ bổ sung ô thực sự trống, kiểm tra ngữ nghĩa từng từ và ví dụ. Không bịa synonym hoặc dùng ví dụ mẫu chung.
6. Đọc lại trước ghi; rebase patch trên dữ liệu mới nhất. Nếu ô đã được thiết bị khác điền thì bỏ qua. Ghi bằng version hiện hành; 409 phải đọc lại và hợp nhất, không dùng “giữ bản thiết bị” để ghi đè toàn bản.
7. Đọc lại server, so sánh mọi ô trước đó có dữ liệu và metadata, xác nhận không đổi; báo số trống trước/sau và tổng ô bổ sung. Báo riêng các trường hợp không có synonym phù hợp.
8. Cập nhật tài liệu này bằng kết quả thực tế. Không sửa UI, không deploy và không bật dịch vụ trả phí.

## Chức năng phải bảo toàn
Ngữ pháp; từ vựng; Quiz/SRS; viết; nói AI; nghe chép chính tả YouTube; thi thử; import và phân loại; chữa bài chi tiết tiếng Việt/ví dụ Đức; giải thích đáp án; fallback AI/quota/tiếp nối phản hồi; tài khoản và đồng bộ; shared/private ownership; Super Admin và key backend; UI sách/nghệ thuật đã duyệt, ba ngôn ngữ, theme, cỡ chữ, cache module/tab và bài đang làm.
