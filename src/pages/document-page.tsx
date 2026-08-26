import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation, useSearchParams } from 'react-router-dom';

import { LegalLayout } from '../components/legal-layout';
import {
  fetchCurrentLegalDocument,
  type DocumentType,
  type LegalDocument,
  type LegalLocale,
  preferredLocale,
} from '../lib/legal-documents';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; document: LegalDocument }
  | { status: 'error' };

interface DocumentPageProps {
  documentType: DocumentType;
}

export function DocumentPage({ documentType }: DocumentPageProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [locale, setLocale] = useState<LegalLocale>(() => preferredLocale(location.search));
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    setLocale(preferredLocale(location.search));
  }, [location.search]);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    fetchCurrentLegalDocument(documentType, locale)
      .then((document) => {
        if (!cancelled) setState({ status: 'ready', document });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, [documentType, locale]);

  const changeLocale = (nextLocale: LegalLocale) => {
    setSearchParams({ ...Object.fromEntries(searchParams), lang: nextLocale });
  };

  return (
    <LegalLayout locale={locale} onLocaleChange={changeLocale}>
      {state.status === 'loading' && <LoadingDocument locale={locale} />}
      {state.status === 'error' && <LoadingError locale={locale} />}
      {state.status === 'ready' && <LegalDocumentView document={state.document} locale={locale} />}
    </LegalLayout>
  );
}

function LegalDocumentView({ document, locale }: { document: LegalDocument; locale: LegalLocale }) {
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
    new Date(document.effective_at),
  );
  const versionLabel = locale === 'vi' ? 'Phiên bản' : 'Version';
  const effectiveLabel = locale === 'vi' ? 'Có hiệu lực từ' : 'Effective from';

  return (
    <article className="legal-document">
      <div className="document-heading">
        <h1>{document.title}</h1>
        <dl className="document-meta">
          <div>
            <dt>{versionLabel}</dt>
            <dd>{document.version}</dd>
          </div>
          <div>
            <dt>{effectiveLabel}</dt>
            <dd>{date}</dd>
          </div>
        </dl>
      </div>
      <div className="document-content">
        <ReactMarkdown>{document.content_markdown}</ReactMarkdown>
      </div>
    </article>
  );
}

function LoadingDocument({ locale }: { locale: LegalLocale }) {
  return (
    <section className="status-panel" aria-live="polite">
      <h1>{locale === 'vi' ? 'Đang tải tài liệu' : 'Loading document'}</h1>
      <p>{locale === 'vi' ? 'Đang kiểm tra phiên bản có hiệu lực mới nhất.' : 'Checking the latest effective version.'}</p>
    </section>
  );
}

function LoadingError({ locale }: { locale: LegalLocale }) {
  return (
    <section className="status-panel" role="alert">
      <h1>{locale === 'vi' ? 'Không thể tải tài liệu' : 'Document unavailable'}</h1>
      <p>
        {locale === 'vi'
          ? 'Kiểm tra kết nối rồi tải lại trang để xem bản có hiệu lực mới nhất.'
          : 'Check your connection and reload to view the latest effective version.'}
      </p>
      <button type="button" onClick={() => window.location.reload()}>
        {locale === 'vi' ? 'Tải lại trang' : 'Reload page'}
      </button>
    </section>
  );
}
