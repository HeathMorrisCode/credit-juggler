<script setup>
import { defineProps, defineEmits } from 'vue';
import BaseButton from './BaseButton.vue';

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  }
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-slate-500 opacity-75"></div>
      </div>

      <div class="transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-sm transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 class="text-lg font-medium leading-6 text-slate-900">{{ title }}</h3>
            <div class="mt-2">
              <p class="text-sm text-slate-600">{{ message }}</p>
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <BaseButton @click="emit('confirm')">
            Confirm
          </BaseButton>
          <BaseButton
            @click="emit('cancel')"
            class="mr-3"
          >
            Cancel
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
