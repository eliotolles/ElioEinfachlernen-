# Grammatik cũ + bổ sung C1 và khôi phục tên mục

## Nội dung

- Rút bộ atlas 165 mục mới khỏi frontend, xóa các tài nguyên dữ liệu atlas mới và kiểm thử riêng của bộ đó. Giữ adapter giao diện `grammar-atlas-ui.js` và CSS vì người dùng muốn giữ cách trình bày mới.
- Giữ nguyên dữ liệu giáo trình A1–B2 trong `grammar-book-a1-b2.json`, tài liệu `materials` của tài khoản, lịch sử và tiến độ. Không thực hiện thao tác xóa/ghi hàng loạt trong Turso.
- Bổ sung 12 bài C1, tổng 120 câu bài tập biên soạn mới có đáp án và giải thích tiếng Việt. Mỗi bài bao quát một nhóm bài của PDF người dùng cung cấp, có các tiểu mục riêng; không tuyên bố mỗi tiểu mục là một bài riêng có 10 câu.
- Bao quát các chủ điểm từ trang PDF 1–22 của Sicher! C1 Grammatikübersicht. Quy tắc được diễn giải tiếng Việt; ví dụ và bài tập được viết mới. Không đưa PDF hay OCR nguyên trang lên frontend.
- Các hiệu đính gồm aus/vor nguyên nhân + Dativ, bekommen-Passiv là Rezipientenpassiv, ngoại lệ của động từ be-, sắc thái modal không phải phần trăm tuyệt đối và vị trí linh hoạt của nämlich/eben.

## Tích hợp dữ liệu

`grammar-c1-data.js` cung cấp nội dung C1 mặc định, mọi tài khoản đăng nhập đều đọc được sau khi bản mã được triển khai. JSON tương ứng tại `public/data/grammar-c1-sicher.json` dùng cùng schema collection/items như tài liệu grammar cũ.

Nếu đã có collection cùng ID `elio-c1-sicher-v1` trong materials thì dùng nguyên collection lưu trữ, không trộn lại mặc định. Nhờ vậy bản sửa và mục bị xóa không bị tự tái tạo. Chỉ Super Admin có nút sửa/xóa C1 chung; lần sửa đầu tạo bản override qua đường lưu materials dùng chung hiện có. User không được sửa bản mặc định. Tiến độ được lưu theo ID bài ổn định qua cơ chế cũ.

Đây là nội dung đi cùng mã nguồn, không tuyên bố đã ghi các bài C1 vào Turso tại thời điểm sửa mã. Bản override quản trị sử dụng hàng đợi đồng bộ và kiểm tra xung đột hiện có.

## Tên mục và font

Các tên đích trong mục lục, menu, kết quả tìm trang và breadcrumb dùng tiếng Đức: Grammatik, Wortschatz, Schreiben, Sprechen, Hören & Diktat, v.v. Mô tả và thao tác giữ ngôn ngữ giao diện. Khôi phục font Cormorant Garamond theo quy tắc của mục lục sách cũ; không đổi tranh, nền, theme, route, AI hay phân quyền module.

## Kiểm chứng

14 tests pass: dữ liệu C1/bảng/đáp án, đối chiếu JSON–JS, giữ tài liệu cũ, override quản trị, quyền user, số lượng level động, import cũ, đường dẫn mục lục, tìm kiếm ba ngôn ngữ và tên mục tiếng Đức. Kiểm tra cú pháp JavaScript thành công. Chưa có kiểm thử trình duyệt production hoặc kiểm chứng ghi override trên Turso thực tế.

Nguồn tham khảo bổ sung đã đọc để đối chiếu các điểm hiệu đính:
- IDS grammis, bekommen-Passiv: https://grammis.ids-mannheim.de/terminologie/390
- Universität Heidelberg, ProGram, quan hệ nguyên nhân: https://program.idf.uni-heidelberg.de/grammatik/ueberblick
