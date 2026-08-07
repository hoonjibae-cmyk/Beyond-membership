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
- `privacy.html` : 개인정보처리방침 페이지
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

---

## v4 변경 사항

### 1. 2기 자료(PDF) 반영 및 추천 상품 변경
- 수강료 섹션에 `3가지 관리 단계` 소제목 추가
- 강조 카드를 **Plus → Premium** 으로 이동하고, 배지 문구를 `가장 많이 선택` → `학기 중 추천` 으로 변경
- 비교표 헤더의 `추천` 배지도 **Plus → Premium** 으로 이동

### 2. 법적 리스크 완화 문구 수정
사교육 기관의 생활기록부 활용·교습 성과 광고 관련 규제(학원법 제15조의2,
표시·광고의 공정화에 관한 법률, 시도교육청 학업성적관리지침)를 고려해
서비스 내용은 유지하되 표현을 아래와 같이 정리했습니다.

| 구분 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 히어로 문구 | 생기부·수행평가까지 / 자습을 실제 성과로 연결 | 진학 준비까지 / 자습 시간을 밀도 있게 관리 |
| 관리 영역 03 | 입시 · 자습을 결과로 | 진학 · 자습을 진학 준비로 |
| 서비스명 | 생기부 · 입시 프로그램 분석 | 진학 방향 · 교내 활동 설계 상담 |
| 서비스명 | 수행평가 방향 코칭 | 자료조사 · 글쓰기 방법 코칭 |
| 서비스명 | 보고서 작성 방향 코칭 | 보고서 구조 설계 코칭 |
| 코칭 정의 | … → 초안 1회 첨삭 (대필 제외) | … → 학생이 직접 작성한 글에 대한 피드백 1회 |
| CTA 배지 | 마감 임박 | 선착순 모집 |

추가된 고지 문구
- 지표 카드에 출처 라벨(자체 설문/집계) 및 **성적 향상 미보장** 고지
- '평균 성적 향상' → '참여 학생 평균 등급 변화' (사실 서술형으로 변경)
- 후기 하단에 **대가 미지급 · 개인 경험 · 결과 미보장** 고지
- 비교표 하단에 **학교 평가물 대리 작성·수정 미제공**, **생활기록부 열람·대리 기재 미실시** 고지

> 위 문구는 광고 표현상의 위험을 낮추기 위한 것이며 법률 자문이 아닙니다.
> 실제 운영 내용과 문구가 일치하는지 확인이 필요하고,
> 지표(96% / 99% / 1.33등급)는 표시광고법상 실증 책임이 있으므로
> 설문 원자료·응답자 수·조사 기간을 보관해 주세요.

### 3. 개인정보 처리 관련 (개인정보보호법)
- 신청 폼에 **수집 항목 / 이용 목적 / 보유 기간 / 동의 거부 권리** 4대 고지사항 명시
- 만 14세 미만 법정대리인 동의 안내 추가
- `privacy.html` 개인정보처리방침 페이지 신규 작성 (Google · Vercel 국외 이전 고지 포함)
- 푸터 및 폼에서 개인정보처리방침으로 링크 연결
- 서버에서도 동의 여부를 검증하여, 미동의 요청은 구글시트에 저장하지 않음

### 4. 버그 수정
- `api/submit.js` : 구글시트 전송이 실패해도 `success: true` 를 반환해 사용자에게
  "정상 접수"로 표시되던 문제 수정. 이제 upstream 상태 코드와 응답 본문을 확인해
  실패 시 502와 안내 문구를 반환합니다.
- `api/submit.js` : 응답에 upstream 원문(`upstream`)을 그대로 노출하던 부분 제거,
  필수 항목 검증 추가
- `script.js` : 응답이 JSON이 아닐 때 발생하던 예외 처리 보완
- `styles.css` : `.stat-item span` 이 `.grade-unit` 보다 우선순위가 높아
  '등급 / 석' 단위가 아래 줄로 떨어지던 문제 수정 (v3에서 의도한 정렬 복구)
