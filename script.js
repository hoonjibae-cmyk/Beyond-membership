(function () {
  const config = window.SITE_CONFIG || {};
  const businessInfo = config.businessInfo || {};

  const bindText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '';
  };

  bindText('footerInquiry', businessInfo.inquiry || `문의 ${config.phone || '031-794-3306'}`);
  bindText('footerPlaceSummary', businessInfo.placeSummary || '더플레이스26 · 경기도 하남시 미사강변대로 226번안길 17, 뉴욕프라자 3층');
  bindText('footerTradeName', businessInfo.tradeName || '더플레이스26 스터디카페');
  bindText('footerCeo', businessInfo.ceo || '');
  bindText('footerBizNumber', businessInfo.businessNumber || '');
  bindText('footerBusinessAddress', businessInfo.businessAddress || '');
  bindText('footerNote', businessInfo.note || '');

  const form = document.getElementById('applyForm');
  const statusEl = document.getElementById('formStatus');
  const submitButton = document.getElementById('submitButton');

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.privacyConsent = formData.get('privacyConsent') ? '동의' : '미동의';
      payload.submittedAt = new Date().toLocaleString('ko-KR', { hour12: false });
      payload.source = 'BEYOND 2기 멤버십 웹페이지';

      submitButton.disabled = true;
      statusEl.textContent = '신청 내용을 전송하고 있습니다...';

      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        let result = null;
        try {
          result = await response.json();
        } catch (error) {
          result = null;
        }

        if (!response.ok || !result || !result.success) {
          throw new Error((result && result.message) || '전송에 실패했습니다. 전화(031-794-3306)로 문의해 주세요.');
        }

        form.reset();
        statusEl.textContent = '신청이 정상적으로 접수되었습니다. 빠르게 연락드리겠습니다.';
      } catch (error) {
        statusEl.textContent = error.message || '전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  document.querySelectorAll('.quick-nav a, .quick-cta, .primary-btn, .secondary-btn').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      const quickHeader = document.getElementById('topQuickNav');
      if (!quickHeader) return;
      quickHeader.classList.add('nav-flash');
      setTimeout(() => quickHeader.classList.remove('nav-flash'), 350);
    });
  });
})();
