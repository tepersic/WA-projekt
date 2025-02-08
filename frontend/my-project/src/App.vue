<template>
  <div class="flex flex-col min-h-screen">
    <!-- Toolbar -->
    <header class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 shadow-lg">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-3">
          <img src="/LOGO2.png" alt="Rate Your Professor Logo" class="h-10 w-10">
          <h1 class="text-2xl font-bold uppercase tracking-wide">Rate Your Professor</h1>
        </div>

        <!-- Hamburger Menu for Mobile -->
        <button
          class="md:hidden text-white text-2xl focus:outline-none"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          ☰
        </button>

        <!-- Navigation Links -->
        <nav
          :class="{
            'hidden md:flex space-x-6': !isMobileMenuOpen,
            'absolute bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 top-16 left-0 w-full shadow-lg': isMobileMenuOpen,
          }"
          class="transition-all duration-300"
        >
          <!-- Links for Large Screens -->
          <router-link
            to="/"
            active-class="font-bold underline"
            class="px-4 py-2 rounded-lg transition duration-300 bg-blue-700/75 hover:bg-blue-800 border border-white"
            @click="closeMenuOnMobile"
          >
            Home
          </router-link>
          <router-link
            to="/profesori"
            active-class="font-bold underline"
            class="px-4 py-2 rounded-lg transition duration-300 bg-purple-700/75 hover:bg-purple-800 border border-white"
            @click="closeMenuOnMobile"
          >
            Nastavnici
          </router-link>

          <!-- Admin Link -->
          <template v-if="user && user.admin">
            <router-link
              to="/admin"
              active-class="font-bold underline"
              class="px-4 py-2 rounded-lg transition duration-300 bg-red-700/75 hover:bg-red-800 border border-white"
              @click="closeMenuOnMobile"
            >
              Admin
            </router-link>
          </template>

          <!-- Login/Register for Non-Logged-In Users -->
          <template v-if="!user">
            <router-link
              to="/login"
              active-class="font-bold underline"
              class="px-4 py-2 rounded-lg transition duration-300 bg-pink-700/75 hover:bg-pink-800 border border-white"
              @click="closeMenuOnMobile"
            >
              Prijava
            </router-link>
            <router-link
              to="/register"
              active-class="font-bold underline"
              class="px-4 py-2 rounded-lg transition duration-300 bg-teal-700/75 hover:bg-teal-800 border border-white"
              @click="closeMenuOnMobile"
            >
              Registracija
            </router-link>
          </template>

          <!-- User Info for Logged-In Users -->
          <template v-else>
            <span
              class="px-4 py-2 rounded-lg bg-green-700/75 text-white font-bold border border-white"
              @click="closeMenuOnMobile"
            >
              {{ user.name }}
            </span>
            <button
              @click="logout"
              class="px-4 py-2 bg-red-600 rounded-lg text-white font-bold transition duration-300 hover:bg-red-700 border border-white"
            >
              Odjavi se
            </button>
          </template>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>&copy; 2025 Rate Your Professor App</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      user: null, // Store user data
      isMobileMenuOpen: false, // Toggle mobile menu
    };
  },
  mounted() {
    this.checkUser();
  },
  methods: {
    checkUser() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);

        this.user = {
          name: user.name,
          email: user.email,
          admin: user.admin, // Directly use the admin field sent from the backend
        };
      }
    },
    logout() {
  localStorage.removeItem("user"); // Remove entire user object from storage
  localStorage.removeItem("admin"); // Remove admin-specific key from localStorage (if it exists)
  this.user = null; // Reset user state
  this.$router.push("/"); // Redirect to home
},
    closeMenuOnMobile() {
      this.isMobileMenuOpen = false; // Close menu after navigation
    },
  },
};
</script>

<style scoped>
/* Styling adjustments for better button visibility */
nav.absolute {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

nav a,
nav button,
nav span {
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

nav a:hover,
nav button:hover,
nav span:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

nav a,
nav button,
nav span {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
</style>