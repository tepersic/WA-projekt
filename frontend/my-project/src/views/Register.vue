<template>
  <div class="min-h-screen bg-gradient-to-r from-green-500 via-teal-600 to-blue-500 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Registracija</h2>

      <!-- Forma za registraciju -->
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="name" class="block text-gray-600">Nadimak</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Unesite svoj nadimak"
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
            placeholder="Unesite svoj email"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-600">Lozinka</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Kreirajte lozinku"
            required
          />
        </div>
        <div class="mb-6">
          <label for="confirmPassword" class="block text-gray-600">Potvrdite lozinku</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Potvrdite svoju lozinku"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition duration-300"
          :disabled="loading"
        >
          Registriraj se
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Već imate račun? 
        <router-link to="/login" class="text-teal-600 hover:underline">Prijavite se ovdje</router-link>
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
        alert('Lozinke se ne podudaraju');
        return;
      }

      if (this.password.length < 6) {
        alert('Lozinka mora imati najmanje 6 znakova');
        return;
      }

      try {
        this.loading = true;

        // Poziv backend API-ja za registraciju korisnika
        const response = await axios.post(`${API_BASE_URL}/api/registracija`, {
          name: this.name,
          email: this.email,
          password: this.password, // Plain text, backend će hashirati
        });

        alert(response.data.message);
        this.$router.push('/login');
      } catch (error) {
        console.error('Greška tijekom registracije:', error);
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.message;
          if (errorMessage === "Nickname already taken. Please choose another one.") {
            this.nicknameError = 'Ovaj nadimak je već zauzet. Molimo odaberite drugi.';
          } else if (errorMessage === "User already exists") {
            alert('Korisnik s ovim emailom već postoji.');
          } else {
            alert('Registracija nije uspjela: ' + errorMessage);
          }
        } else {
          alert('Registracija nije uspjela zbog pogreške na serveru.');
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>