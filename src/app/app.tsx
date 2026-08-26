import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { DocumentPage } from '../pages/document-page';
import { AccountDeletionPage } from '../pages/account-deletion-page';
import { NotFoundPage } from '../pages/not-found-page';

class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Legal site failed to render.', error, errorInfo);
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="error-boundary" role="alert">
          <p className="eyebrow">Thuốc ơi</p>
          <h1>Trang tài liệu không thể hiển thị.</h1>
          <button type="button" onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export function App() {
  return (
    <AppErrorBoundary>
      <Routes>
        <Route path="/terms" element={<DocumentPage documentType="terms_of_service" />} />
        <Route path="/privacy" element={<DocumentPage documentType="privacy_policy" />} />
        <Route path="/account-deletion" element={<AccountDeletionPage />} />
        <Route path="/" element={<Navigate replace to="/terms" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppErrorBoundary>
  );
}
