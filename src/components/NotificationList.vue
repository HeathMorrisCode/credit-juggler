<script setup>
import { ref } from 'vue';
import { useNotificationStore } from '../stores/notifications';
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  notifications: {
    type: Array,
    required: true
  },
  cardId: {
    type: String,
    required: true
  }
});

const notificationStore = useNotificationStore();
const showAddForm = ref(false);
const newNotification = ref({
  type: 'email',
  trigger: 'promoExpiry',
  days: 30,
  enabled: true,
  name: ''
});

const addNotification = async () => {
  const updatedNotifications = [...props.notifications, {
    ...newNotification.value,
    name: `${newNotification.value.days} days before ${newNotification.value.trigger}`
  }];
  
  await notificationStore.updateCardNotifications(props.cardId, updatedNotifications);
  showAddForm.value = false;
  newNotification.value = {
    type: 'email',
    trigger: 'promoExpiry',
    days: 30,
    enabled: true,
    name: ''
  };
};

const removeNotification = async (index) => {
  const updatedNotifications = props.notifications.filter((_, i) => i !== index);
  await notificationStore.updateCardNotifications(props.cardId, updatedNotifications);
};

const toggleNotification = async (index) => {
  const updatedNotifications = [...props.notifications];
  updatedNotifications[index] = {
    ...updatedNotifications[index],
    enabled: !updatedNotifications[index].enabled
  };
  await notificationStore.updateCardNotifications(props.cardId, updatedNotifications);
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h4 class="text-base font-medium text-gray-900">Active Notifications</h4>
      <button
        type="button"
        class="btn-primary inline-flex items-center text-sm"
        @click="showAddForm = !showAddForm"
      >
        <PlusIcon class="h-4 w-4 mr-1" />
        Add Notification
      </button>
    </div>

    <div v-if="showAddForm" class="card">
      <form @submit.prevent="addNotification" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <select v-model="newNotification.type" class="input-field">
              <option
                v-for="type in notificationStore.availableTypes"
                :key="type.id"
                :value="type.id"
              >
                {{ type.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Trigger</label>
            <select v-model="newNotification.trigger" class="input-field">
              <option
                v-for="trigger in notificationStore.availableTriggers"
                :key="trigger.id"
                :value="trigger.id"
              >
                {{ trigger.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Days Before</label>
            <input v-model.number="newNotification.days" type="number" min="1" class="input-field" />
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            @click="showAddForm = false"
          >
            Cancel
          </button>
          <button type="submit" class="btn-primary">
            Add
          </button>
        </div>
      </form>
    </div>

    <div class="space-y-2">
      <div
        v-for="(notification, index) in notifications"
        :key="index"
        class="flex items-center justify-between p-4 bg-white rounded-lg border"
      >
        <div class="flex items-center space-x-4">
          <input
            type="checkbox"
            :checked="notification.enabled"
            @change="toggleNotification(index)"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{ notification.name }}
            </p>
            <p class="text-sm text-gray-500">
              {{ notification.type }} notification
            </p>
          </div>
        </div>
        <button
          class="text-gray-400 hover:text-gray-500"
          @click="removeNotification(index)"
        >
          <TrashIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>
