<script setup>
import { computed } from 'vue';
import Icon from './Icon.vue';

const props = defineProps({ page: { type: Number, required: true } });
const figures = {
  6: {
    title: '商家設定',
    rows: [
      { icon: 'person', label: '個人登入身分', value: '先確認目前是哪位管理者', step: 1 },
      { icon: 'portfolio', label: '商家選擇器', value: '品牌商家組合' },
      { icon: 'info', label: '商家資料', value: 'Business ID 尾碼 1024', step: 2 },
    ],
    caption: '先切到要查的組合，再記下商家資料中的編號。',
  },
  9: {
    title: '商家設定 · 帳號',
    rows: [
      { icon: 'portfolio', label: '商家選擇器', value: '核對組合名稱與編號', step: 1 },
      { icon: 'instagram', label: 'Instagram 帳號', value: '核對品牌 IG 與任務', step: 2 },
      { icon: 'threads', label: 'Threads 帳號', value: '有入口時再核對', step: 4 },
    ],
    caption: '各資產分開查看。Threads 入口依帳號畫面為準。',
  },
  11: {
    title: '商家設定 · 權限',
    rows: [
      { icon: 'people', label: '人員', value: '從正確的商家組合進入', step: 1 },
      { icon: 'instagram', label: 'Instagram 帳號', value: '確認已指派所需任務', step: 3 },
      { icon: 'check', label: '邀請狀態', value: '已接受', step: 4 },
    ],
    caption: '商家邀請與 IG 任務分開核對。',
  },
  13: {
    title: '廣告管理員 · 廣告草稿',
    rows: [
      { icon: 'megaphone', label: '廣告帳號', value: '先比對帳號編號', step: 1 },
      { icon: 'window', label: '廣告組合', value: '查看可選版位', step: 2 },
      { icon: 'instagram', label: '廣告', value: '確認品牌身分', step: 3 },
    ],
    caption: '草稿中先對帳號，再看版位與品牌身分。',
  },
};
const figure = computed(() => figures[props.page]);
</script>

<template>
  <figure v-if="figure" class="settings-figure">
    <div class="settings-window">
      <div class="settings-title"><Icon name="window" /><strong>{{ figure.title }}</strong><span>示意</span></div>
      <div class="settings-row" v-for="row in figure.rows" :key="row.label" :class="{ 'settings-focus': row.step }">
        <Icon :name="row.icon" /><span><strong>{{ row.label }}</strong><small v-if="row.value">{{ row.value }}</small></span><b v-if="row.step" class="figure-step">{{ row.step }}</b>
      </div>
    </div>
    <figcaption>{{ figure.caption }}</figcaption>
  </figure>
</template>
