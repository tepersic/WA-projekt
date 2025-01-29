<template>
  <div class="max-w-7xl mx-auto text-center px-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Lista Profesora</h2>
    <ul class="space-y-4 text-lg text-gray-600">
      <li v-for="(profesor, index) in profesori" :key="index" class="bg-white p-4 shadow-md rounded-lg">
        <router-link :to="`/profesor/${profesor._id}`" class="text-xl font-semibold text-blue-600 hover:underline">
          {{ profesor.profesor }}
        </router-link>
        <p class="text-gray-700 font-medium">Kolegij: {{ profesor.kolegij }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Profesori",
  data() {
    return {
      profesori: [],
    };
  },
  async created() {
    try {
      const response = await axios.get("http://localhost:3000/profesori");
      this.profesori = response.data;
    } catch (error) {
      console.error("Greška pri dohvaćanju profesora:", error);
    }
  },
};
</script>

<style scoped>
/* Custom styles can go here */
</style>