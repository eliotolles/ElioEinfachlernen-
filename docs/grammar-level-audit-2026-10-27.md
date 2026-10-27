# Kiểm tra danh mục Grammatik · 27/10/2026

Đối chiếu trực tiếp file `Pasted text(2).txt` chủ dự án gửi với nhánh `migrate/vercel` tại `1841a94`.

| Level | Dòng nguồn | Chủ điểm không trùng trong level | Thiếu tên so với danh sách |
| --- | --- | --- | --- |
| A1 | 70 | 70 | 0 |
| A2 | 110 | 109 | 0 |
| B1 | 119 | 118 | 0 |
| B2 | 70 | 70 | 0 |
| C1 | 18 | 18 | 0 |

Tổng 385 liên kết level–chủ điểm, 165 chủ điểm duy nhất. Hai dòng trùng `im Dativ` trong A2 và B1 được giữ một lần trong mỗi level. Các mục lặp giữa các level vẫn giữ nguyên theo danh sách; không nhân bản ID hoặc tiến độ.

## Thay đổi

- Danh mục có nút A1/A2/B1/B2/C1, không mặc định trộn A1–C1.
- Thứ tự của từng level lấy từ danh sách cung cấp; nhóm nội dung vẫn được gom để đọc mục lục.
- Ghi nhớ level trên phiên trình duyệt và tiếp tục bài đã học; không ghi lại tài liệu hay lịch sử người dùng.
- Chữ danh mục lớn hơn; nền, tranh, theme và các tab Nội dung/Sơ đồ tư duy/Bài tập được giữ.
- Phân biệt level đang chọn với toàn bộ level áp dụng của bài tham chiếu.
- Xuất JSON đầy đủ `public/data/grammar-atlas-export-v2.json`: `lessons` giữ bài giảng/bài tập/ID hiện có, `levelIndex` tham chiếu đúng từng level. Đây là xuất dữ liệu hiện tại đã phân loại, không phải tuyên bố biên soạn mới tất cả bài giảng.
- Không thay schema, không ghi Turso và không xóa dữ liệu học.

## Thiếu sót còn lại

- Có 42 bài tham chiếu được dùng bởi 165 mục. Các mục cùng chương vẫn có phần lý thuyết chung; chưa phải 165 bài riêng biệt theo từng level.
- 163/165 mục có dưới 10 câu bài tập. Yêu cầu tối thiểu 10 câu/chủ điểm chưa đạt. Hai bài Akkusativ/Dativ được hiệu đính trước có 12 câu mỗi bài.
- Các nhãn rút gọn `im Akkusativ`, `im Dativ`, `im Genitiv`, `mit bestimmtem Artikel`, `mit unbestimmtem Artikel`, `mit Komparativ und Superlativ`, `mit was und wo`, `ohne Artikel` thiếu ngữ cảnh trong file nguồn. Giữ nhãn gốc và phụ đề hiện có; chưa khẳng định phụ đề là ý định chính xác của nguồn.
- Cấp độ giữ theo danh sách người dùng, không tuyên bố mọi chủ điểm bắt buộc thuộc đúng một level CEFR.
- Chưa thẩm định học thuật từng câu trên toàn bộ 165 mục. Kiểm thử bảng/đáp án không thay thế việc này.

## Kiểm thử

11 tests pass: `grammar-atlas`, `grammar-flat`, `grammar-level-catalogue`. Kiểm tra đầy đủ chủ điểm và thứ tự, ID ổn định, import không đổi, bảng Markdown render, đáp án có giải thích và file xuất khớp runtime. JavaScript thay đổi kiểm tra cú pháp thành công.

Chưa kiểm thử trực tiếp giao diện production của bản sửa này. Đẩy GitHub không tự chứng minh Vercel đã triển khai đúng commit.
