import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { Window } from 'happy-dom';

const file = readdirSync('dist/assets').find(name => name.endsWith('.js'));
const script = readFileSync(`dist/assets/${file}`, 'utf8');
const window = new Window({ url: 'http://localhost:5173/' });
window.document.body.innerHTML = '<div id="root"></div>';
window.localStorage.setItem('meta-guide-checklist', '[0,3]');
window.eval(script);
const settle = () => new Promise(resolve => setTimeout(resolve, 30));
const body = () => window.document.querySelector('.slide').textContent;
async function clickButton(label) {
  const button = [...window.document.querySelectorAll('button')].find(button => (button.getAttribute('aria-label') ?? [...button.childNodes].filter(node => node.nodeType === 3).map(node => node.textContent).join('')).trim() === label);
  assert.ok(button, `Missing button: ${label}`);
  button.click();
  await settle();
}
async function go(page) {
  window.location.hash = `#${page}`;
  window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  await settle();
}
await settle();

assert.match(window.document.querySelector('h1')?.textContent || '', /建立與管理 Meta 商家資產/);
assert.match(body(), /開始前準備/);
await clickButton('下一頁');
assert.match(window.document.querySelector('h1')?.textContent || '', /查出品牌 IG 在哪個商家組合/);

const titles = new Set();
for (let number = 1; number <= 16; number++) {
  await go(number);
  titles.add(window.document.querySelector('h1')?.textContent);
  assert.equal(window.document.querySelectorAll('.slide h1').length, 1);
  assert.equal(window.document.querySelectorAll('.slide details, .slide .eyebrow').length, 0);
  assert.doesNotMatch(body(), /第一幕|第二幕|第三幕|第四幕|第五幕|小測驗|[？]/);
  if (number >= 7 && number <= 14) {
    assert.equal(window.document.querySelectorAll('.instruction-list .instruction-check').length, 4);
    assert.match(body(), /完成標準/);
  }
}
assert.equal(titles.size, 16);
assert.match(window.document.querySelector('.side-directory [aria-current="page"]').textContent, /設定驗收/);
await clickButton('回到第 1 頁');
assert.equal(window.location.hash, '#1');
const section = [...window.document.querySelectorAll('.side-directory .directory-item')].find(button => button.textContent.endsWith('設定廣告帳號'));
section.click();
await settle();
assert.equal(window.location.hash, '#11');
assert.match(body(), /確認或建立廣告帳號/);

await go(13);
const slideFrame = window.document.querySelector('.slide-frame');
slideFrame.scrollTop = 150;
await clickButton('第 7 頁 盤點組合');
assert.equal(slideFrame.scrollTop, 0);
assert.equal(window.location.hash, '#7');
assert.match(body(), /盤點現有商家組合/);
assert.equal(window.document.querySelector('.progress-track [aria-current="page"]').getAttribute('aria-label'), '第 7 頁 盤點組合');
assert.equal(window.document.querySelectorAll('.side-directory .directory-item').length, 16);

await go(2);
await clickButton('廣告同事');
assert.match(window.document.querySelector('.access-board.active').textContent, /舊商家組合/);
await clickButton('比對商家編號');
assert.match(body(), /1024/);
assert.match(body(), /2086/);
await clickButton('查看 IG 資產清單');
assert.match(body(), /品牌 IG 在尾碼 1024 的組合/);
await clickButton('社群同事');
assert.match(window.document.querySelector('.access-board.active').textContent, /品牌商家組合/);

await go(12);
await clickButton('檢查邀請狀態');
assert.match(window.document.querySelector('.flow-node.blocked').textContent, /尚未指派/);
await clickButton('指派 IG 權限');
assert.match(body(), /已指派內容任務/);
await clickButton('重做示範');
assert.equal(window.document.querySelectorAll('.flow-node.passed').length, 0);

await go(14);
assert.match(body(), /清單中沒有品牌 IG/);
assert.doesNotMatch(body(), /正在檢查|尚未指派廣告任務/);
await clickButton('查看帳號比對');
assert.equal(window.document.querySelectorAll('.evidence-rows dd').length, 2);
assert.match(body(), /兩個編號相同/);
await clickButton('查看品牌 IG 的權限');
assert.match(body(), /尚未指派廣告任務/);
await clickButton('查看補權限後的草稿');
assert.match(body(), /管理者已指派/);
assert.match(body(), /品牌 IG 現在可選/);

await go(16);
assert.match(window.document.querySelector('h1')?.textContent || '', /驗收設定並準備交接/);
const checkbox = window.document.querySelector('input[type="checkbox"]');
assert.equal(window.document.querySelectorAll('.checklist input:checked').length, 0);
checkbox.click();
await settle();
assert.equal(checkbox.checked, true);
assert.equal(window.localStorage.getItem('meta-guide-checklist'), '[0,3]');
assert.match(body(), /交接需要留下/);

await clickButton('第 7 頁 盤點組合');
await clickButton('第 16 頁 設定驗收');
assert.equal(window.document.querySelectorAll('.checklist input:checked').length, 1);

await go(15);
assert.equal(window.document.querySelectorAll('.issue-buttons button').length, 10);
assert.equal(window.document.querySelectorAll('.slide select').length, 0);
await clickButton('Threads 版位沒出現');
assert.match(window.document.querySelector('.diagnosis h3').textContent, /Threads 版位沒出現/);
assert.equal(window.document.querySelector('.issue-buttons [aria-pressed="true"]').textContent, 'Threads 版位沒出現');
console.log('Passed: 16 full slides, direct page jumps, fixed sidebar, three simulations, blank session checklist, and visible troubleshooting choices.');
await window.happyDOM.abort();
