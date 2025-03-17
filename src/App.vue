<script setup>
import { RouterView } from 'vue-router';
import { useAuth } from '@vueuse/firebase';
import { onMounted } from 'vue';
import { useCreditCardStore } from './stores/creditCards';

const { isAuthenticated, user } = useAuth();
const creditCardStore = useCreditCardStore();

onMounted(async () => {
  if (isAuthenticated.value) {
    await creditCardStore.fetchCards();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Credit Juggler</h1>
            </div>
          </div>
          <div class="flex items-center">
            <button v-if="!isAuthenticated" class="btn-primary">
              Sign In
            </button>
            <span v-else class="text-sm text-gray-700">{{ user?.email }}</span>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Add styles here if needed */
</style>
