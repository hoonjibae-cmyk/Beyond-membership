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

  // 하이픈 없이 입력된 번호는 구글시트가 숫자로 변환하면서 앞자리 0을 버린다.
  // 전송 전에 하이픈을 넣어 시트가 문자열로 인식하도록 한다.
  const formatPhone = (value) => {
    const raw = String(value == null ? '' : value).trim();
    let digits = raw.replace(/\D/g, '');
    // 숫자가 없으면(예: 오타, 안내 문구) 입력값을 지우지 않고 그대로 보낸다.
    if (!digits) return raw;

    // 앞자리 0이 빠진 휴대폰 번호(10자리, 10으로 시작)는 0을 복원한다.
    if (digits.length === 10 && digits.startsWith('10')) digits = '0' + digits;

    if (digits.length === 11) {
      return digits.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
    }
    if (digits.length === 10) {
      return digits.startsWith('02')
        ? digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3')
        : digits.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    }
    if (digits.length === 9 && digits.startsWith('02')) {
      return digits.replace(/^(\d{2})(\d{3})(\d{4})$/, '$1-$2-$3');
    }
    // 알 수 없는 형식은 입력값을 그대로 보낸다.
    return raw;
  };

  const form = document.getElementById('applyForm');
  const statusEl = document.getElementById('formStatus');
  const submitButton = document.getElementById('submitButton');

  // 입력을 마치면 화면에서도 정리된 형식을 보여준다.
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('blur', () => {
      const formatted = formatPhone(input.value);
      if (formatted) input.value = formatted;
    });
  });

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.parentPhone = formatPhone(payload.parentPhone);
      payload.studentPhone = formatPhone(payload.studentPhone);
      payload.privacyConsent = formData.get('privacyConsent') ? '동의' : '미동의';
      payload.submittedAt = new Date().toLocaleString('ko-KR', { hour12: false });
      const cohort = config.cohort || '3기';
      payload.cohort = cohort;
      payload.cohortPeriod = config.cohortPeriod || '';
      payload.source = `BEYOND ${cohort} 멤버십 웹페이지`;

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
