# IMC Tuyển sinh

Web app giúp leader marketing của trường lập kế hoạch IMC (truyền thông tích hợp) cho chiến dịch tuyển sinh. Giao diện theo bộ nhận diện EQuest.

App là một file HTML duy nhất ([index.html](index.html)), không cần cài đặt hay server.

## Tính năng

- Quy trình 5 bước: hồ sơ và mục tiêu, bối cảnh và đối thủ, chân dung và hành trình, thông điệp và USP, kênh, ngân sách và KPI. Bước 6 là bản kế hoạch hoàn chỉnh, in hoặc lưu PDF được.
- Mọi ô đều không bắt buộc. Thiếu thông tin cứ để trống, bản kế hoạch đánh dấu phần còn thiếu để bổ sung sau.
- Tự lưu trên trình duyệt. Có xuất và nạp file sao lưu (.json).
- AI (Claude): nhập tự động từ brochure PDF, dán dữ liệu thô vào từng bước, gợi ý SWOT, chân dung, hành trình, thông điệp và mix kênh.
- Hồ sơ đối thủ: điền tên, website, fanpage hoặc bất kỳ thông tin nào, bấm **AI tìm thông tin trên web** để Claude tìm phần còn lại (học phí, điểm mạnh, điểm yếu có nguồn) và ghi lại link nguồn. Chỉ điền ô còn trống, cần kiểm chứng.

## Dùng ngay trên web

Mở: https://nhtungtb-code.github.io/imc-tuyensinh/

Không cần cài đặt. Dữ liệu và API key lưu riêng trên trình duyệt của từng người.

## Tải về dùng offline

Bấm file **index.html**, chọn **Download raw file**, rồi bấm đúp file đã tải để mở bằng Chrome hoặc Safari. Nên xuất file sao lưu (.json) trước khi thay bằng bản mới.

## Cách dùng

- Muốn dùng AI: bấm **Cài đặt AI (API key)** và dán Anthropic API key của bạn.

## Hai cách cấp AI

1. **Mỗi người dùng API key riêng** (mặc định): bấm **Cài đặt AI (API key)** và dán key Anthropic của mình. Key lưu trong trình duyệt, app gọi thẳng tới Anthropic.
2. **Đơn vị cấp AI chung** (khuyến nghị cho team): đặt key của đơn vị trên một máy chủ trung gian nhỏ (thư mục [worker](worker), chạy trên Cloudflare Workers). Người dùng chỉ nhập **mã truy cập** do quản trị viên phát, không cần và không thấy API key. Bật bằng cách điền địa chỉ máy chủ vào `PROXY_URL` đầu phần AI trong `index.html`.

### Triển khai máy chủ trung gian (quản trị viên)

Cần tài khoản Cloudflare (gói miễn phí đủ dùng) và Node.js. Chạy trong thư mục `worker`:

```bash
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY   # dán API key khi được hỏi
npx wrangler secret put ACCESS_CODE         # đặt mã truy cập phát cho người dùng
npx wrangler deploy
```

Lệnh cuối in ra địa chỉ dạng `https://imc-tuyensinh-ai.<tên>.workers.dev`. Điền địa chỉ đó vào `PROXY_URL` rồi đẩy lên GitHub.

Máy chủ trung gian chỉ nhận lời gọi từ trang web trong `ALLOWED_ORIGINS` (`worker/wrangler.toml`), chỉ cho dùng mô hình Claude Sonnet 5.5, giới hạn độ dài trả lời, và từ chối mọi tham số khác. Công cụ duy nhất được phép là tìm kiếm web (tối đa 5 lượt mỗi lần gọi), dùng cho tính năng tìm đối thủ. Tính năng này cần bật Web search trong Anthropic Console (Settings, Privacy) và tính phí tìm kiếm riêng. Nên đặt hạn mức chi tiêu trong Anthropic Console để giới hạn thiệt hại nếu mã truy cập bị lộ. Đổi `ACCESS_CODE` bất cứ lúc nào để thu hồi quyền cũ.

## Quyền riêng tư và bảo mật

- Dữ liệu kế hoạch lưu trong trình duyệt của từng máy (localStorage). Không có server nào lưu dữ liệu kế hoạch.
- Khi dùng AI, nội dung bạn nhập hoặc file PDF được gửi tới Anthropic. Ở chế độ 1 gửi thẳng; ở chế độ 2 đi qua máy chủ trung gian của đơn vị (mã nguồn không ghi log nội dung). Không dùng tài liệu mật.
- Không bao giờ đưa API key vào mã nguồn hay repo. Chế độ 2 giữ key ở secret của Cloudflare.
- Chế độ 1: không nhập key trên máy dùng chung.

## Phụ thuộc bên ngoài

- Font Be Vietnam Pro và Lora từ Google Fonts.
- Thư viện `@anthropic-ai/sdk` (ghim phiên bản 1.3.0) tải từ cdn.jsdelivr.net khi dùng AI. Cần có mạng.

## Ghi chú

- Logo và nhận diện EQuest là tài sản của Tập đoàn EQuest, chỉ dùng cho công cụ nội bộ EQuest. Người ngoài tự thay bằng logo và màu của trường mình khi dùng lại.
- Số liệu và gợi ý mẫu theo cấp học là tham khảo, cần chỉnh theo thực tế từng trường.
