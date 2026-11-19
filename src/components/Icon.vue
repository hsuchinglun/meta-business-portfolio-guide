<script setup>
import { computed } from 'vue';
import arrowRight from 'bootstrap-icons/icons/arrow-right.svg?raw';
import arrowRepeat from 'bootstrap-icons/icons/arrow-counterclockwise.svg?raw';
import arrowLeft from 'bootstrap-icons/icons/arrow-left.svg?raw';
import check from 'bootstrap-icons/icons/check2-circle.svg?raw';
import chevron from 'bootstrap-icons/icons/chevron-down.svg?raw';
import close from 'bootstrap-icons/icons/x-lg.svg?raw';
import diagram from 'bootstrap-icons/icons/diagram-3.svg?raw';
import external from 'bootstrap-icons/icons/box-arrow-up-right.svg?raw';
import facebook from 'bootstrap-icons/icons/facebook.svg?raw';
import flag from 'bootstrap-icons/icons/flag.svg?raw';
import gear from 'bootstrap-icons/icons/gear.svg?raw';
import info from 'bootstrap-icons/icons/info-circle.svg?raw';
import instagram from 'bootstrap-icons/icons/instagram.svg?raw';
import list from 'bootstrap-icons/icons/list.svg?raw';
import lock from 'bootstrap-icons/icons/lock.svg?raw';
import megaphone from 'bootstrap-icons/icons/megaphone.svg?raw';
import person from 'bootstrap-icons/icons/person-circle.svg?raw';
import people from 'bootstrap-icons/icons/people.svg?raw';
import play from 'bootstrap-icons/icons/play-btn.svg?raw';
import portfolio from 'bootstrap-icons/icons/briefcase.svg?raw';
import question from 'bootstrap-icons/icons/question-circle.svg?raw';
import search from 'bootstrap-icons/icons/search.svg?raw';
import shield from 'bootstrap-icons/icons/shield-check.svg?raw';
import speech from 'bootstrap-icons/icons/chat-quote.svg?raw';
import threads from 'bootstrap-icons/icons/threads.svg?raw';
import windowIcon from 'bootstrap-icons/icons/window-stack.svg?raw';
import warning from 'bootstrap-icons/icons/exclamation-triangle.svg?raw';

const props = defineProps({ name: { type: String, required: true } });
const icons = { arrowRight, arrowRepeat, arrowLeft, check, chevron, close, diagram, external, facebook, flag, gear, info, instagram, list, lock, megaphone, person, people, play, portfolio, question, search, shield, speech, threads, window: windowIcon, warning };
const graphic = computed(() => icons[props.name] ?? info);
</script>

<template>
  <span class="icon" aria-hidden="true" v-html="graphic"></span>
</template>
