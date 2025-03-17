<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../services/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const isSignUp = ref(false);

const handleSubmit = async () => {
  try {
    error.value = '';
    if (isSignUp.value) {
      await auth.createUser(email.value, password.value);
    } else {
      await auth.signIn(email.value, password.value);
    }
    router.push('/');
  } catch (e) {
    error.value = e.message;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-medium text-slate-900">
        {{ isSignUp ? 'Create an account' : 'Sign in to your account' }}
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700">Email address</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
            </div>
          </div>

          <div v-if="error" class="text-sm text-slate-700 bg-slate-50 p-3 rounded">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              {{ isSignUp ? 'Sign up' : 'Sign in' }}
            </button>
          </div>

          <div class="text-center">
            <button
              type="button"
              class="text-sm text-slate-600 hover:text-slate-900"
              @click="isSignUp = !isSignUp"
            >
              {{ isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
