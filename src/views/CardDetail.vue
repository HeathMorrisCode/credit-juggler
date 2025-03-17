<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCreditCardStore } from '../stores/creditCards';
import { useNotificationStore } from '../stores/notifications';
import NotificationList from '../components/NotificationList.vue';

const route = useRoute();
const router = useRouter();
const creditCardStore = useCreditCardStore();
const notificationStore = useNotificationStore();

const card = computed(() => creditCardStore.getCardById(route.params.id));
const isEditing = ref(false);
const editForm = ref(null);

const toggleEdit = () => {
  if (isEditing.value) {
    isEditing.value = false;
  } else {
    editForm.value = { ...card.value };
    isEditing.value = true;
  }
};

const saveChanges = async () => {
  try {
    await creditCardStore.updateCard(card.value.id, editForm.value);
    isEditing.value = false;
  } catch (error) {
    console.error('Error updating card:', error);
  }
};

const deleteCard = async () => {
  if (confirm('Are you sure you want to delete this card?')) {
    try {
      await creditCardStore.deleteCard(card.value.id);
      router.push('/');
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  }
};
</script>

<template>
  <div v-if="card">
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {{ isEditing ? 'Edit Card' : card.cardName }}
        </h2>
      </div>
      <div class="mt-4 flex space-x-3 md:ml-4 md:mt-0">
        <button
          type="button"
          class="btn-primary"
          @click="toggleEdit"
        >
          {{ isEditing ? 'Cancel' : 'Edit' }}
        </button>
        <button
          v-if="!isEditing"
          type="button"
          class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          @click="deleteCard"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div v-if="!isEditing">
          <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500">Card Number (Last 4)</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ card.lastFourDigits }}</dd>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500">Credit Limit</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">${{ card.creditLimit.toLocaleString() }}</dd>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500">Current Balance</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">${{ card.balance.toLocaleString() }}</dd>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500">Promotional APR</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ card.promoApr }}%</dd>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500">Regular APR</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ card.regularApr }}%</dd>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <dt class="text-sm font-medium text-gray-500">Promo Expiry Date</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ new Date(card.promoExpiryDate).toLocaleDateString() }}</dd>
            </div>
          </dl>
        </div>
        
        <form v-else @submit.prevent="saveChanges" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Card Name</label>
              <input v-model="editForm.cardName" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last 4 Digits</label>
              <input v-model="editForm.lastFourDigits" type="text" maxlength="4" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Credit Limit</label>
              <input v-model.number="editForm.creditLimit" type="number" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Current Balance</label>
              <input v-model.number="editForm.balance" type="number" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Promotional APR</label>
              <input v-model.number="editForm.promoApr" type="number" step="0.01" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Regular APR</label>
              <input v-model.number="editForm.regularApr" type="number" step="0.01" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Promo Expiry Date</label>
              <input v-model="editForm.promoExpiryDate" type="date" class="input-field" />
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button type="submit" class="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

    <div class="mt-8">
      <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Notifications</h3>
      <NotificationList
        :notifications="card.notifications"
        :card-id="card.id"
      />
    </div>
  </div>
  <div v-else class="text-center py-12">
    <p class="text-gray-500">Card not found</p>
  </div>
</template>
