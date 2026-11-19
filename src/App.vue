<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { slides, sources } from './data.js';
import Icon from './components/Icon.vue';
import LessonDirectory from './components/LessonDirectory.vue';
import Concepts from './components/Concepts.vue';
import Setup from './components/Setup.vue';
import Review from './components/Review.vue';
import { readProgress, writeProgress } from './progress.js';

const clamp = (number) => Math.min(slides.length - 1, Math.max(0, number));
const pageFromUrl = () => clamp((Number.parseInt(window.location.hash.slice(1), 10) || 1) - 1);
const page = ref(pageFromUrl());
const visited = ref(readProgress('meta-guide-visited', slides.length));
const checkedItems = ref([]);
const references = ref(null);
const slideFrame = ref(null);
const slideScale = ref(1);
const slideWidth = ref(680);
const heading = ref(null);
const activeSlide = computed(() => slides[page.value]);
let slideObserver;

function fitSlide() {
  const frame = slideFrame.value;
  if (!frame?.clientWidth || !frame.clientHeight) return;
  // A single viewport-based scale keeps type and alignment consistent on all slides.
  const narrow = frame.clientWidth < 460;
  const referenceWidth = narrow ? 420 : 740;
  const referenceHeight = narrow ? 980 : 745;
  const scale = Math.min(1, frame.clientWidth / referenceWidth, frame.clientHeight / referenceHeight);
  slideScale.value = scale;
  slideWidth.value = Math.min(1190, frame.clientWidth / scale);
}

watch(page, (number) => {
  if (!visited.value.includes(number)) {
    visited.value = [...visited.value, number];
    writeProgress('meta-guide-visited', visited.value);
  }
  document.title = `${slides[number].short}｜Meta 商家資產管理`;
}, { immediate: true });

async function go(number, moveFocus = true) {
  const next = clamp(number);
  if (next !== page.value) {
    page.value = next;
    if (pageFromUrl() !== next) window.location.hash = String(next + 1);
    await nextTick();
  }
  if (slideFrame.value) slideFrame.value.scrollTop = 0;
  if (moveFocus) heading.value?.focus({ preventScroll: true });
}

function syncHash() {
  if (pageFromUrl() !== page.value) void go(pageFromUrl(), false);
}

function onKey(event) {
  if (references.value?.open || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.target.closest?.('input, textarea, select, [contenteditable]')) return;
  const offsets = { ArrowRight: 1, PageDown: 1, ArrowLeft: -1, PageUp: -1 };
  if (!(event.key in offsets)) return;
  event.preventDefault();
  void go(page.value + offsets[event.key]);
}

onMounted(() => {
  fitSlide();
  if (typeof ResizeObserver !== 'undefined' && slideFrame.value) {
    slideObserver = new ResizeObserver(fitSlide);
    slideObserver.observe(slideFrame.value);
  }
  window.addEventListener('hashchange', syncHash);
  window.addEventListener('keydown', onKey);
});
onUnmounted(() => {
  slideObserver?.disconnect();
  window.removeEventListener('hashchange', syncHash);
  window.removeEventListener('keydown', onKey);
});
</script>

<template>
  <a class="skip-link" href="#" @click.prevent="heading?.focus()">跳到簡報內容</a>
  <header class="topbar">
    <div class="top-inner">
      <div class="brand-area">
        <button class="wordmark" type="button" aria-label="回到第 1 頁" @click="go(0)"><span class="brand-mark"><Icon name="portfolio" /></span><span>Meta 商家設定教學</span></button>
      </div>
      <button class="button quiet source-button" type="button" @click="references?.showModal()"><Icon name="info" /> <span>官方來源</span></button>
    </div>
  </header>

  <div class="learning-layout">
    <aside class="side-directory">
      <h2>目錄</h2>
      <LessonDirectory :page="page" @go="go" />
    </aside>
    <main class="deck">
      <div ref="slideFrame" class="slide-frame">
        <article class="slide" :data-page="page + 1" :style="{ '--slide-scale': slideScale, '--slide-width': `${slideWidth}px` }" aria-labelledby="slide-heading">
          <div class="slide-heading">
            <h1 id="slide-heading" ref="heading" tabindex="-1">{{ activeSlide.title }}</h1>
          </div>
          <Concepts v-if="page < 6" :key="page" :page="page" />
          <Setup v-else-if="page < 14" :key="page" :page="page" />
          <Review v-else :key="page" v-model:checked="checkedItems" :page="page" />
        </article>
      </div>
    </main>
  </div>

  <footer class="controlbar">
    <div class="controls">
      <button class="button pager-button" type="button" :disabled="page === 0" @click="go(page - 1)"><Icon name="arrowLeft" /> 上一頁</button>
      <div class="progress-box">
        <nav class="progress-track" aria-label="依頁次跳轉">
          <button v-for="(slide, index) in slides" :key="slide.short" type="button" :aria-current="index === page ? 'page' : undefined" :aria-label="`第 ${index + 1} 頁 ${slide.short}`" :title="`第 ${index + 1} 頁 ${slide.short}`" :class="{ visited: visited.includes(index) }" @click="go(index)"></button>
        </nav>
        <span class="progress-caption">第 {{ page + 1 }} / {{ slides.length }} 頁</span>
      </div>
      <button class="button pager-button primary" type="button" :disabled="page === slides.length - 1" @click="go(page + 1)">下一頁 <Icon name="arrowRight" /></button>
    </div>
  </footer>

  <dialog ref="references" class="deck-dialog" aria-labelledby="references-title">
    <div class="dialog-heading"><h2 id="references-title">官方來源</h2><button class="icon-button" type="button" aria-label="關閉官方來源" @click="references?.close()"><Icon name="close" /></button></div>
    <p>資料於 2026 年 11 月 20 日核對。入口、資格與可用功能可能因帳號、地區及介面版本而異，請依登入後的實際提示操作。</p>
    <div class="reference-list">
      <a v-for="source in sources" :key="source.url" :href="source.url" target="_blank" rel="noreferrer"><span><strong>{{ source.label }}</strong><small>{{ source.note }}</small></span><Icon name="external" /></a>
    </div>
    <p class="muted">教學畫面是匿名示意，所有點擊都只改變簡報中的狀態。</p>
  </dialog>
</template>
