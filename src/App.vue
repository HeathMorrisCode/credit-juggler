<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { auth } from './services/auth';
import { useCreditCardStore } from './stores/creditCards';
import { useRouter } from 'vue-router';

const router = useRouter();
const creditCardStore = useCreditCardStore();

const handleSignOut = async () => {
  await auth.signOut();
  router.push('/login');
};

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      creditCardStore.fetchCards();
    }
  });
});
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <nav class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-medium text-slate-700">Credit Juggler</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span v-if="auth.isAuthenticated" class="text-sm text-slate-600">{{ auth.currentUser?.email }}</span>
            <button 
              v-if="auth.isAuthenticated" 
              @click="handleSignOut"
              class="text-sm font-medium text-rose-600 hover:text-rose-700"
            >
              Sign Out
            </button>
            <button v-else class="text-sm font-medium text-slate-600 hover:text-slate-900">
              Sign In
            </button>
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
