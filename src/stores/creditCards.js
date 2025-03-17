import { defineStore } from 'pinia';
import { database } from '../services/db';
import { auth } from '../services/auth';

export const useCreditCardStore = defineStore('creditCards', {
  state: () => ({
    cards: [],
    loading: false,
    error: null
  }),

  getters: {
    getCardById: (state) => (id) => state.cards.find(card => card.id === id),
    cardsWithUpcomingExpiry: (state) => {
      const now = new Date();
      return state.cards.filter(card => {
        if (!card.promoExpiryDate) return false;
        const expiryDate = new Date(card.promoExpiryDate);
        const diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 90;
      });
    }
  },

  actions: {
    async fetchCards() {
      if (!auth.currentUser.value) return;
      
      this.loading = true;
      try {
        const { docs } = await database.getDocs({
          path: `users/${auth.currentUser.value.uid}/cards`
        });
        this.cards = docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching cards:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async addCard(cardData) {
      if (!auth.currentUser.value) return;

      try {
        const { id } = await database.collection(`users/${auth.currentUser.value.uid}/cards`).add({
          ...cardData,
          createdAt: new Date().toISOString(),
          notifications: cardData.notifications || [
            {
              type: 'email',
              trigger: 'promoExpiry',
              days: 90,
              enabled: true
            },
            {
              type: 'email',
              trigger: 'promoExpiry',
              days: 30,
              enabled: true
            },
            {
              type: 'email',
              trigger: 'promoExpiry',
              days: 14,
              enabled: true
            }
          ]
        });
        await this.fetchCards();
        return id;
      } catch (error) {
        console.error('Error adding card:', error);
        throw error;
      }
    },

    async updateCard(cardId, updates) {
      if (!auth.currentUser.value) return;

      try {
        await database.doc(`users/${auth.currentUser.value.uid}/cards/${cardId}`).update(updates);
        await this.fetchCards();
      } catch (error) {
        console.error('Error updating card:', error);
        throw error;
      }
    },

    async deleteCard(cardId) {
      if (!auth.currentUser.value) return;

      try {
        await database.doc(`users/${auth.currentUser.value.uid}/cards/${cardId}`).delete();
        this.cards = this.cards.filter(card => card.id !== cardId);
      } catch (error) {
        console.error('Error deleting card:', error);
        throw error;
      }
    }
  }
});
