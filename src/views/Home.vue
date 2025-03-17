<script setup>
import { ref } from 'vue';
import { useCreditCardStore } from '../stores/creditCards';
import { auth } from '../services/auth';
import ConfirmModal from '../components/ConfirmModal.vue';

const creditCardStore = useCreditCardStore();
const viewMode = ref('cards'); // 'cards' or 'table'
const cardToDelete = ref(null);
const showDeleteModal = ref(false);
const showAddModal = ref(false);

const newCard = ref({
  name: '',
  lastFourDigits: '',
  promoExpiryDate: '',
  promoRate: '',
  standardRate: '',
  creditLimit: '',
  currentBalance: '',
  minimumPayment: '',
  autopayDate: '1',
  notes: ''
});

const addCard = async () => {
  await creditCardStore.addCard(newCard.value);
  newCard.value = {
    name: '',
    lastFourDigits: '',
    promoExpiryDate: '',
    promoRate: '',
    standardRate: '',
    creditLimit: '',
    currentBalance: '',
    minimumPayment: '',
    autopayDate: '1',
    notes: ''
  };
  showAddModal.value = false;
};

const confirmDelete = (card) => {
  cardToDelete.value = card;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (cardToDelete.value) {
    await creditCardStore.deleteCard(cardToDelete.value.id);
    showDeleteModal.value = false;
    cardToDelete.value = null;
  }
};

const handleDateSelect = (event) => {
  event.target.blur();
};

const days = Array.from({ length: 31 }, (_, i) => i + 1);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-medium text-slate-800">Your Credit Cards</h1>
      <div class="flex items-center space-x-4">
        <div class="flex items-center bg-slate-100 rounded-lg p-1">
          <button
            @click="viewMode = 'cards'"
            :class="[
              'p-2 rounded-md transition-colors',
              viewMode === 'cards'
                ? 'bg-white shadow-sm text-slate-700'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="viewMode = 'table'"
            :class="[
              'p-2 rounded-md transition-colors',
              viewMode === 'table'
                ? 'bg-white shadow-sm text-slate-700'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <button
          @click="showAddModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Add Card
        </button>
      </div>
    </div>

    <!-- Card List -->
    <div class="bg-white border border-slate-200 rounded-lg p-6">
      <div v-if="creditCardStore.cards.length === 0" class="text-slate-500 text-center py-4">
        No cards added yet
      </div>
      <div v-else>
        <!-- Table View -->
        <div v-if="viewMode === 'table'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Card</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Min Payment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Limit</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Promo Rate</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Standard Rate</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Autopay Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Promo Expires</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr v-for="card in creditCardStore.cards" :key="card.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-slate-900">{{ card.name }}</div>
                  <div class="text-sm text-slate-500">**** {{ card.lastFourDigits }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  ${{ card.currentBalance }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  ${{ card.minimumPayment }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  ${{ card.creditLimit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {{ card.promoRate }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {{ card.standardRate }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {{ card.autopayDate }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {{ new Date(card.promoExpiryDate).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="confirmDelete(card)"
                    class="text-rose-600 hover:text-rose-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Card View -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="card in creditCardStore.cards"
            :key="card.id"
            class="border border-slate-200 rounded-lg p-4 hover:bg-slate-50"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-slate-700">{{ card.name }}</h3>
                <p class="text-sm text-slate-500">**** **** **** {{ card.lastFourDigits }}</p>
              </div>
              <button
                @click="confirmDelete(card)"
                class="text-rose-600 hover:text-rose-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
            <div class="mt-2 grid grid-cols-2 gap-2">
              <p class="text-sm text-slate-600">
                <span class="font-medium">Balance:</span> ${{ card.currentBalance }}
              </p>
              <p class="text-sm text-slate-600">
                <span class="font-medium">Credit Limit:</span> ${{ card.creditLimit }}
              </p>
              <p class="text-sm text-slate-600">
                <span class="font-medium">Promo Rate:</span> {{ card.promoRate }}%
              </p>
              <p class="text-sm text-slate-600">
                <span class="font-medium">Standard Rate:</span> {{ card.standardRate }}%
              </p>
              <p class="text-sm text-slate-600">
                <span class="font-medium">Min Payment:</span> ${{ card.minimumPayment }}
              </p>
              <p class="text-sm text-slate-600">
                <span class="font-medium">Autopay:</span> {{ card.autopayDate }}
              </p>
              <p class="text-sm text-slate-600 col-span-2">
                <span class="font-medium">Promo Expires:</span>
                {{ new Date(card.promoExpiryDate).toLocaleDateString() }}
              </p>
            </div>
            <p v-if="card.notes" class="text-sm text-slate-500 mt-2">
              {{ card.notes }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Card Modal -->
  <div v-if="showAddModal" class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-slate-500 opacity-75"></div>
      </div>

      <div class="transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            @click="showAddModal = false"
            class="rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none"
          >
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="sm:flex sm:items-start">
          <div class="mt-3 w-full text-center sm:mt-0 sm:text-left">
            <h3 class="text-lg font-medium leading-6 text-slate-900">Add New Card</h3>
            <div class="mt-4">
              <form @submit.prevent="addCard" class="space-y-4">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-slate-600">Card Name</label>
                    <input
                      v-model="newCard.name"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600">Last 4 Digits</label>
                    <input
                      v-model="newCard.lastFourDigits"
                      type="text"
                      maxlength="4"
                      pattern="[0-9]{4}"
                      required
                      class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600">Promo Rate (%)</label>
                    <input
                      v-model="newCard.promoRate"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600">Standard Rate (%)</label>
                    <input
                      v-model="newCard.standardRate"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600">Credit Limit ($)</label>
                    <input
                      v-model="newCard.creditLimit"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600">Current Balance ($)</label>
                    <input
                      v-model="newCard.currentBalance"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600">Minimum Payment ($)</label>
                    <input
                      v-model="newCard.minimumPayment"
                      type="number"
                      step="0.01"
                      min="0"
                      class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600">Autopay Date</label>
                    <select
                      v-model="newCard.autopayDate"
                      class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    >
                      <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-600">Promo Expiry Date</label>
                    <input
                      v-model="newCard.promoExpiryDate"
                      type="date"
                      required
                      @change="handleDateSelect"
                      class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-600">Notes</label>
                  <textarea
                    v-model="newCard.notes"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  ></textarea>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Card
                  </button>
                  <button
                    type="button"
                    @click="showAddModal = false"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <ConfirmModal
    :show="showDeleteModal"
    title="Delete Card"
    :message="'Are you sure you want to delete ' + (cardToDelete?.name || 'this card') + '?'"
    @confirm="handleDelete"
    @cancel="showDeleteModal = false"
  />
</template>
