<template>
  <!-- Toolbar -->
  <header class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 shadow-lg">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <img src="/LOGO2.png" alt="Rate Your Professor Logo" class="h-10 w-10">
        <h1 class="text-2xl font-bold uppercase tracking-wide">Rate your professor</h1>
      </div>

      <nav class="hidden md:flex space-x-6">
        <router-link to="/" active-class="font-bold underline" class="px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-700">Home</router-link>
        <router-link to="/profesori" active-class="font-bold underline" class="px-4 py-2 rounded-lg transition duration-300 hover:bg-purple-700">Nastavnici</router-link>

        <!-- Show Admin Link if Admin Role -->
        <template v-if="user && user.admin">
          <router-link to="/admin" active-class="font-bold underline" class="px-4 py-2 rounded-lg transition duration-300 hover:bg-red-700">Admin</router-link>
        </template>

        <!-- Show Login/Register if NOT logged in -->
        <template v-if="!user">
          <router-link to="/login" active-class="font-bold underline" class="px-4 py-2 rounded-lg transition duration-300 hover:bg-pink-700">Login</router-link>
          <router-link to="/register" active-class="font-bold underline" class="px-4 py-2 rounded-lg transition duration-300 hover:bg-teal-700">Register</router-link>
        </template>

        <!-- Show Username & Logout if logged in -->
        <template v-else>
          <span class="px-4 py-2 rounded-lg bg-green-600 text-white font-bold">{{ user.name }}</span>
          <button @click="logout" class="px-4 py-2 bg-red-600 rounded-lg text-white font-bold transition duration-300 hover:bg-red-700">Sign Out</button>
        </template>
      </nav>
    </div>
  </header>

  <!-- Main content -->
  <main class="flex-1">
    <router-view></router-view>
  </main>

  <!-- Footer -->
  <footer class="bg-gray-800 text-white p-4 text-center mt-auto">
    <p>&copy; 2025 Rate your Profesor app</p>
  </footer>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      user: null, // Store user data
    };
  },
  mounted() {
    this.checkUser();
  },
  methods: {
    checkUser() {
      // Check if user is in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);

        // Only log admin info in the console if the user is an admin
        if (user.admin) {
          console.log('Admin Info:', user); // Log the user data only if admin
        }

        // Assign user data to the component
        this.user = {
          name: user.name,
          email: user.email,
          admin: user.admin,  // Directly use the admin field sent from backend
        };
      }
    },
    logout() {
      localStorage.removeItem("user"); // Remove user from storage
      this.user = null; // Reset user state
      this.$router.push("/"); // Redirect to home
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>