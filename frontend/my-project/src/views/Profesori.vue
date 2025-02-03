<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-3xl font-bold text-gray-800">Popis nastavnika</h2>
    
    <ul class="mt-4">
      <li v-for="profesor in profesori" :key="profesor._id" class="border-b py-4">
        <router-link :to="'/profesori/' + profesor._id" class="text-blue-600 hover:underline">
          <h3 class="text-xl font-semibold">{{ profesor.profesor }}</h3>
        </router-link>
        <p class="text-gray-600">Organizacijska jedinica: {{ profesor.fakultet }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '../config.js';

export default {
  name: "Profesori",
  data() {
    return {
      profesori: []
    };
  },
  async created() {
    try {
      const response = await axios.get(`${API_BASE_URL}/profesori`);
      this.profesori = response.data;
    } catch (error) {
      console.error("Greška pri dohvaćanju profesora:", error);
    }
  }
};
</script>
