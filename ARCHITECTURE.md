# Thuốc ơi Legal Site — kiến trúc đề xuất

## Phạm vi và phát hiện từ app hiện tại

Repo Flutter hiện dùng Supabase cho dữ liệu online, `url_launcher` đã có sẵn,
và đang chứa nội dung ToS/Privacy trong `assets/translations/vi.json` và
`assets/translations/en.json`. Legal site phải thay thế cách hiển thị tĩnh đó,
nhưng không được đưa dữ liệu thuốc, người dùng hay bất kỳ secret nào ra public.

Repository này là frontend public độc lập. Repository Flutter tiếp tục là nơi
sở hữu migration Supabase và sau này chỉ cần đổi các action ToS/Privacy thành
link đến website ổn định.

## Cấu trúc repository khi bắt đầu implementation

```text
thuocoi-legal-site/
  .github/workflows/deploy-github-pages.yml
  public/
  src/
    app/
      router.tsx
      app.tsx
    components/
      legal-document.tsx
      language-switcher.tsx
      legal-layout.tsx
    lib/
      supabase.ts
      legal-documents.ts
      locale.ts
    pages/
      terms-page.tsx
      privacy-page.tsx
      not-found-page.tsx
    styles/
  tests/
    legal-documents.test.ts
    pages.test.tsx
  .env.example
  CLAUDE.md
  ARCHITECTURE.md
  package.json
  vite.config.ts
```

Stack đề xuất: Vite + React + TypeScript, React Router với `HashRouter` nếu
deploy GitHub Pages (tránh lỗi refresh route), và Supabase JS chỉ dùng anon
key. Các URL public ổn định sẽ là `/#/terms` và `/#/privacy`; khi dùng custom
domain có thể chuyển sang route sạch mà không thay đổi data contract.

## Luồng dữ liệu

```text
Người đọc / Flutter app
        |
        v
GitHub Pages: JavaScript bundle tĩnh
        |
        | runtime fetch, cache: no-store
        v
Supabase public view: legal_document_current
        |
        | chỉ bản published, effective_at <= now()
        v
Supabase private history: legal_documents
```

Trang lấy `document_type` từ route (`terms_of_service` hoặc `privacy_policy`)
và locale từ URL (`?lang=vi|en`), sau đó dùng ngôn ngữ trình duyệt làm fallback
về `vi`. Không có nội dung fallback cứng trong bundle; lỗi tải chỉ hiển thị
trạng thái lỗi và nút thử lại để tránh hiển thị tài liệu cũ.

## Data contract Supabase

Migration sẽ được thêm vào repository Flutter (nơi hiện giữ lịch sử migration
Supabase) ở bước tích hợp sau, không phải trong repository public này.

`public.legal_documents` là bảng lịch sử, gồm tối thiểu:

```text
id UUID primary key
document_type text: terms_of_service | privacy_policy
locale text: vi | en
version text: semantic version của từng loại tài liệu
status text: draft | published | archived
title text
content_markdown text
effective_at timestamptz
published_at timestamptz
created_at timestamptz
```

Ràng buộc cần có: unique `(document_type, locale, version)`, chỉ cho phép các
loại/locale/status nêu trên, nội dung và tiêu đề không rỗng. Cùng một version
phải được insert đủ `vi` và `en` trước khi publish.

`public.legal_document_current` là read-only view chọn một hàng có hiệu lực
mới nhất cho từng `(document_type, locale)`. View chỉ trả về `document_type`,
`locale`, `version`, `title`, `content_markdown`, `effective_at` và
`published_at`; không trả draft, archived hay metadata quản trị.

RLS: không cấp `SELECT` trực tiếp vào `legal_documents` cho anon/authenticated.
Chỉ cấp `SELECT` vào `legal_document_current`. View phải được định nghĩa với
filter cố định `status = 'published'` và `effective_at <= now()`, sau đó chỉ
grant read cho `anon`/`authenticated`. Publish được thực hiện bằng SQL migration
hoặc tài khoản quản trị; frontend tuyệt đối không có quyền ghi.

## Quy trình xuất bản

1. Soạn ToS hoặc Privacy Policy cho cả `vi` và `en`.
2. Chọn version mới (ví dụ `1.1.0`) và ngày hiệu lực.
3. Insert hai hàng ở trạng thái `draft`, review, rồi publish trong một giao
   dịch.
4. Kiểm tra view trả về version mới trên `/terms?lang=vi`, `/terms?lang=en`,
   `/privacy?lang=vi` và `/privacy?lang=en`.
5. Không cần build/deploy legal site lại: lần tải tiếp theo fetch bản mới.

Version được hiển thị rõ ràng cạnh ngày hiệu lực. Nếu cần rollback, xuất bản
một version mới có nội dung được khôi phục để lịch sử luôn đúng và audit được.

## Việc sẽ làm khi repository GitHub public sẵn sàng

1. Khởi tạo Vite React TypeScript trong repo này và cấu hình GitHub Pages.
2. Viết migration/view/RLS ở repository Flutter theo contract trên rồi apply
   bằng Supabase CLI.
3. Xây dựng hai page `/terms` và `/privacy`, loading/error/retry, chuyển đổi
   `vi`/`en`, render Markdown đã sanitize, và kiểm thử runtime fetch.
4. Thay hai dialog nội dung tĩnh trong Flutter bằng link đến legal site, vẫn
   giữ flow xoá tài khoản ở app.
