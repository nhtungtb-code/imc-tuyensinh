# IMC Tuyển sinh

Web app giúp leader marketing của trường lập kế hoạch IMC (truyền thông tích hợp) cho chiến dịch tuyển sinh. Giao diện theo bộ nhận diện EQuest.

App là một file HTML duy nhất ([index.html](index.html)), không cần cài đặt hay server.

## Tính năng

- Quy trình 5 bước: hồ sơ và mục tiêu, bối cảnh và đối thủ, chân dung và hành trình, thông điệp và USP, kênh, ngân sách và KPI. Bước 6 là bản kế hoạch hoàn chỉnh, in hoặc lưu PDF được.
- Mọi ô đều không bắt buộc. Thiếu thông tin cứ để trống, bản kế hoạch đánh dấu phần còn thiếu để bổ sung sau.
- Tự lưu trên trình duyệt. Có xuất và nạp file sao lưu (.json).
- AI (Claude): nhập tự động từ brochure PDF, dán dữ liệu thô vào từng bước, gợi ý SWOT, chân dung, hành trình, thông điệp và mix kênh.

## Cách dùng

- Mở trực tiếp: bấm đúp `index.html`, hoặc mở link GitHub Pages của repo.
- Muốn dùng AI: bấm **Cài đặt AI (API key)** và dán Anthropic API key của bạn.

## Quyền riêng tư và bảo mật

- Dữ liệu kế hoạch và API key lưu trong trình duyệt của từng máy (localStorage). Không có server nào của dự án này lưu dữ liệu.
- Khi dùng AI, nội dung bạn nhập hoặc file PDF được gửi thẳng từ trình duyệt tới Anthropic. Không dùng tài liệu nội bộ chưa được phép chia sẻ.
- Không nhập API key trên máy dùng chung. Mỗi người dùng key của mình.
- Key nằm trong trình duyệt nên không phù hợp cho triển khai nhiều người dùng chung một key. Khi đó cần một server trung gian giữ key.

## Phụ thuộc bên ngoài

- Font Be Vietnam Pro và Lora từ Google Fonts.
- Thư viện `@anthropic-ai/sdk` (ghim phiên bản 1.3.0) tải từ cdn.jsdelivr.net khi dùng AI. Cần có mạng.

## Ghi chú

- Logo EQuest nhúng trong `index.html` (bản gốc ở `assets/equest-logo.png`). Chỉ chia sẻ repo trong phạm vi được EQuest cho phép.
- Số liệu và gợi ý mẫu theo cấp học là tham khảo, cần chỉnh theo thực tế từng trường.
