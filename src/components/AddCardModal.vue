<script setup>
import { ref } from 'vue';
import { Dialog, DialogPanel } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { useCreditCardStore } from '../stores/creditCards';

const emit = defineEmits(['close']);
const creditCardStore = useCreditCardStore();

const formData = ref({
  cardName: '',
  lastFourDigits: '',
  creditLimit: 0,
  balance: 0,
  promoApr: 0,
  regularApr: 0,
  promoExpiryDate: '',
  cashAdvanceApr: 0
});

const handleSubmit = async () => {
  try {
    await creditCardStore.addCard(formData.value);
    emit('close');
  } catch (error) {
    console.error('Error adding card:', error);
  }
};
</script>

<template>
  <Dialog as="div" class="relative z-10" @close="emit('close')">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              class="rounded-md bg-white text-gray-400 hover:text-gray-500"
              @click="emit('close')"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-base font-semibold leading-6 text-gray-900">
                Add New Credit Card
              </h3>

              <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Card Name</label>
                    <input v-model="formData.cardName" type="text" required class="input-field" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Last 4 Digits</label>
                    <input v-model="formData.lastFourDigits" type="text" maxlength="4" required class="input-field" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Credit Limit</label>
                    <input v-model.number="formData.creditLimit" type="number" required class="input-field" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Current Balance</label>
                    <input v-model.number="formData.balance" type="number" required class="input-field" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Promotional APR</label>
                    <input v-model.number="formData.promoApr" type="number" step="0.01" required class="input-field" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Regular APR</label>
                    <input v-model.number="formData.regularApr" type="number" step="0.01" required class="input-field" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Cash Advance APR</label>
                    <input v-model.number="formData.cashAdvanceApr" type="number" step="0.01" required class="input-field" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Promo Expiry Date</label>
                    <input v-model="formData.promoExpiryDate" type="date" required class="input-field" />
                  </div>
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    class="btn-primary sm:ml-3"
                  >
                    Add Card
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="emit('close')"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>
