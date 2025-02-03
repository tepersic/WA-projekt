<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>

      <!-- Login Forma -->
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Don't have an account? 
        <router-link to="/register" class="text-blue-600 hover:underline">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import API_BASE_URL from '../config.js';

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/login`, {
          email: this.email,
          password: this.password,
        });

        const userData = response.data;

        // Save user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect to Profesori.vue
        this.$router.push("/profesori").then(() => {
          window.location.reload(); // Refresh the page to update UI
        });
      } catch (error) {
        console.error("Login error:", error.response?.data?.message || error.message);
        alert("Invalid credentials, please try again.");
      }
    },
  },
};
</script>