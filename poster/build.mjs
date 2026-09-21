// A4 1장 포스터를 PDF 와 미리보기 PNG 로 렌더링한다.
//   node poster/build.mjs
// 한글이 깨지면 Noto Sans KR 이 시스템에 설치되어 있는지 확인할 것.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const src = `file://${path.join(dir, 'poster.html')}`;
const pdfOut = path.join(dir, 'beyond-3rd-poster.pdf');
const pngOut = path.join(dir, 'beyond-3rd-poster.png');

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(src, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });

await page.pdf({
  path: pdfOut,
  format: 'A4',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});

// 미리보기용 PNG (인쇄물은 PDF 를 사용할 것)
await page.setViewportSize({ width: 794, height: 1123 });
await page.screenshot({ path: pngOut, fullPage: true });

// A4 1장을 넘기지 않는지 확인
const overflow = await page.evaluate(() => ({
  bodyHeight: document.body.scrollHeight,
  viewportHeight: document.documentElement.clientHeight,
}));

await browser.close();

console.log(`PDF  → ${pdfOut}`);
console.log(`PNG  → ${pngOut}`);
console.log(`본문 높이 ${overflow.bodyHeight}px / 페이지 높이 ${overflow.viewportHeight}px`);
