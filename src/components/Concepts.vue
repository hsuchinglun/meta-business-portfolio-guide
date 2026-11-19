<script setup>
import { computed, ref } from 'vue';
import Icon from './Icon.vue';

const props = defineProps({ page: { type: Number, required: true } });

const person = ref(0);
const trace = ref(0);
const asset = ref('portfolio');

const people = [
  { name: '社群同事', group: '品牌商家組合', note: '我能發 IG，也看得到品牌商家組合。', icon: 'instagram' },
  { name: '廣告同事', group: '舊商家組合', note: '我看得到舊商家組合，廣告草稿裡卻找不到品牌 IG。', icon: 'lock' },
];
const currentPerson = computed(() => people[person.value]);

const nodes = [
  { id: 'person', name: 'Facebook 個人帳號', icon: 'facebook', role: '登入身分', detail: '辨識誰在操作。一般以自己的真實 Facebook 身分登入，符合資格的企業也可能使用受管理的 Meta 帳號。' },
  { id: 'portfolio', name: '商家資產管理組合', icon: 'portfolio', role: '資產與權限中心', detail: '在這裡核對資產歸屬、邀請人員，並為每位同事指派需要操作的資產。' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', role: '社群資產', detail: '用於品牌內容與互動，也可以是廣告身分。內容、訊息與廣告等任務可分別授權。' },
  { id: 'threads', name: 'Threads', icon: 'threads', role: '社群資產', detail: '用於經營 Threads。Meta 已公告支援商家設定管理，實際入口與廣告版位請依帳號畫面核對。' },
  { id: 'megaphone', name: '廣告帳號', icon: 'megaphone', role: '活動、預算與付款', detail: '管理廣告活動、預算、計費及成效。廣告帳號權限與 IG 的資產權限要分開檢查。' },
];
const currentAsset = computed(() => nodes.find(({ id }) => asset.value === id));
const inventory = [
  { name: '商家組合', icon: 'portfolio', location: '品牌組合 · Business ID 尾碼 1024', access: '負責人與備援可管理設定' },
  { name: '品牌 IG', icon: 'instagram', location: '品牌組合 · Instagram 帳號', access: '社群同事可發文，廣告權限待補' },
  { name: '廣告帳號', icon: 'megaphone', location: '品牌組合 · 帳號尾碼 4028', access: '投放同事管理廣告，帳務核對付款' },
  { name: '品牌 Threads', icon: 'threads', location: '商家設定入口待確認', access: '社群同事已能在 Threads 發文' },
];
const scenarios = [
  { heading: '只經營 IG、Threads', icon: 'instagram', items: [
    { name: 'Instagram 帳號', status: '必要', note: '用品牌 IG 發文。使用專業工具時，核對帳號類型。' },
    { name: 'Threads 帳號', status: '必要', note: '用品牌 Threads 帳號發文。' },
  ] },
  { heading: '用廣告管理員投放', icon: 'megaphone', items: [
    { name: '個人登入身分', status: '必要', note: '每位操作者用自己的身分登入。' },
    { name: '廣告帳號', status: '必要', note: '取得所用廣告帳號的權限。' },
    { name: '商家資產管理組合', status: '建議', note: '多人管理時，盤點組合與資產歸屬。' },
  ] },
];
</script>

<template>
  <template v-if="props.page === 0">
    <div class="surface lesson-start">
      <div>
        <p class="lesson-lead">給第一次管理 IG、Threads 或準備投放廣告的團隊。依序盤點資產、配置權限，再用廣告草稿驗收。</p>
        <h2>開始前準備</h2>
        <ul><li>電腦與自己的登入身分。</li><li>品牌 IG、Threads，以及能協助驗證的管理者。</li><li>有既有組合時，先向管理者取得 Business ID 和廣告帳號編號。</li></ul>
      </div>
      <figure class="lesson-cover setup-overview">
        <ol aria-label="設定流程">
          <li><Icon name="portfolio" /><span><strong>盤點資產</strong><small>記下商家組合和帳號編號</small></span></li>
          <li><Icon name="people" /><span><strong>指派權限</strong><small>依同事的工作分配資產與任務</small></span></li>
          <li><Icon name="megaphone" /><span><strong>測試草稿</strong><small>用投放同事的身分核對版位</small></span></li>
        </ol>
        <figcaption>完成後留下資產清單和驗收過的草稿，供團隊交接。</figcaption>
      </figure>
    </div>
    <div class="takeaway"><Icon name="info" /><span>教學使用匿名示意畫面。正式操作時，請對照你的 Meta 畫面。</span></div>
  </template>

  <template v-else-if="props.page === 1">
    <p class="lesson-lead">社群同事能發 IG，廣告同事卻只看得到舊組合。以下用兩個匿名商家組合示範怎麼找到品牌 IG。</p>
    <div class="surface demo">
      <div class="switcher" role="group" aria-label="切換同事視角">
        <button v-for="(entry, i) in people" :key="entry.name" type="button" :aria-pressed="person === i" @click="person = i"><Icon name="person" /> {{ entry.name }}</button>
      </div>
      <p v-if="trace < 2" class="click-hint">{{ trace === 0 ? '按「比對商家編號」，下方兩張卡片會顯示各自的 Business ID。' : '按「查看 IG 資產清單」，下方會標出品牌 IG 在哪一個組合。' }}</p>
      <div class="inline-actions">
        <button v-if="trace === 0" class="button primary" type="button" @click="trace = 1"><span class="button-step" aria-hidden="true">1</span>比對商家編號</button>
        <button v-else-if="trace === 1" class="button primary" type="button" @click="trace = 2"><span class="button-step" aria-hidden="true">2</span>查看 IG 資產清單</button>
        <button v-if="trace > 0" class="button quiet" type="button" @click="trace = 0"><Icon name="arrowRepeat" /> 重看</button>
      </div>
      <div class="story-boards" aria-live="polite">
        <div class="access-board" :class="{ active: person === 0 }">
          <div><span class="icon-tile"><Icon name="portfolio" /></span><strong>品牌商家組合</strong></div>
          <span class="status" :class="person === 0 ? 'good' : 'muted-status'">{{ person === 0 ? '目前看得到' : '未指派給此同事' }}</span>
          <p v-if="trace >= 1">Business ID 尾碼 1024（示意）</p>
          <p v-if="trace >= 2"><Icon name="instagram" /> 品牌 IG 在此組合</p>
        </div>
        <div class="access-board" :class="{ active: person === 1 }">
          <div><span class="icon-tile"><Icon name="portfolio" /></span><strong>舊商家組合</strong></div>
          <span class="status" :class="person === 1 ? 'good' : 'muted-status'">{{ person === 1 ? '目前看得到' : '未指派給此同事' }}</span>
          <p v-if="trace >= 1">Business ID 尾碼 2086（示意）</p>
          <p v-if="trace >= 2"><Icon name="window" /> 此組合沒有品牌 IG</p>
        </div>
      </div>
      <div class="voice" :class="{ alert: person === 1 && trace < 2 }" aria-live="polite">
        <Icon :name="currentPerson.icon" />
        <span v-if="trace === 0">{{ currentPerson.name }}登入後看到「{{ currentPerson.group }}」。{{ currentPerson.note }}</span>
        <span v-else-if="trace === 1">兩邊的 Business ID 不同，代表這是兩個組合。接著核對哪個組合有品牌 IG。</span>
        <span v-else>品牌 IG 在尾碼 1024 的組合。請該組合的管理者替廣告同事開通商家存取，並指派需要的 IG 任務。</span>
      </div>
    </div>
  </template>

  <template v-else-if="props.page === 2">
    <p class="lesson-lead">資產突然看不到時，依序比對以下三項。先找出卡住的位置，就知道該切換組合或請管理者補權限。</p>
    <ol class="surface instruction-list concept-steps">
      <li><span class="step-num" aria-hidden="true">1</span><div><h2>確認登入的是誰</h2><p>核對帳號頭像和目前登入的身分。若切到其他身分，先回到團隊平常授權給你的帳號。</p></div></li>
      <li><span class="step-num" aria-hidden="true">2</span><div><h2>確認目前的商家組合</h2><p>比對商家名稱和 Business ID。清單中有正確組合就切換，找不到就向管理者確認存取權。</p></div></li>
      <li><span class="step-num" aria-hidden="true">3</span><div><h2>確認該資產的任務權限</h2><p>人在正確組合卻看不到 IG 或廣告帳號時，由管理者在該資產的設定中確認人員與任務。補齊後請同事用自己的身分重試。</p></div></li>
    </ol>
  </template>

  <template v-else-if="props.page === 3">
    <div class="surface demo map-layout">
      <div class="map" aria-label="帳號與商家資產關係圖">
        <button v-for="node in nodes.slice(0, 2)" :key="node.id" class="map-node" :class="[`map-${node.id}`, { selected: asset === node.id }]" type="button" :aria-pressed="asset === node.id" @click="asset = node.id"><Icon :name="node.icon" /><span>{{ node.name }}</span></button>
        <div class="map-connector identity" :class="{ highlighted: ['person','portfolio'].includes(asset) }"><span>以個人身分進入</span></div>
        <div class="map-connector assets" :class="{ highlighted: asset !== 'person' }"><span>查看歸屬與分配權限</span></div>
        <div class="map-assets">
          <button v-for="node in nodes.slice(2)" :key="node.id" class="map-node" :class="{ selected: asset === node.id }" type="button" :aria-pressed="asset === node.id" @click="asset = node.id"><Icon :name="node.icon" /><span>{{ node.name }}</span></button>
        </div>
      </div>
      <div class="map-detail" aria-live="polite"><span class="icon-tile"><Icon :name="currentAsset.icon" /></span><span class="label">{{ currentAsset.role }}</span><h2>{{ currentAsset.name }}</h2><p>{{ currentAsset.detail }}</p></div>
    </div>
    <div class="takeaway"><Icon name="info" /><span>連線代表管理關係。建立組合後，仍要逐一確認資產的歸屬與權限。</span></div>
  </template>

  <template v-else-if="props.page === 4">
    <p class="lesson-lead">盤點時，讓每項資產都留下「在哪個組合、誰能操作、做什麼用」的紀錄。以下是匿名範例。</p>
    <ul class="surface inventory-list" aria-label="資產盤點範例">
      <li v-for="item in inventory" :key="item.name">
        <strong class="inventory-name"><Icon :name="item.icon" /> {{ item.name }}</strong>
        <span>{{ item.location }}</span>
        <span>{{ item.access }}</span>
      </li>
    </ul>
  </template>

  <template v-else>
    <div class="scenario-grid">
      <section v-for="scenario in scenarios" :key="scenario.heading" class="surface scenario-card">
        <div class="scenario-heading"><span class="icon-tile"><Icon :name="scenario.icon" /></span><h2>{{ scenario.heading }}</h2></div>
        <ul>
          <li v-for="item in scenario.items" :key="item.name">
            <div><strong>{{ item.name }}</strong><span class="status" :class="item.status === '必要' ? 'need' : 'suggested'">{{ item.status }}</span></div>
            <p>{{ item.note }}</p>
          </li>
        </ul>
      </section>
    </div>
    <section class="surface scenario-conditions">
      <h2>依使用功能確認</h2>
      <div><Icon name="window" /><p><strong>Facebook 粉絲專頁</strong>。依廣告身分或整合功能的提示確認。</p></div>
      <div><Icon name="threads" /><p><strong>Threads 廣告版位</strong>。用草稿確認可用版位和品牌身分。</p></div>
    </section>
  </template>
</template>
