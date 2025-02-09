<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Popis nastavnika</h2>

    <!-- Search Bar -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Pretraži po imenu ili fakultetu..."
      />
    </div>

    <!-- Professors Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="profesor in filtriraniProfesori"
        :key="profesor._id"
        class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow"
      >
        <router-link :to="'/profesori/' + profesor._id" class="block">
          <!-- Profile Image -->
          <div class="flex items-center space-x-4">
            <img
              v-if="profesor.slika"
              :src="profesor.slika"
              alt="Profesor"
              class="w-16 h-16 rounded-full object-cover border"
            />
            <div
              v-else
              class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg"
            >
              {{ profesor.profesor.charAt(0) }}
            </div>

            <!-- Profesor Info -->
            <div>
              <h3
                class="text-lg font-semibold text-gray-800 hover:text-blue-600"
              >
                {{ profesor.profesor }}
              </h3>
              <p class="text-gray-600 text-sm">{{ profesor.fakultet }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import API_BASE_URL from "../config.js";

export default {
  name: "Profesori",
  data() {
    return {
      profesori: [],
      searchQuery: "", // Search query to filter professors
    };
  },
  computed: {
    // Filter professors based on the search query
    filtriraniProfesori() {
      if (!this.searchQuery) {
        return this.profesori;
      }
      const query = this.searchQuery.toLowerCase();
      return this.profesori.filter((profesor) => {
        return (
          profesor.profesor.toLowerCase().includes(query) ||
          profesor.fakultet.toLowerCase().includes(query)
        );
      });
    },
  },
  async created() {
    try {
      const response = await axios.get(`${API_BASE_URL}/profesori/`);
      this.profesori = response.data;
    } catch (error) {
      console.error("Greška pri dohvaćanju profesora:", error);
    }
  },
};
</script>

<style>
/* Optional styling for better UX */
</style>
