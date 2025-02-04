<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Back button -->
    <button @click="$router.go(-1)" class="bg-gray-500 text-white px-4 py-2 rounded mb-4">
      ← Natrag
    </button>

    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left Side: Professor Info -->
      <div class="md:w-1/2 h-fit sticky top-6 self-start">
        <h2 class="text-3xl font-bold text-gray-800">{{ profesor.profesor }}</h2>
        <img v-if="profesor.slika" :src="profesor.slika" alt="Profesor" class="w-48 h-48 rounded-full my-4">
        <p class="text-gray-600">Organizacijska jedinica: {{ profesor.fakultet }}</p>
        <p class="text-gray-700 font-semibold">Zvanje: {{ profesor.zvanje }}</p>

        <!-- Rating -->
        <div class="flex items-center mt-2">
          <p class="text-gray-700 font-semibold text-lg">{{ izracunajProsjek() }}/10</p>
          <span class="ml-2 text-yellow-500 text-xl">
            <span v-for="index in 10" :key="index">
              {{ index <= Math.round(izracunajProsjek()) ? '⭐' : '☆' }}
            </span>
          </span>
        </div>

        <h3 class="text-lg font-semibold mt-4">Prijediplomski kolegiji:</h3>
        <ul>
          <li v-for="(kolegij, index) in profesor.prijediplomski_kolegij" :key="index">{{ kolegij }}</li>
        </ul>

        <h3 class="text-lg font-semibold mt-4">Diplomski kolegiji:</h3>
        <ul>
          <li v-for="(kolegij, index) in profesor.diplomski_kolegij" :key="index">{{ kolegij }}</li>
        </ul>
      </div>

      <!-- Right Side: Comment Form + Comments -->
      <div class="md:w-1/2">
        <!-- Comment Form -->
        <div class="mb-6 p-4 border rounded-lg bg-gray-100">
          <h3 class="text-lg font-semibold">Dodaj komentar i ocjenu</h3>

          <div v-if="isLoggedIn">
            <input v-model="novaOcjena" type="number" min="1" max="10" class="border p-2 w-20 rounded" placeholder="Ocjena">
            <textarea v-model="noviKomentar" class="border p-2 w-full mt-2 rounded" placeholder="Unesi komentar"></textarea>
            <button @click="posaljiKomentar" class="bg-blue-600 text-white px-4 py-2 mt-2 rounded w-full">Pošalji</button>
          </div>
          <p v-else class="text-red-600 font-semibold">Morate biti prijavljeni da biste ostavili komentar.</p>
        </div>

      <!-- Comments List -->
<div>
  <h3 class="text-lg font-semibold">Komentari</h3>
  <ul>
    <li v-for="(komentar, index) in profesor.komentari" :key="index" class="border-b py-4 flex items-start gap-4">
      <!-- Comment Header -->
      <div class="flex items-center gap-3">
        <p class="text-blue-600 font-semibold">{{ komentar.userName }}</p> <!-- User's name -->
        <span class="text-gray-500">{{ komentar.ocjena }}/10</span> <!-- Rating -->
      </div>
      
      <!-- Comment Text -->
      <p class="mt-2 text-gray-700">{{ komentar.tekst }}</p>
    </li>
  </ul>
</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import API_BASE_URL from "../config.js";

export default {
  name: "Profesor",
  data() {
    return {
      profesor: {
        komentari: [],
      },
      novaOcjena: "",
      noviKomentar: "",
      isLoggedIn: false, // Check if user is logged in
      userId: null, // Logged-in user ID
    };
  },
  async created() {
    try {
      // Fetch professor data
      const response = await axios.get(
        `${API_BASE_URL}/profesori/${this.$route.params.id}`
      );
      this.profesor = response.data;

      // Check if the user is logged in by retrieving the token from localStorage
      const user = JSON.parse(localStorage.getItem("user"));  // Get the user object

      if (user && user.token) {
        const token = user.token;  // Get the token from the user object
        console.log("Token found:", token);  // Debugging line

        const userResponse = await axios.get(`${API_BASE_URL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (userResponse.data) {
          console.log("User data:", userResponse.data);  // Debugging line
          this.isLoggedIn = true;
          this.userId = userResponse.data.id;
        } else {
          console.log("User not found with this token.");  // Debugging line
        }
      } else {
        console.log("No token found in user object.");  // Debugging line
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju podataka:", error);
      if (error.response) {
        console.error("Error Response:", error.response);
        console.error("Error Status:", error.response.status);
        console.error("Error Data:", error.response.data);
      }
    }
  },
  methods: {
    izracunajProsjek() {
      if (!this.profesor.komentari || this.profesor.komentari.length === 0) {
        return "N/A";
      }
      const suma = this.profesor.komentari.reduce(
        (acc, komentar) => acc + parseFloat(komentar.ocjena),
        0
      );
      return (suma / this.profesor.komentari.length).toFixed(1);
    },
    
    async posaljiKomentar() {
      if (!this.novaOcjena || !this.noviKomentar) {
        alert("Unesite ocjenu i komentar!");
        return;
      }

      // Ensure user is logged in and the token is available
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user ? user.token : null;

      if (!token) {
        console.log("No token found in localStorage");
        alert("Morate biti prijavljeni da biste ostavili komentar.");
        return;
      }

      try {
        // Send the comment with the token in the Authorization header
        await axios.post(
          `${API_BASE_URL}/profesori/${this.$route.params.id}/komentari`,
          {
            ocjena: parseFloat(this.novaOcjena),
            tekst: this.noviKomentar,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true, // Ensure credentials are sent
          }
        );

        // Optionally update only comments
        const response = await axios.get(
          `${API_BASE_URL}/profesori/${this.$route.params.id}`
        );
        this.profesor = response.data;

        // Reset the input fields
        this.novaOcjena = "";
        this.noviKomentar = "";
      } catch (error) {
        console.error("Greška pri slanju komentara:", error);
        alert("Došlo je do pogreške pri slanju komentara.");
      }
    },
  },
};
</script>