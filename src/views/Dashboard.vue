<script setup>
import { ref } from 'vue';
import { useCreditCardStore } from '../stores/creditCards';
import { PlusIcon } from '@heroicons/vue/24/solid';
import AddCardModal from '../components/AddCardModal.vue';
import CardList from '../components/CardList.vue';

const creditCardStore = useCreditCardStore();
const showAddModal = ref(false);

const closeModal = () => {
  showAddModal.value = false;
};
</script>

<template>
  <div>
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          My Credit Cards
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          class="btn-primary inline-flex items-center"
          @click="showAddModal = true"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Add Card
        </button>
      </div>
    </div>

    <CardList />

    <AddCardModal
      v-if="showAddModal"
      @close="closeModal"
    />
  </div>
</template>
