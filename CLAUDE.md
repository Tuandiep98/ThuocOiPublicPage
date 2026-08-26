# Thuốc ơi Legal Site — hướng dẫn làm việc

## Mục tiêu

Đây là website public, tĩnh, chỉ hiển thị ToS và Privacy Policy của Thuốc ơi.
Website lấy nội dung đã publish từ Supabase lúc người dùng mở trang; không lưu
nội dung pháp lý dài trong source code hoặc bundle build.

## Tài liệu pháp lý: versioning bắt buộc

- ToS và Privacy Policy là tài liệu **có version, bất biến theo từng bản phát
  hành**. Nguồn dữ liệu chuẩn là các bản ghi đã publish trên Supabase.
- Mỗi thay đổi nội dung hoặc ý nghĩa phải tạo **bản ghi mới**, không `UPDATE`/
  ghi đè bản đã publish. Bản mới phải cập nhật đồng bộ `version`,
  `effective_at`, `published_at`, `title` và `content` cho cả `vi` và `en`.
  Giữ nguyên bản cũ để đối chiếu/audit.
- Trang web chỉ query public read model và chỉ hiển thị bản `published` có
  hiệu lực mới nhất của từng `document_type` + `locale`. Không được trao quyền
  ghi cho anon/authenticated client; chỉ quản trị viên hoặc migration/script
  server-side được publish hoặc đổi trạng thái tài liệu.
- Khi sửa legal content, phải cập nhật dữ liệu Supabase, kiểm thử cả hai ngôn
  ngữ, và xác nhận URL `/terms` và `/privacy` tải đúng version mới nhất. Khi
  rollback, publish một version mới chứa nội dung cần khôi phục; không sửa lại
  version cũ.

## Bảo mật và triển khai

- Chỉ `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` được đặt vào frontend.
  Đây là định danh công khai và chỉ có quyền đọc public view; không đưa service
  role key, DB password, hay Edge Function secret vào repository hoặc build.
- Không query trực tiếp bảng lưu toàn bộ lịch sử từ client. Chỉ dùng
  `legal_document_current` (hoặc Edge Function public tương đương) trả về các
  trường an toàn để hiển thị.
- Vì host là static (GitHub Pages), UI phải fetch dữ liệu ở runtime với cache
  phía client tắt/revalidate để trang nhận bản legal mới mà không cần deploy
  lại website.
