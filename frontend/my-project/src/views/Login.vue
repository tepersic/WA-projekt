<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>

      <!-- Error Message -->
      <div v-if="errorMessage" class="text-red-600 text-center mb-4">
        {{ errorMessage }}
      </div>

      <!-- Login Form -->
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
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <span v-if="!loading">Login</span>
          <span v-else>Loading...</span>
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
        // Store user data and admin status in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("admin", userData.admin);  // Store the admin status

        this.$router.push("/profesori").then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Login error:", error.response?.data?.message || error.message);
        this.errorMessage = error.response?.data?.message || "Invalid credentials, please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>