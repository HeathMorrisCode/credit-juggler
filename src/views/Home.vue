<script setup>
import { ref, computed } from 'vue';
import { useCreditCardStore } from '../stores/creditCards';
import BaseButton from '../components/BaseButton.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const creditCardStore = useCreditCardStore();
const showAddModal = ref(false);
const showConfirmDelete = ref(false);
const cardToDelete = ref(null);
const viewMode = ref('cards');
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const daysEnglish = Array.from({ length: 31 }, (_, i) => {
  const num = i + 1;
  if (num >= 11 && num <= 13) return `${num}th`;
  switch (num % 10) {
    case 1: return `${num}st`;
    case 2: return `${num}nd`;
    case 3: return `${num}rd`;
    default: return `${num}th`;
  }
});
const dateInput = ref(null);
const fileInput = ref(null);

const newCard = ref({
  name: '',
  lastFourDigits: '',
  promoRate: '',
  standardRate: '',
  creditLimit: '',
  currentBalance: '',
  minimumPayment: '',
  autopayDate: 1,
  promoExpiryDate: '',
  notes: ''
});

const handleDateSelect = (event) => {
  newCard.value.promoExpiryDate = event.target.value;
};

const addCard = () => {
  creditCardStore.addCard({
    ...newCard.value,
    id: Date.now().toString()
  });
  showAddModal.value = false;
  newCard.value = {
    name: '',
    lastFourDigits: '',
    promoRate: '',
    standardRate: '',
    creditLimit: '',
    currentBalance: '',
    minimumPayment: '',
    autopayDate: 1,
    promoExpiryDate: '',
    notes: ''
  };
};

const confirmDelete = (card) => {
  cardToDelete.value = card;
  showConfirmDelete.value = true;
};

const handleDelete = () => {
  if (cardToDelete.value) {
    creditCardStore.deleteCard(cardToDelete.value.id);
    showConfirmDelete.value = false;
    cardToDelete.value = null;
  }
};

const exportCards = () => {
  const data = JSON.stringify(creditCardStore.cards, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `credit-cards-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const importCards = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const cards = JSON.parse(e.target.result);
        if (Array.isArray(cards)) {
          cards.forEach(card => {
            if (!creditCardStore.cards.find(c => c.id === card.id)) {
              creditCardStore.addCard(card);
            }
          });
        }
      } catch (error) {
        console.error('Error importing cards:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset the input
  }
};

const availableViewModes = computed(() => {
  if (window.innerWidth < 640) { // sm breakpoint
    return ['cards'];
  }
  return ['cards', 'table'];
});

const formatLastFour = (digits) => {
  return digits ? `*${digits}` : '-';
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '-';
  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatRate = (rate) => {
  if (rate === null || rate === undefined || rate === '') return '-';
  return `${Number(rate)}%`;
};

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
    timeZone: 'UTC'
  });
};

const isExpired = (date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiryDate = new Date(date);
  expiryDate.setHours(0, 0, 0, 0);
  return expiryDate < today;
};

const formatDay = (day) => {
  if (!day) return '-';
  const index = Number(day) - 1;
  return daysEnglish[index] || '-';
};

const formatNumber = (number) => {
  if (number === null || number === undefined || number === '') return '-';
  return Number(number).toLocaleString('en-US');
};

</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-medium text-gray-900">Your Credit Cards</h1>
      <div class="flex items-center space-x-4">
        <!-- View Mode Switcher - Hidden on Mobile -->
        <div v-if="availableViewModes.length > 1" class="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            v-for="mode in availableViewModes"
            :key="mode"
            @click="viewMode = mode"
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none',
              viewMode === mode
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-900'
            ]"
          >
            <svg v-if="mode === 'cards'" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        
        <!-- Import/Export and Add Card Buttons -->
        <div class="flex items-center space-x-2">
          <input
            type="file"
            accept=".json"
            class="hidden"
            ref="fileInput"
            @change="importCards"
          />
          <BaseButton @click="$refs.fileInput.click()">
            Import
          </BaseButton>
          <BaseButton @click="exportCards">
            Export
          </BaseButton>
          <BaseButton @click="showAddModal = true">
            Add Card
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Card List -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <div v-if="creditCardStore.cards.length === 0" class="text-gray-500 text-center py-4">
        No cards added yet
      </div>
      <div v-else>
        <!-- Table View - Hidden on Mobile -->
        <div v-if="viewMode === 'table'" class="hidden sm:block overflow-x-auto">
          <!-- Tablet View -->
          <table class="min-w-full divide-y divide-gray-200 sm:table lg:hidden">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rates</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payments</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="card in creditCardStore.cards" :key="card.id">
                <td class="px-4 py-4 whitespace-nowrap text-left">
                  <div class="text-sm font-medium text-gray-900">{{ card.name }}</div>
                  <div class="text-sm text-gray-500">{{ formatLastFour(card.lastFourDigits) }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                  {{ formatCurrency(card.currentBalance) }} / {{ formatCurrency(card.creditLimit) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-left">
                  <template v-if="card.promoRate">
                    <div class="text-sm font-medium text-gray-900">⭐ {{ formatRate(card.promoRate) }}</div>
                    <div class="text-sm" :class="{ 'font-bold text-red-600': isExpired(card.promoExpiryDate), 'text-gray-900': !isExpired(card.promoExpiryDate) }">
                      {{ formatDate(card.promoExpiryDate) }}
                    </div>
                  </template>
                  <div class="text-sm text-gray-500">{{ formatRate(card.standardRate) }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-left">
                  <div class="text-sm font-medium text-gray-900">{{ formatCurrency(card.minimumPayment) }}</div>
                  <div class="text-sm text-gray-500">{{ formatDay(card.autopayDate) }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-right space-x-2">
                  <button class="p-2 text-gray-400 hover:text-gray-500 rounded-lg">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(card)" class="p-2 text-gray-400 hover:text-gray-500 rounded-lg">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Desktop View -->
          <table class="min-w-full divide-y divide-gray-200 hidden lg:table">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last 4</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Limit</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard Rate</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Rate</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Expiry</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autopay</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="card in creditCardStore.cards" :key="card.id">
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{{ card.name }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{{ formatLastFour(card.lastFourDigits) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{{ formatCurrency(card.currentBalance) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{{ formatCurrency(card.creditLimit) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{{ formatRate(card.standardRate) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{{ formatRate(card.promoRate) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-left" :class="{ 'font-bold text-red-600': isExpired(card.promoExpiryDate), 'text-gray-900': !isExpired(card.promoExpiryDate) }">
                  {{ formatDate(card.promoExpiryDate) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{{ formatCurrency(card.minimumPayment) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">{{ formatDay(card.autopayDate) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-right space-x-2">
                  <button class="p-2 text-gray-400 hover:text-gray-500 rounded-lg">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(card)" class="p-2 text-gray-400 hover:text-gray-500 rounded-lg">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-gray-900">{{ card.name }}</h3>
                <p class="text-sm text-gray-500">*{{ card.lastFourDigits }}</p>
              </div>
              <BaseButton @click="confirmDelete(card)">
                Delete
              </BaseButton>
            </div>
            <div class="mt-2 grid grid-cols-2 gap-2">
              <p class="text-sm text-gray-600">
                <span class="font-medium">Balance:</span> ${{ formatNumber(card.currentBalance) }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Credit Limit:</span> ${{ formatNumber(card.creditLimit) }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Promo Rate:</span> {{ formatRate(card.promoRate) }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Standard Rate:</span> {{ formatRate(card.standardRate) }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Autopay:</span> ${{ formatNumber(card.minimumPayment) }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Payment Date:</span> {{ formatDay(card.autopayDate) }}
              </p>
              <p class="text-sm text-gray-600 col-span-2">
                <span class="font-medium">Promo Expires: </span>
                <span :class="{ 'font-bold text-red-600': isExpired(card.promoExpiryDate) }">
                  {{ formatDate(card.promoExpiryDate) }}
                </span>
              </p>
            </div>
            <p v-if="card.notes" class="text-sm text-gray-500 mt-2">
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
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div class="transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-sm transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            @click="showAddModal = false"
            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="sm:flex sm:items-start">
          <div class="mt-3 w-full text-center sm:mt-0 sm:text-left">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Add New Card</h3>
            <div class="mt-4">
              <form @submit.prevent="addCard" class="space-y-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Card Name <sup class="text-red-500">*</sup></label>
                    <input
                      v-model="newCard.name"
                      type="text"
                      required
                      class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Last 4 Digits <sup class="text-red-500">*</sup></label>
                    <input
                      v-model="newCard.lastFourDigits"
                      type="text"
                      maxlength="4"
                      pattern="[0-9]{4}"
                      required
                      class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Promo Rate (%)</label>
                    <input
                      v-model="newCard.promoRate"
                      type="number"
                      step="0.01"
                      min="0"
                      class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Standard Rate (%) <sup class="text-red-500">*</sup></label>
                    <input
                      v-model="newCard.standardRate"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Credit Limit ($) <sup class="text-red-500">*</sup></label>
                    <input
                      v-model="newCard.creditLimit"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Current Balance ($) <sup class="text-red-500">*</sup></label>
                    <input
                      v-model="newCard.currentBalance"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Minimum Payment ($) <sup class="text-red-500">*</sup></label>
                    <input
                      v-model="newCard.minimumPayment"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Autopay Date <sup class="text-red-500">*</sup></label>
                    <select
                      v-model="newCard.autopayDate"
                      required
                      class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500"
                    >
                      <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Promo Expiry Date</label>
                    <div 
                      class="relative mt-1"
                      @click="$refs.dateInput.showPicker()"
                    >
                      <input
                        ref="dateInput"
                        v-model="newCard.promoExpiryDate"
                        type="date"
                        @change="handleDateSelect"
                        class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    v-model="newCard.notes"
                    rows="3"
                    class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500"
                  ></textarea>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <BaseButton type="submit">
                    Add Card
                  </BaseButton>
                  <BaseButton
                    type="button"
                    @click="showAddModal = false"
                    class="mr-3"
                  >
                    Cancel
                  </BaseButton>
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
    :show="showConfirmDelete"
    title="Delete Card"
    message="Are you sure you want to delete this card? This action cannot be undone."
    @confirm="handleDelete"
    @cancel="showConfirmDelete = false"
  />
</template>
