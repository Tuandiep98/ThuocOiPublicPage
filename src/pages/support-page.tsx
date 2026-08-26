import { useLocation, useSearchParams } from 'react-router-dom';

import { LegalLayout } from '../components/legal-layout';
import { preferredLocale, type LegalLocale } from '../lib/legal-documents';

const supportEmail = 'tuandiep98usa@gmail.com';

export function SupportPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const locale = preferredLocale(location.search);
  const changeLocale = (nextLocale: LegalLocale) => {
    setSearchParams({ ...Object.fromEntries(searchParams), lang: nextLocale });
  };

  return (
    <LegalLayout
      locale={locale}
      onLocaleChange={changeLocale}
      sectionLabel={locale === 'vi' ? 'Trung tâm hỗ trợ' : 'Support centre'}
    >
      {locale === 'vi' ? <VietnameseSupport /> : <EnglishSupport />}
    </LegalLayout>
  );
}

function VietnameseSupport() {
  const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent('Hỗ trợ Thuốc ơi')}`;
  return (
    <article className="support-page">
      <header className="support-heading">
        <p className="status-kicker">LIÊN HỆ TRỰC TIẾP</p>
        <h1>Chúng tôi sẵn sàng hỗ trợ bạn.</h1>
        <p>Gửi email nếu bạn cần trợ giúp với Thuốc ơi. Không gửi ảnh đơn thuốc, thông tin sức khoẻ chi tiết hoặc dữ liệu nhạy cảm qua email trừ khi thực sự cần thiết.</p>
        <a className="primary-link" href={mailto}>Liên hệ {supportEmail}</a>
      </header>

      <section className="support-topics" aria-labelledby="support-topics-title">
        <div className="section-heading">
          <p className="status-kicker">TỰ XỬ LÝ NHANH</p>
          <h2 id="support-topics-title">Bạn cần hỗ trợ việc gì?</h2>
        </div>
        <div className="support-topic-grid">
          <SupportTopic title="Quét đơn và AI" body="Kết quả đọc đơn có thể sai. Hãy đối chiếu đơn gốc và hỏi bác sĩ hoặc dược sĩ trước khi dùng thuốc hoặc thay đổi liều." />
          <SupportTopic title="Lời nhắc" body="Kiểm tra quyền Thông báo và Báo thức trong cài đặt thiết bị. Nếu tắt quyền, ứng dụng không thể gửi lời nhắc đầy đủ." />
          <SupportTopic title="Gói đăng ký" body="Gia hạn, huỷ gia hạn và hoàn tiền do App Store hoặc Google Play quản lý. Bạn có thể khôi phục gói đã mua từ phần Gói sử dụng trong app." />
          <SupportTopic title="Tài khoản và dữ liệu" body="Bạn có thể xoá tài khoản ngay trong ứng dụng hoặc gửi yêu cầu khi không thể truy cập ứng dụng." action="Mở hướng dẫn xoá tài khoản" href="/#/account-deletion?lang=vi" />
        </div>
      </section>

      <aside className="support-safety-note">
        <h2>Không dùng cho tình huống cấp cứu</h2>
        <p>Thuốc ơi không thay thế tư vấn hoặc dịch vụ y tế. Nếu bạn gặp tình huống khẩn cấp, hãy liên hệ ngay dịch vụ cấp cứu hoặc cơ sở y tế phù hợp.</p>
      </aside>
    </article>
  );
}

function EnglishSupport() {
  const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent('Thuốc ơi support')}`;
  return (
    <article className="support-page">
      <header className="support-heading">
        <p className="status-kicker">CONTACT SUPPORT</p>
        <h1>We are here to help.</h1>
        <p>Email us if you need help with Thuốc ơi. Do not email prescription images, detailed health information, or other sensitive data unless it is genuinely necessary.</p>
        <a className="primary-link" href={mailto}>Contact {supportEmail}</a>
      </header>

      <section className="support-topics" aria-labelledby="support-topics-title">
        <div className="section-heading">
          <p className="status-kicker">QUICK HELP</p>
          <h2 id="support-topics-title">What do you need help with?</h2>
        </div>
        <div className="support-topic-grid">
          <SupportTopic title="Prescription scanning and AI" body="Prescription-reading results can be wrong. Check the original prescription and ask a doctor or pharmacist before taking medication or changing a dose." />
          <SupportTopic title="Reminders" body="Check Notification and Alarm permissions in device settings. If permission is off, the app cannot deliver all reminders." />
          <SupportTopic title="Subscriptions" body="Renewal, cancellation, and refunds are managed by the App Store or Google Play. You can restore a purchase from the app’s subscription area." />
          <SupportTopic title="Account and data" body="You can delete your account immediately in the app, or submit a request if you cannot access the app." action="Open account deletion instructions" href="/#/account-deletion?lang=en" />
        </div>
      </section>

      <aside className="support-safety-note">
        <h2>Not for emergencies</h2>
        <p>Thuốc ơi does not replace medical advice or emergency services. In an emergency, contact local emergency services or an appropriate healthcare provider immediately.</p>
      </aside>
    </article>
  );
}

function SupportTopic({ title, body, action, href }: { title: string; body: string; action?: string; href?: string }) {
  return (
    <section className="support-topic">
      <h3>{title}</h3>
      <p>{body}</p>
      {action && href ? <a href={href}>{action}</a> : null}
    </section>
  );
}
