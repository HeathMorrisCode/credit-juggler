<script setup>
import { computed } from 'vue';
import { useCreditCardStore } from '../stores/creditCards';
import { useRouter } from 'vue-router';
import { CreditCardIcon } from '@heroicons/vue/24/outline';

const creditCardStore = useCreditCardStore();
const router = useRouter();

const sortedCards = computed(() => {
  return [...creditCardStore.cards].sort((a, b) => {
    const aDate = new Date(a.promoExpiryDate);
    const bDate = new Date(b.promoExpiryDate);
    return aDate - bDate;
  });
});

const getDaysUntilExpiry = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = Math.abs(expiry - now);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getExpiryStatus = (expiryDate) => {
  const daysLeft = getDaysUntilExpiry(expiryDate);
  if (daysLeft <= 30) return 'bg-red-100 text-red-800';
  if (daysLeft <= 90) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="card in sortedCards"
      :key="card.id"
      class="card cursor-pointer hover:shadow-lg transition-shadow"
      @click="router.push(`/card/${card.id}`)"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-center">
          <CreditCardIcon class="h-8 w-8 text-gray-400" />
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ card.cardName }}
            </h3>
            <p class="text-sm text-gray-500">
              **** {{ card.lastFourDigits }}
            </p>
          </div>
        </div>
      </div>

      <dl class="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt class="text-sm font-medium text-gray-500">Balance</dt>
          <dd class="mt-1 text-lg font-semibold text-gray-900">
            ${{ card.balance.toLocaleString() }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Credit Limit</dt>
          <dd class="mt-1 text-lg font-semibold text-gray-900">
            ${{ card.creditLimit.toLocaleString() }}
          </dd>
        </div>
      </dl>

      <div class="mt-4">
        <span
          :class="[
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            getExpiryStatus(card.promoExpiryDate)
          ]"
        >
          {{ card.promoApr }}% APR expires in {{ getDaysUntilExpiry(card.promoExpiryDate) }} days
        </span>
      </div>
    </div>
  </div>
</template>
