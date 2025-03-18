<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../services/auth';
import BaseButton from '../components/BaseButton.vue';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  try {
    await auth.signIn(email.value, password.value);
    router.push('/');
  } catch (e) {
    error.value = e.message;
  }
};
</script>

<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-medium text-gray-900">
          Sign in to Credit Juggler
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-black focus:border-gray-500"
            />
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <BaseButton type="submit" class="w-full justify-center">
            Sign in
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>
