<template>
  <div class="min-h-screen flex flex-col bg-gray-100 text-gray-900">
    <!-- Toolbar -->
    <header class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 shadow-lg">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold uppercase tracking-wide">Rate your profesor</h1>
        
        <nav class="hidden md:flex space-x-6">
          <router-link to="/" active-class="font-bold underline" class="px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-700">
            Home
          </router-link>
          <router-link to="/profesori" active-class="font-bold underline" class="px-4 py-2 rounded-lg transition duration-300 hover:bg-purple-700">
            Professors
          </router-link>
          <router-link to="/login" active-class="font-bold underline" class="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700">
            Login
          </router-link>
          <router-link to="/register" active-class="font-bold underline" class="px-4 py-2 rounded-lg transition duration-300 hover:bg-teal-700">
            Register
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-grow p-8">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>&copy; 2025 My Modern Vue App</p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "App",
  data() {
    return {
      apiBaseUrl: "http://localhost:3000"
    };
  },
  methods: {
    async fetchData(endpoint) {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/${endpoint}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    }
  }
};
</script>