<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Prijava</h2>

      <!-- Poruka o grešci -->
      <div v-if="errorMessage" class="text-red-600 text-center mb-4">
        {{ errorMessage }}
      </div>

      <!-- Forma za prijavu -->
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Unesite svoj email"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-600">Lozinka</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Unesite svoju lozinku"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <span v-if="!loading">Prijavite se</span>
          <span v-else>Učitavanje...</span>
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Nemate račun? 
        <router-link to="/register" class="text-blue-600 hover:underline">Registrirajte se ovdje</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import API_BASE_URL from "../config.js";

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      errorMessage: null,
    };
  },
  created() {
    const user = localStorage.getItem("user");
    if (user) {
      this.$router.push("/profesori");
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = null;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/login`,
          { email: this.email, password: this.password },
          { withCredentials: true }
        );

        const userData = response.data;
        // Pohrana korisničkih podataka i admin statusa u localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("admin", userData.admin); // Pohrani admin status

       this.$router.push("/profesori").then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Greška prilikom prijave:", error.response?.data?.message || error.message);
        this.errorMessage = error.response?.data?.message || "Neispravni podaci, pokušajte ponovno.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
