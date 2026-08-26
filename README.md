# Thuốc ơi Legal Site

Website public cho Điều khoản sử dụng và Chính sách quyền riêng tư của Thuốc
ơi. Nội dung được fetch từ Supabase khi người đọc mở trang, nên publish một
version legal mới không cần deploy lại frontend.

## Chạy local

```bash
cp .env.example .env.local
npm install
npm run dev
```

`.env.local` chỉ cần hai public values:

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-or-anon-key>
```

Mở `/#/terms`, `/#/privacy` hoặc `/#/account-deletion`. Thêm `?lang=vi` hoặc
`?lang=en` để chọn ngôn ngữ. Không dùng service role key ở frontend.

## Điều kiện Supabase trước khi site có dữ liệu

Database phải cung cấp view `public.legal_document_current` theo data contract
trong [ARCHITECTURE.md](ARCHITECTURE.md). View nhận các filter
`document_type` và `locale`, trả duy nhất version `published` mới nhất đã có
hiệu lực, và grant `SELECT` cho role `anon`. Bảng lịch sử không được cấp read
trực tiếp cho trình duyệt.

## Deploy GitHub Pages

1. Trong **Settings → Pages**, chọn source là **GitHub Actions**.
2. Trong **Settings → Secrets and variables → Actions → Secrets**, thêm
   `SUPABASE_URL` và `SUPABASE_ANON_KEY`.
3. Push vào `main`. Workflow tạo site ở GitHub Pages.

Anon/publishable key có thể xuất hiện trong JavaScript build; dữ liệu an toàn
nhờ RLS và chỉ public view được cấp quyền đọc.
