# BEYOND 2기 멤버십 홍보 웹페이지 (개선 버전)

첨부 포스터 내용을 바탕으로 제작한 Vercel 배포용 정적 웹페이지입니다.

## 이번 개선 반영 사항
- 상단 고정 바로가기 탭 추가 (철학 / 후기 / 시스템 / 수강료 / 신청하기)
- 카드 hover 글로우 효과 및 버튼/입력창 인터랙션 강화
- 안내 문장 줄바꿈 정리
- Plus 상품의 재원생가 강조 컬러 강화
- 신청하기 섹션을 중앙형 넓은 폼 레이아웃으로 재구성
- 푸터를 참고 페이지 형식과 유사한 구조로 재구성
- 신청서 항목에 재원생 여부 포함

## 포함 파일
- `index.html` : 메인 페이지
- `styles.css` : 스타일
- `script.js` : 폼 제출 및 푸터 정보 바인딩
- `site-config.js` : 스터디카페 사업자 정보 / 전화번호 설정 파일
- `api/submit.js` : Vercel 서버리스 함수 (구글시트 전달용)
- `assets/the-place-26-logo.png` : 스터디카페 로고

## 반영된 푸터 사업자 정보
아래 정보는 참고 웹페이지 푸터 기준으로 반영되어 있습니다.

- 문의: 목동유쌤영어학원 · 031-794-3306
- 더플레이스26 · 경기도 하남시 미사강변대로 226번안길 17, 뉴욕프라자 3층
- 상호: 더플레이스26 스터디카페
- 대표자: 유은정
- 사업자등록번호: 732-55-01009
- 사업장 소재지: 경기도 하남시 미사강변대로 226번안길 17, 뉴욕프라자 3층 302호

수정이 필요하면 `site-config.js`에서 변경하면 됩니다.

## 구글시트 연동용 환경변수
Vercel 프로젝트의 Environment Variables에 아래 값을 추가하세요.

- Key: `GOOGLE_APPS_SCRIPT_URL`
- Value: 배포한 Google Apps Script 웹앱 URL

---

## Google Apps Script 예시
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('신청내역') || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.submittedAt || '',
    data.source || '',
    data.studentName || '',
    data.school || '',
    data.grade || '',
    data.program || '',
    data.enrollmentStatus || '',
    data.parentPhone || '',
    data.studentPhone || '',
    data.notes || '',
    data.privacyConsent || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 권장 시트 헤더
- 접수일시
- 유입경로
- 학생이름
- 학교
- 학년
- 희망상품
- 재원생여부
- 학부모연락처
- 학생연락처
- 문의사항
- 개인정보동의

Apps Script 작성 후:
1. **배포 > 새 배포**
2. 유형: **웹 앱**
3. 액세스 권한: **Anyone** 또는 **Anyone with the link**
4. 발급된 URL을 Vercel 환경변수 `GOOGLE_APPS_SCRIPT_URL`에 입력

---

## Vercel 배포 방법
### 방법 1. 폴더째 업로드
1. 압축을 해제합니다.
2. Vercel에 로그인합니다.
3. **Add New Project** > 폴더 업로드
4. Environment Variables에 `GOOGLE_APPS_SCRIPT_URL` 추가
5. 배포

### 방법 2. CLI 배포
```bash
npx vercel
```
운영 배포는 아래 명령으로 가능합니다.
```bash
npx.cmd vercel --prod --force
```


## 추가 수정 (v3)
- 지표 카드의 '등급', '석' 단위가 숫자와 자연스럽게 같은 줄 상단 정렬되도록 수정
- 푸터 우측 상단 문의 문구를 `문의 031-794-3306` 형식으로 정리
- 신청서 보내기 버튼 및 신청 폼 hover 시 화면 떨림 현상 수정
