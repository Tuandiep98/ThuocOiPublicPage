import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

import type { LegalLocale } from '../lib/legal-documents';

interface LegalLayoutProps {
  children: ReactNode;
  locale: LegalLocale;
  onLocaleChange: (locale: LegalLocale) => void;
}

export function LegalLayout({ children, locale, onLocaleChange }: LegalLayoutProps) {
  const label = locale === 'vi' ? 'Tài liệu chính thức' : 'Official documents';

  return (
    <main className="site-shell">
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
      <div className="document-rail" aria-hidden="true" />
      <p className="eyebrow">{label}</p>
      {children}
      <footer className="footer">
        <nav aria-label={locale === 'vi' ? 'Tài liệu pháp lý' : 'Legal documents'}>
          <Link to={`/terms?lang=${locale}`}>{locale === 'vi' ? 'Điều khoản' : 'Terms'}</Link>
          <Link to={`/privacy?lang=${locale}`}>{locale === 'vi' ? 'Quyền riêng tư' : 'Privacy'}</Link>
        </nav>
        <span>© {new Date().getFullYear()} Thuốc ơi</span>
      </footer>
    </main>
  );
}
