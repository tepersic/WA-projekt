<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Back button -->
    <button @click="$router.go(-1)" class="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 mb-4 transition-colors">
      ← Natrag
    </button>

    <div class="flex flex-col md:flex-row gap-12">
      <!-- Left Side: Professor Info -->
      <div class="md:w-1/2 h-fit md:sticky top-6 self-start order-1 md:order-1 mb-8 md:mb-0 space-y-8">
        <!-- Professor Info Card -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-4xl font-bold text-gray-900">{{ profesor.profesor }}</h2>
          <img v-if="profesor.slika" :src="profesor.slika" alt="Profesor" class="w-48 h-48 rounded-full my-6 mx-auto shadow-lg transition-transform transform hover:scale-105">
          <div class="space-y-2">
            <p class="text-gray-700 text-lg">
              Organizacijska jedinica:
              <span class="font-semibold text-gray-800">{{ profesor.fakultet }}</span>
            </p>
            <p class="text-gray-800 font-semibold text-lg">
              Zvanje:
              <span class="text-gray-900">{{ profesor.zvanje }}</span>
            </p>
          </div>

          <!-- Rating -->
          <div class="flex items-center mt-6">
            <p class="text-gray-800 font-semibold text-xl">{{ izracunajProsjek() }}/10</p>
            <span class="ml-3 text-yellow-500 text-2xl">
              <span v-for="index in 10" :key="index">
                {{ index <= Math.round(izracunajProsjek()) ? '⭐' : '☆' }}
              </span>
            </span>
          </div>
        </div>

        <!-- Courses Sections -->
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-semibold">Prijediplomski kolegiji:</h3>
            <ul class="list-disc pl-5 text-gray-700">
              <li v-for="(kolegij, index) in profesor.prijediplomski_kolegij" :key="index">
                {{ kolegij }}
              </li>
            </ul>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-semibold">Diplomski kolegiji:</h3>
            <ul class="list-disc pl-5 text-gray-700">
              <li v-for="(kolegij, index) in profesor.diplomski_kolegij" :key="index">
                {{ kolegij }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right Side: Comment Form + Comments -->
      <div class="md:w-1/2 order-2 md:order-2">
        <!-- Comment Form -->
        <div class="mb-8 p-6 border rounded-lg bg-gray-100 shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800">Dodaj komentar i ocjenu</h3>

          <div v-if="isLoggedIn">
            <div class="flex items-center gap-4 mb-4">
              <input
                v-model="novaOcjena"
                type="number"
                min="1"
                max="10"
                class="border p-3 w-24 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ocjena"
              >
              <textarea
                v-model="noviKomentar"
                maxlength="400"
                class="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Unesi komentar"
              ></textarea>
            </div>
            <!-- Character count -->
            <p class="text-gray-500 text-sm">{{ noviKomentar.length }}/400</p>
            <button
              @click="posaljiKomentar"
              class="bg-blue-600 text-white px-6 py-3 mt-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors w-full"
            >
              Pošalji
            </button>
          </div>
          <p v-else class="text-red-600 font-semibold mt-4">
            Morate biti prijavljeni da biste ostavili komentar.
          </p>
        </div>

        <!-- Comments List -->
        <div>
          <h3 class="text-xl font-semibold text-gray-800">Komentari</h3>
          <ul>
            <li
              v-for="(komentar, index) in profesor.komentari"
              :key="index"
              class="py-6 px-6 mb-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            >
              <!-- Comment Card -->
              <div class="space-y-4">
                <!-- User's Name + Delete Button -->
                <div class="flex justify-between items-center">
                  <p class="text-blue-600 font-semibold text-lg">{{ komentar.userName }}</p>
                  <!-- Only show delete button for admins -->
                  <button
                    v-if="isAdmin"
                    @click="deleteComment(komentar._id)"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Delete
                  </button>
                </div>

                <!-- Rating -->
                <div class="flex items-center gap-2 text-gray-500">
                  <span>{{ komentar.ocjena }}/10</span>
                  <span class="text-yellow-500 text-xl">
                    <span v-for="index in 10" :key="index">
                      {{ index <= Math.round(komentar.ocjena) ? '⭐' : '☆' }}
                    </span>
                  </span>
                </div>

                <!-- Comment Text -->
                <div class="text-gray-700 break-words">
                  {{ komentar.tekst }}
                </div>
              </div>
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
      isAdmin: false,    // Boolean admin flag returned from API
      userId: null,      // Logged-in user ID
      token: null,       // Save token for subsequent requests
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
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      this.token = user.token;

      const userResponse = await axios.get(`${API_BASE_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${this.token}` },
        withCredentials: true,
      });

      if (userResponse.data) {
        this.isLoggedIn = true;
        this.isAdmin = userResponse.data.admin; // Use the boolean value returned by the API for admin status
        this.userId = userResponse.data.id;
      }
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
      if (!this.token) {
        console.log("No token found in localStorage");
        alert("Morate biti prijavljeni da biste ostavili komentar.");
        return;
      }
      try {
        await axios.post(
          `${API_BASE_URL}/profesori/${this.$route.params.id}/komentari`,
          {
            ocjena: parseFloat(this.novaOcjena),
            tekst: this.noviKomentar,
          },
          {
            headers: { Authorization: `Bearer ${this.token}` },
            withCredentials: true,
          }
        );

        // Refresh the professor data (and comments list)
        const response = await axios.get(
          `${API_BASE_URL}/profesori/${this.$route.params.id}`
        );
        this.profesor = response.data;

        // Reset input fields
        this.novaOcjena = "";
        this.noviKomentar = "";
      } catch (error) {
        console.error("Greška pri slanju komentara:", error);
        alert("Došlo je do pogreške pri slanju komentara.");
      }
    },

    async deleteComment(commentId) {
  const confirmed = confirm("Are you sure you want to delete this comment?");
  if (confirmed) {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/${this.$route.params.id}/komentari/${commentId}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
          withCredentials: true,
        }
      );
      // Refresh the comments list after deletion
      const response = await axios.get(
        `${API_BASE_URL}/profesori/${this.$route.params.id}`
      );
      this.profesor = response.data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Došlo je do pogreške pri brisanju komentara.");
    }
  }
},
  },
};
</script>