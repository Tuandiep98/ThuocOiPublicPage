import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

import type { LegalLocale } from '../lib/legal-documents';

interface LegalLayoutProps {
  children: ReactNode;
  locale: LegalLocale;
  onLocaleChange: (locale: LegalLocale) => void;
  sectionLabel?: string;
}

export function LegalLayout({ children, locale, onLocaleChange, sectionLabel }: LegalLayoutProps) {
  const label = sectionLabel ?? (locale === 'vi' ? 'Tài liệu chính thức' : 'Official documents');

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        {locale === 'vi' ? 'Chuyển đến nội dung chính' : 'Skip to main content'}
      </a>
      <header className="masthead">
        <Link className="wordmark" to="/terms" aria-label="Thuốc ơi legal documents">
          <span aria-hidden="true" className="wordmark-mark">T</span>
          <span>Thuốc ơi</span>
        </Link>
        <div className="locale-control" aria-label={locale === 'vi' ? 'Ngôn ngữ' : 'Language'}>
          <button
            type="button"
            aria-pressed={locale === 'vi'}
            onClick={() => onLocaleChange('vi')}
          >
            VI
          </button>
          <button
            type="button"
            aria-pressed={locale === 'en'}
            onClick={() => onLocaleChange('en')}
          >
            EN
          </button>
        </div>
      </header>
      <nav className="primary-nav" aria-label={locale === 'vi' ? 'Điều hướng pháp lý' : 'Legal navigation'}>
        <Link to={`/terms?lang=${locale}`}>{locale === 'vi' ? 'Điều khoản' : 'Terms'}</Link>
        <Link to={`/privacy?lang=${locale}`}>{locale === 'vi' ? 'Quyền riêng tư' : 'Privacy'}</Link>
        <Link to={`/account-deletion?lang=${locale}`}>
          {locale === 'vi' ? 'Xoá tài khoản' : 'Delete account'}
        </Link>
        <Link to={`/support?lang=${locale}`}>{locale === 'vi' ? 'Hỗ trợ' : 'Support'}</Link>
      </nav>
      <main id="main-content" tabIndex={-1}>
        <div className="document-rail" aria-hidden="true" />
        <p className="eyebrow">{label}</p>
        {children}
      </main>
      <footer className="footer">
        <nav aria-label={locale === 'vi' ? 'Tài liệu pháp lý' : 'Legal documents'}>
          <Link to={`/terms?lang=${locale}`}>{locale === 'vi' ? 'Điều khoản' : 'Terms'}</Link>
          <Link to={`/privacy?lang=${locale}`}>{locale === 'vi' ? 'Quyền riêng tư' : 'Privacy'}</Link>
          <Link to={`/account-deletion?lang=${locale}`}>
            {locale === 'vi' ? 'Xoá tài khoản' : 'Delete account'}
          </Link>
          <Link to={`/support?lang=${locale}`}>{locale === 'vi' ? 'Hỗ trợ' : 'Support'}</Link>
        </nav>
        <span>© {new Date().getFullYear()} Tuấn Điệp · Thuốc ơi</span>
      </footer>
    </div>
  );
}
