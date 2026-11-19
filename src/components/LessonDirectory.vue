<script setup>
import { chapters, slides } from '../data.js';

defineProps({ page: { type: Number, required: true } });
defineEmits(['go']);
</script>

<template>
  <nav aria-label="教學目錄">
    <div class="directory-group" v-for="group in chapters" :key="group.name">
      <h3>{{ group.name }}</h3>
      <div class="directory-grid">
        <button v-for="(_, index) in slides.slice(group.range[0], group.range[1] + 1)" :key="index" type="button" class="directory-item" :aria-current="page === group.range[0] + index ? 'page' : undefined" @click="$emit('go', group.range[0] + index)">
          <span class="directory-number">{{ String(group.range[0] + index + 1).padStart(2, '0') }}</span><span class="directory-label">{{ slides[group.range[0] + index].short }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>
