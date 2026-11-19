<script setup>
import { computed, nextTick, ref } from 'vue';
import Icon from './Icon.vue';

const step = ref(0);
const result = ref(null);
const actions = ['查看帳號比對', '查看品牌 IG 的權限', '查看補權限後的草稿'];
const frames = [
  {
    title: '草稿找不到品牌 IG', path: '廣告草稿 → 廣告 → 身分', icon: 'warning',
    rows: [['Instagram 身分', '清單中沒有品牌 IG']],
    note: '先按「查看帳號比對」，確認草稿是否開在團隊預定使用的廣告帳號。',
  },
  {
    title: '第一步 · 比對廣告帳號', path: '廣告管理員 → 帳號選擇器', icon: 'check',
    rows: [['目前草稿使用的帳號', '尾碼 4028'], ['團隊預定的廣告帳號', '尾碼 4028']],
    note: '兩個編號相同。接著查看廣告同事在品牌 IG 上有沒有廣告任務。',
  },
  {
    title: '第二步 · 查到缺少 IG 廣告權限', path: '商家設定 → Instagram 帳號 → 已指派人員', icon: 'warning',
    rows: [['廣告同事 · 廣告帳號', '可操作廣告'], ['廣告同事 · 品牌 IG', '尚未指派廣告任務']],
    note: '由有權限的管理者，在品牌 IG 資產中補上這位同事的廣告任務。',
  },
  {
    title: '第三步 · 回到原草稿驗證', path: '廣告管理員 → 原草稿 → 廣告 → 身分', icon: 'check',
    rows: [['品牌 IG 的廣告任務', '管理者已指派'], ['同一位廣告同事重開草稿', '品牌 IG 現在可選']],
    note: '把結果記下並保留草稿。需要投放時，再核對可用版位及其他提示。',
  },
];
const frame = computed(() => frames[step.value]);

async function showFrame(index) {
  step.value = index;
  await nextTick();
  result.value?.focus({ preventScroll: true });
}
</script>

<template>
  <section class="surface demo draft-example" aria-label="廣告草稿排查示範">
    <div class="demo-heading"><h2>{{ frame.title }}</h2><span class="muted draft-caption">匿名示意</span></div>
    <div ref="result" class="draft-result" tabindex="-1">
      <p class="draft-path"><Icon name="window" />{{ frame.path }}</p>
      <dl class="evidence-rows">
        <div v-for="[label, value] in frame.rows" :key="label"><dt>{{ label }}</dt><dd>{{ value }}</dd></div>
      </dl>
      <div class="voice" :class="{ alert: frame.icon === 'warning' }"><Icon :name="frame.icon" /><span>{{ frame.note }}</span></div>
    </div>
    <div class="inline-actions">
      <button v-if="step < actions.length" class="button primary" type="button" @click="showFrame(step + 1)"><span class="button-step" aria-hidden="true">{{ step + 1 }}</span>{{ actions[step] }} <Icon name="arrowRight" /></button>
      <button v-if="step > 0" class="button quiet" type="button" @click="showFrame(0)"><Icon name="arrowRepeat" /> 重看示範</button>
    </div>
  </section>
</template>
