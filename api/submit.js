export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST 요청만 허용됩니다.' });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return res.status(500).json({
      success: false,
      message: 'Vercel 환경변수 GOOGLE_APPS_SCRIPT_URL이 설정되지 않았습니다.'
    });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();

    return res.status(200).json({
      success: true,
      message: '신청이 접수되었습니다.',
      upstream: text
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || '구글시트 전송 중 오류가 발생했습니다.'
    });
  }
}
