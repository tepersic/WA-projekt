<template>
  <div class="min-h-screen bg-gradient-to-r from-green-500 via-teal-600 to-blue-500 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Register</h2>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="name" class="block text-gray-600">Nickname</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your nickname"
            required
            maxlength="20"
          />
          <div v-if="nicknameError" class="text-red-600 text-sm mt-2">
            {{ nicknameError }}
          </div>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Create a password"
            required
          />
        </div>
        <div class="mb-6">
          <label for="confirmPassword" class="block text-gray-600">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition duration-300"
          :disabled="loading"
        >
          Register
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account? 
        <router-link to="/login" class="text-teal-600 hover:underline">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '../config.js';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
      nicknameError: null,
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      if (this.password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }

      try {
        this.loading = true;

        // Call the backend API to register the user
        const response = await axios.post(`${API_BASE_URL}/api/korisnici`, {
          name: this.name,
          email: this.email,
          password: this.password, // Plain text, backend will hash it
        });

        alert(response.data.message);
        this.$router.push('/login');
      } catch (error) {
        console.error('Error during registration:', error);
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.message;
          if (errorMessage === "Nickname already taken. Please choose another one.") {
            this.nicknameError = 'This nickname is already taken. Please choose another one.';
          } else if (errorMessage === "User already exists") {
            alert('A user with this email already exists.');
          } else {
            alert('Registration failed: ' + errorMessage);
          }
        } else {
          alert('Registration failed due to a server error.');
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>