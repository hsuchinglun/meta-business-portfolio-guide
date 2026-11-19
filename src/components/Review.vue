<script setup>
import { nextTick, ref, shallowRef } from 'vue';
import { checklist, issues } from '../data.js';
import Icon from './Icon.vue';

const props = defineProps({ page: { type: Number, required: true } });
const checked = defineModel('checked', { type: Array, required: true });
const selected = shallowRef(issues[0]);
const issuePicker = ref(null);
const diagnosis = ref(null);

async function selectIssue(issue) {
  selected.value = issue;
  if (!window.matchMedia('(max-width: 760px)').matches) return;
  await nextTick();
  diagnosis.value?.focus({ preventScroll: true });
  diagnosis.value?.scrollIntoView({ block: 'start' });
}

function returnToIssues() {
  issuePicker.value?.querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true });
  issuePicker.value?.scrollIntoView({ block: 'start' });
}
</script>

<template>
  <template v-if="props.page === 14">
    <div class="surface demo">
      <div class="diagnosis-layout">
        <div ref="issuePicker" class="issue-picker">
          <p class="click-hint">點一個問題，查看排查方式。</p>
          <div class="issue-buttons" role="group" aria-label="常見問題">
            <button v-for="issue in issues" :key="issue.title" type="button" :aria-pressed="selected === issue" @click="selectIssue(issue)">{{ issue.title }}</button>
          </div>
        </div>
        <div ref="diagnosis" class="diagnosis" tabindex="-1" aria-live="polite">
          <h3>{{ selected.title }}</h3>
          <ol>
            <li><Icon name="warning" /><div><strong>可能原因</strong><p>{{ selected.cause }}</p></div></li>
            <li><Icon name="search" /><div><strong>檢查位置</strong><p>{{ selected.check }}</p></div></li>
            <li><Icon name="check" /><div><strong>處理方式</strong><p>{{ selected.fix }}</p></div></li>
          </ol>
          <button class="button quiet return-to-issues" type="button" @click="returnToIssues">回到問題列表</button>
        </div>
      </div>
    </div>
    <div class="takeaway"><Icon name="info" /><span>從登入身分開始查，再依序核對商家組合、資產歸屬、權限、廣告帳號與付款。</span></div>
  </template>

  <template v-else>
    <p class="lesson-lead">逐項核對，勾選已確認的項目。</p>
    <div class="review-grid">
      <section class="surface demo checklist" aria-label="驗收清單">
        <div class="demo-heading"><h2>驗收清單</h2><span aria-live="polite">{{ checked.length }} / {{ checklist.length }} 項</span></div>
        <label v-for="(item, index) in checklist" :key="item"><input v-model="checked" type="checkbox" :value="index" />{{ item }}</label>
        <p v-if="checked.length === checklist.length" class="check-complete"><Icon name="check" /> 所有項目已勾選。</p>
      </section>
      <section class="surface demo handover">
        <h2>交接需要留下</h2>
        <ul>
          <li>商家名稱、Business ID、品牌 IG 和廣告帳號編號。</li>
          <li>主要與備援管理者，以及各操作人員負責的資產和任務。</li>
          <li>草稿檢查結果、尚未開通的功能、後續負責人。</li>
        </ul>
      </section>

    </div>
  </template>
</template>
