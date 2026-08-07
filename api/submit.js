const REQUIRED_FIELDS = [
  'studentName',
  'school',
  'grade',
  'program',
  'enrollmentStatus',
  'parentPhone',
  'studentPhone'
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST 요청만 허용됩니다.' });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    console.error('GOOGLE_APPS_SCRIPT_URL 환경변수가 없습니다.');
    return res.status(500).json({
      success: false,
      message: '신청 접수 설정에 문제가 있습니다. 전화(031-794-3306)로 문의해 주세요.'
    });
  }

  let payload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (error) {
    return res.status(400).json({ success: false, message: '요청 형식이 올바르지 않습니다.' });
  }

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ success: false, message: '요청 형식이 올바르지 않습니다.' });
  }

  // 개인정보 수집·이용 동의 없이 접수된 데이터는 저장하지 않는다.
  if (payload.privacyConsent !== '동의') {
    return res.status(400).json({
      success: false,
      message: '개인정보 수집 · 이용에 동의해야 신청서를 접수할 수 있습니다.'
    });
  }

  const missing = REQUIRED_FIELDS.filter((field) => !String(payload[field] || '').trim());
  if (missing.length) {
    return res.status(400).json({ success: false, message: '필수 항목을 모두 입력해 주세요.' });
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await response.text();

    // Apps Script는 실패해도 200을 돌려주는 경우가 있어 상태 코드와 본문을 함께 확인한다.
    let upstreamOk = response.ok;
    if (upstreamOk && text) {
      try {
        const parsed = JSON.parse(text);
        if (parsed && parsed.success === false) upstreamOk = false;
      } catch (error) {
        // JSON이 아니면 상태 코드만 신뢰한다.
      }
    }

    if (!upstreamOk) {
      console.error('구글시트 전송 실패:', response.status, text);
      return res.status(502).json({
        success: false,
        message: '신청 접수 중 오류가 발생했습니다. 전화(031-794-3306)로 문의해 주세요.'
      });
    }

    return res.status(200).json({ success: true, message: '신청이 접수되었습니다.' });
  } catch (error) {
    console.error('구글시트 전송 예외:', error);
    return res.status(502).json({
      success: false,
      message: '신청 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    });
  }
}
