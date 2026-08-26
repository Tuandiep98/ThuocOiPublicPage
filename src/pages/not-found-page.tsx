import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="error-boundary">
      <p className="eyebrow">Thuốc ơi</p>
      <h1>Trang này không tồn tại.</h1>
      <Link to="/terms">Mở tài liệu pháp lý</Link>
    </main>
  );
}
