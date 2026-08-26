import { useLocation, useSearchParams } from 'react-router-dom';

import { LegalLayout } from '../components/legal-layout';
import { preferredLocale, type LegalLocale } from '../lib/legal-documents';

const deletionEmail = 'tuandiep98usa@gmail.com';

export function AccountDeletionPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const locale = preferredLocale(location.search);

  const changeLocale = (nextLocale: LegalLocale) => {
    setSearchParams({ ...Object.fromEntries(searchParams), lang: nextLocale });
  };

  return (
    <LegalLayout locale={locale} onLocaleChange={changeLocale}>
      {locale === 'vi' ? <VietnameseDeletionRequest /> : <EnglishDeletionRequest />}
    </LegalLayout>
  );
}

function VietnameseDeletionRequest() {
  const mailto = `mailto:${deletionEmail}?subject=${encodeURIComponent('Yêu cầu xoá tài khoản Thuốc ơi')}`;
  return (
    <article className="legal-document deletion-page">
      <div className="document-heading">
        <p className="status-kicker">QUYỀN KIỂM SOÁT DỮ LIỆU</p>
        <h1>Yêu cầu xoá tài khoản</h1>
        <p className="document-lead">Bạn có thể xoá tài khoản và dữ liệu Thuốc ơi ngay trong ứng dụng hoặc gửi yêu cầu qua email khi không thể truy cập ứng dụng.</p>
      </div>
      <section className="deletion-option">
        <p className="option-number" aria-hidden="true">01</p>
        <div>
          <h2>Trong ứng dụng — xử lý ngay</h2>
          <p>Mở <strong>Hệ thống → Tuỳ chọn → Xoá tài khoản</strong>, sau đó xác nhận. Ứng dụng sẽ xoá dữ liệu tài khoản trên máy chủ và dữ liệu cục bộ có thể xoá ngay sau khi yêu cầu hoàn tất.</p>
        </div>
      </section>
      <section className="deletion-option">
        <p className="option-number" aria-hidden="true">02</p>
        <div>
          <h2>Qua email — hoàn tất trong tối đa 30 ngày làm việc</h2>
          <p>Nếu không thể mở ứng dụng, hãy gửi yêu cầu từ email mà bạn muốn chúng tôi phản hồi. Để bảo vệ dữ liệu, chúng tôi có thể yêu cầu thông tin xác minh quyền sở hữu tài khoản trước khi xử lý.</p>
          <a className="primary-link" href={mailto}>Gửi yêu cầu xoá tới {deletionEmail}</a>
        </div>
      </section>
      <aside className="retention-note">
        <h2>Dữ liệu có thể còn được lưu</h2>
        <p>Trạng thái quyền lợi của gói đăng ký mua qua App Store hoặc Google Play có thể được lưu cho đến khi hết thời hạn gói đang còn hiệu lực, để bạn có thể khôi phục quyền lợi khi cài lại ứng dụng. Việc huỷ gia hạn và hồ sơ giao dịch được quản lý bởi Apple hoặc Google theo chính sách của họ.</p>
      </aside>
    </article>
  );
}

function EnglishDeletionRequest() {
  const mailto = `mailto:${deletionEmail}?subject=${encodeURIComponent('Thuốc ơi account deletion request')}`;
  return (
    <article className="legal-document deletion-page">
      <div className="document-heading">
        <p className="status-kicker">YOUR DATA CONTROLS</p>
        <h1>Request account deletion</h1>
        <p className="document-lead">You can delete your Thuốc ơi account and data immediately in the app, or email us if you cannot access the app.</p>
      </div>
      <section className="deletion-option">
        <p className="option-number" aria-hidden="true">01</p>
        <div>
          <h2>In the app — processed immediately</h2>
          <p>Open <strong>System → Options → Delete account</strong> and confirm. Once the request completes, the app deletes deletable account data on the server and on your device immediately.</p>
        </div>
      </section>
      <section className="deletion-option">
        <p className="option-number" aria-hidden="true">02</p>
        <div>
          <h2>By email — completed within 30 business days</h2>
          <p>If you cannot open the app, send a request from an email address where we can contact you. To protect your data, we may request information that verifies ownership before processing it.</p>
          <a className="primary-link" href={mailto}>Email {deletionEmail} to request deletion</a>
        </div>
      </section>
      <aside className="retention-note">
        <h2>Data that may remain</h2>
        <p>Subscription entitlement information for an active App Store or Google Play subscription may be retained until the active subscription period ends, so you can restore access when reinstalling the app. Apple or Google manage renewal cancellation and their transaction records under their own policies.</p>
      </aside>
    </article>
  );
}
