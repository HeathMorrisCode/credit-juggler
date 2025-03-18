<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  }
});
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
  >
    <slot></slot>
  </button>
</template>
