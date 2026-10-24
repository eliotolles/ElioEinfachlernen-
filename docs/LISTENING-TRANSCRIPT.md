# Phụ đề cho mục Nghe

## Luồng học

Nghe → YouTube → thêm video → lấy phụ đề tiếng Đức → xem lời / chép chính tả / shadowing / quiz.

Không tạo kho phụ đề thứ hai. Bản thành công được hàng đợi hiện có lưu vào listeningV2 hoặc listeningLibraryV2 tùy quyền, cùng tiến độ và phạm vi cá nhân/chung hiện tại. Mốc thời gian tính bằng giây. Tải SRT/VTT dùng chính bản lời của video đang mở.

- Nếu không đọc được tên video từ metadata, vẫn có thể thêm video bằng mã; lỗi metadata không chặn bước lấy phụ đề.
- Nếu nguồn Python báo lỗi, không ghi bản rỗng và không tự chuyển sang AI. Người học có thể thử lại hoặc nhập SRT/VTT.
- Bộ nghe/quiz/shadowing và các câu có sẵn không bị thay thế.
- Super Admin mở Quản trị phần nghe → Cấu hình nguồn transcript để kiểm tra kết nối hoặc thử video mà không thêm video vào kho.

## Vercel mặc định: không cần host Python riêng

api/handler.js giữ xác thực tài khoản và giới hạn lượt gọi của Worker. Khi xử lý /api/listening/captions, nó gọi Python tại /api/transcript qua callback nội bộ. Payload có chữ ký HMAC với thời hạn 90 giây, dùng khóa ứng dụng hiện có AI_ENCRYPTION_KEY; khóa không đưa ra trình duyệt.

api/transcript.py chỉ chạy bộ lấy phụ đề sau khi xác minh chữ ký và payload. Không truy cập database học tập. Cache SQLite đặt trong /tmp, không coi là lưu trữ bền vững. Dữ liệu học thật vẫn do Worker/Turso lưu theo cơ chế đang có.

Python runtime cài thư viện từ requirements.txt. services/transcript chứa engine Python và yt-dlp. Backend có thời gian chờ 55 giây tổng, giới hạn 2 tác vụ đồng thời trên một instance; nguồn dự phòng nằm trong ngân sách này.

Vercel cần triển khai cả hai Functions: api/handler.js (Node) và api/transcript.py (Python).

Rule /api/transcript phải đứng trước rule bắt toàn bộ /api/*. Build Vercel sao chép adapter vào vercel-server. Các build cũ cũng sao chép adapter đến output tương ứng.

GET /api/transcript chỉ là health, không chứng minh lấy được phụ đề. POST không có chữ ký phải trả 401. Chỉ coi toàn bộ chức năng hoạt động khi thử video thật qua web và nhận bản lời có nội dung, đúng tiếng Đức, sau đó đồng bộ và mở lại thành công.

## Backend bên ngoài (không bắt buộc)

Nếu đặt TRANSCRIPT_BACKEND_URL hoặc TRANSCRIPT_BACKEND_TOKEN, app dùng cấu hình ngoài thay vì Python tích hợp. Phải có cả hai:
- URL là HTTPS origin, không có path/query.
- Token khớp ELIO_TRANSCRIPT_TOKEN của Docker/Python server ngoài.

Không đưa token hoặc cookie lên frontend. Không dùng URL demo localhost cho web online. Bỏ hai biến để trở về Python tích hợp trên Vercel.

## Kiểm tra và triển khai

- npm test
- python -m pip install -r requirements.txt
- python -m unittest discover -s services/transcript/tests -v
- npm run build:vercel

Sau khi Vercel build thành công, đăng nhập Super Admin và dùng nút kiểm tra kết nối / thử video trong mục Nghe. Thử ít nhất 3 mã video khác nhau, đúng ngôn ngữ, bao gồm video mới chưa có cache. Báo riêng kết quả cục bộ và máy chủ thực tế. YouTube có thể chặn IP của Vercel; không suy ra tính ổn định của host từ test cục bộ và không khẳng định hỗ trợ mọi video riêng tư hay video thiếu phụ đề.

Đổi lại deployment trước đó hoặc revert commit tích hợp để rollback mã. Không cần migration, reset hay xóa dữ liệu học tập.
