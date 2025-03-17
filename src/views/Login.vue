<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLogin = ref(true);
const error = ref('');

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
    }
    router.push('/');
  } catch (e) {
    error.value = e.message;
  }
};
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {{ isLogin ? 'Sign in to your account' : 'Create a new account' }}
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              v-model="email"
              id="email-address"
              name="email"
              type="email"
              required
              class="input-field rounded-t-md"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              required
              class="input-field rounded-b-md"
              placeholder="Password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button type="submit" class="group relative flex w-full justify-center btn-primary">
            {{ isLogin ? 'Sign in' : 'Sign up' }}
          </button>
        </div>

        <div class="text-sm text-center">
          <a
            href="#"
            class="font-medium text-blue-600 hover:text-blue-500"
            @click.prevent="isLogin = !isLogin"
          >
            {{ isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in' }}
          </a>
        </div>
      </form>
    </div>
  </div>
</template>
