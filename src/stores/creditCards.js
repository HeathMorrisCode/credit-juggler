import { defineStore } from 'pinia';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '@vueuse/firebase';

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
      const { user } = useAuth();
      if (!user.value) return;
      
      this.loading = true;
      try {
        const querySnapshot = await getDocs(collection(db, `users/${user.value.uid}/cards`));
        this.cards = querySnapshot.docs.map(doc => ({
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
      const { user } = useAuth();
      if (!user.value) return;

      try {
        const docRef = await addDoc(collection(db, `users/${user.value.uid}/cards`), {
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
        return docRef.id;
      } catch (error) {
        console.error('Error adding card:', error);
        throw error;
      }
    },

    async updateCard(cardId, updates) {
      const { user } = useAuth();
      if (!user.value) return;

      try {
        await updateDoc(doc(db, `users/${user.value.uid}/cards/${cardId}`), updates);
        await this.fetchCards();
      } catch (error) {
        console.error('Error updating card:', error);
        throw error;
      }
    },

    async deleteCard(cardId) {
      const { user } = useAuth();
      if (!user.value) return;

      try {
        await deleteDoc(doc(db, `users/${user.value.uid}/cards/${cardId}`));
        this.cards = this.cards.filter(card => card.id !== cardId);
      } catch (error) {
        console.error('Error deleting card:', error);
        throw error;
      }
    }
  }
});
