import { defineStore } from 'pinia';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '@vueuse/firebase';

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    defaultNotifications: [
      {
        type: 'email',
        trigger: 'promoExpiry',
        days: 90,
        enabled: true,
        name: '3 Months Before Expiry'
      },
      {
        type: 'email',
        trigger: 'promoExpiry',
        days: 30,
        enabled: true,
        name: '1 Month Before Expiry'
      },
      {
        type: 'email',
        trigger: 'promoExpiry',
        days: 14,
        enabled: true,
        name: '2 Weeks Before Expiry'
      }
    ],
    availableTriggers: [
      { id: 'promoExpiry', name: 'Promotional Rate Expiry' },
      { id: 'balanceThreshold', name: 'Balance Threshold' },
      { id: 'creditUtilization', name: 'Credit Utilization' }
    ],
    availableTypes: [
      { id: 'email', name: 'Email' },
      { id: 'sms', name: 'SMS' }
    ]
  }),

  actions: {
    async updateCardNotifications(cardId, notifications) {
      const { user } = useAuth();
      if (!user.value) return;

      try {
        await updateDoc(doc(db, `users/${user.value.uid}/cards/${cardId}`), {
          notifications
        });
      } catch (error) {
        console.error('Error updating notifications:', error);
        throw error;
      }
    },

    getDefaultNotifications() {
      return [...this.defaultNotifications];
    },

    validateNotification(notification) {
      return {
        isValid: notification.type && notification.trigger && notification.days > 0,
        errors: []
      };
    }
  }
});
