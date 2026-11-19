<script setup>
import { computed, ref } from 'vue';
import { setup, sources } from '../data.js';
import { lessonSteps } from '../lesson-steps.js';
import Icon from './Icon.vue';
import SettingsFigure from './SettingsFigure.vue';
import DraftDemo from './DraftDemo.vue';

const props = defineProps({ page: { type: Number, required: true } });
const step = computed(() => setup[props.page]);
const inviteChecked = ref(false);
const igGranted = ref(false);
const lesson = computed(() => lessonSteps[props.page]);
const role = ref(0);

const stepNames = {
  6: ['核對登入身分', '找商家組合與編號', '清點每一個資產', '決定沿用或新建'],
  7: ['準備登入身分', '開啟雙重驗證', '核對 IG 的帳號類型', '確認 Threads 與聯絡信箱'],
  8: ['進入 Meta Business Suite', '開啟建立入口', '填寫商家資料', '提交並確認 Business ID'],
  9: ['核對目前的商家組合', '新增或連結 IG', '確認 IG 與人員權限', '查看 Threads 的管理入口'],
  10: ['先找現成的廣告帳號', '需要時才建立', '確認時區、幣別與所屬商家', '驗證存取與帳號狀態'],
  11: ['進入人員管理', '選擇商家層級權限', '分配資產與任務', '確認邀請已接受'],
  12: ['完成安全與備援設定', '設定付款方式', '核對限制與通知', '依提示處理商家驗證'],
  13: ['選擇廣告帳號和草稿', '查看版位', '核對品牌身分', '檢查提示並保留草稿'],
};
const roles = [
  { name: '品牌負責人', scope: '商家完整控制權＋關鍵資產', reason: '負責資產歸屬、人員授權和交接。' },
  { name: '備援管理者', scope: '商家完整控制權', reason: '主要管理者無法操作時，可接手必要設定。' },
  { name: '行銷操作人員', scope: '部分存取＋工作所需的資產任務', reason: '依分工取得 IG 內容、Threads 或廣告操作權。' },
  { name: '外部合作方', scope: '依合作範圍授權', reason: '只分享必要資產、任務和合作期間。' },
];
</script>

<template>
  <div class="lesson-workspace" :class="{ 'with-demo': [11, 13].includes(props.page) }">
    <section class="surface procedure" aria-label="操作說明">
      <div class="path"><Icon name="diagram" /><strong>{{ step.path }}</strong><a :href="step.link" target="_blank" rel="noreferrer">官方入口 <Icon name="external" /></a></div>
      <p class="lesson-before"><strong>開始前</strong> {{ lesson.before }}</p>
      <ol class="instruction-list setup-instructions">
        <li v-for="(detail, i) in step.steps" :key="detail">
          <span class="step-num" aria-hidden="true">{{ i + 1 }}</span>
          <div>
            <h2>{{ stepNames[props.page][i] }}</h2>
            <p>{{ detail }}</p>
            <p class="instruction-check"><strong>確認</strong> {{ lesson.checks[i][0] }}</p>
            <p v-if="lesson.checks[i][1]" class="instruction-fix"><strong>卡關時</strong> {{ lesson.checks[i][1] }}</p>
          </div>
        </li>
      </ol>
      <a class="inline-source" :href="sources[step.source].url" target="_blank" rel="noreferrer">{{ sources[step.source].label }} <Icon name="external" /></a>
    </section>

    <aside class="lesson-side">
      <DraftDemo v-if="props.page === 13" />
      <SettingsFigure v-else-if="props.page !== 11" :page="props.page" />
      <div v-if="props.page === 11" class="surface demo permission-demo">

      <div class="demo-heading"><h2><Icon name="lock" /> 示範：補上同事的 IG 權限</h2></div>
      <dl class="permission-entries" aria-label="商家層級及資產層級的權限">
        <div class="flow-node" :class="{ passed: inviteChecked }">
          <dt><Icon name="people" /> 商家邀請</dt>
          <dd class="status" :class="inviteChecked ? 'good' : 'muted-status'">{{ inviteChecked ? '已接受' : '待確認' }}</dd>
        </div>
        <div class="flow-node" :class="{ blocked: inviteChecked && !igGranted, passed: igGranted }">
          <dt><Icon name="instagram" /> 品牌 IG 權限</dt>
          <dd class="status" :class="igGranted ? 'good' : (inviteChecked ? 'caution' : 'muted-status')">{{ igGranted ? '已指派內容任務' : (inviteChecked ? '尚未指派' : '待確認') }}</dd>
        </div>
      </dl>
      <div class="voice" :class="{ alert: inviteChecked && !igGranted }" aria-live="polite"><Icon :name="igGranted ? 'check' : (inviteChecked ? 'warning' : 'info')" /><span>{{ igGranted ? '同事可管理 IG 內容。廣告任務須另外授權。' : (inviteChecked ? '邀請已接受，但仍缺該 IG 的內容任務。' : '按「檢查邀請狀態」，比對商家邀請和 IG 權限。') }}</span></div>
      <div class="inline-actions">
        <button v-if="!inviteChecked" class="button primary" type="button" @click="inviteChecked = true"><span class="button-step" aria-hidden="true">1</span>檢查邀請狀態 <Icon name="arrowRight" /></button>
        <button v-else-if="!igGranted" class="button primary" type="button" @click="igGranted = true"><span class="button-step" aria-hidden="true">2</span>指派 IG 權限 <Icon name="arrowRight" /></button>
        <button v-if="inviteChecked" class="button quiet" type="button" @click="inviteChecked = false; igGranted = false"><Icon name="arrowRepeat" /> 重做示範</button>
      </div>
    </div>
    <div v-if="props.page === 11" class="surface role-card">
      <h2>授權範例</h2>
      <div class="switcher" role="group" aria-label="選擇權限範例">
        <button v-for="(entry, i) in roles" :key="entry.name" type="button" :aria-pressed="role === i" @click="role = i">{{ entry.name }}</button>
      </div>
      <p aria-live="polite"><strong>{{ roles[role].scope }}</strong>。{{ roles[role].reason }}</p>
    </div>
      <div class="step-facts">
        <div class="fact good"><Icon name="check" /><div><h2>完成標準</h2><p>{{ step.done }}</p></div></div>
        <div class="fact caution"><Icon name="warning" /><div><h2>容易出錯</h2><p>{{ step.pitfall }}</p></div></div>
      </div>
    </aside>
  </div>
</template>
