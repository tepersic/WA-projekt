<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-3xl font-bold text-gray-800">{{ profesor.profesor }}</h2>
    <img v-if="profesor.slika" :src="profesor.slika" alt="Profesor" class="w-48 h-48 rounded-full my-4">
    <p class="text-gray-600">Fakultet: {{ profesor.fakultet }}</p>
    <p class="text-gray-700 font-semibold">Zvanje: {{ profesor.zvanje }}</p>
    <p class="text-gray-700 font-semibold">
      Ocjena: {{ izracunajProsjek() }} / 10
    </p>
    
    <h3 class="text-lg font-semibold mt-4">Prijediplomski kolegiji:</h3>
    <ul>
      <li v-for="(kolegij, index) in profesor.prijediplomski_kolegij" :key="index">{{ kolegij }}</li>
    </ul>
    
    <h3 class="text-lg font-semibold mt-4">Diplomski kolegiji:</h3>
    <ul>
      <li v-for="(kolegij, index) in profesor.diplomski_kolegij" :key="index">{{ kolegij }}</li>
    </ul>

    <!-- Forma za ocjenjivanje i komentare -->
    <div class="mt-6">
      <h3 class="text-lg font-semibold">Dodaj komentar i ocjenu</h3>
      <input v-model="novaOcjena" type="number" min="1" max="10" class="border p-2 w-20" placeholder="Ocjena">
      <textarea v-model="noviKomentar" class="border p-2 w-full mt-2" placeholder="Unesi komentar"></textarea>
      <button @click="posaljiKomentar" class="bg-blue-600 text-white px-4 py-2 mt-2 rounded">Pošalji</button>
    </div>

    <!-- Lista komentara -->
    <div class="mt-6">
      <h3 class="text-lg font-semibold">Komentari</h3>
      <ul>
        <li v-for="(komentar, index) in profesor.komentari" :key="index" class="border-b py-2">
          <p><strong>Ocjena:</strong> {{ komentar.ocjena }}/10</p>
          <p>{{ komentar.tekst }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '../config.js';

export default {
  name: "Profesor",
  data() {
    return {
      profesor: {
        komentari: []
      },
      novaOcjena: "",
      noviKomentar: ""
    };
  },
  async created() {
    try {
      const response = await axios.get(`${API_BASE_URL}/profesori/${this.$route.params.id}`);
      this.profesor = response.data;
    } catch (error) {
      console.error("Greška pri dohvaćanju profesora:", error);
    }
  },
  methods: {
    izracunajProsjek() {
      if (!this.profesor.komentari || this.profesor.komentari.length === 0) {
        return "N/A";
      }
      const suma = this.profesor.komentari.reduce((acc, komentar) => acc + parseFloat(komentar.ocjena), 0);
      return (suma / this.profesor.komentari.length).toFixed(1);
    },
    async posaljiKomentar() {
      if (!this.novaOcjena || !this.noviKomentar) {
        alert("Unesite ocjenu i komentar!");
        return;
      }

      try {
        await axios.post(`${API_BASE_URL}/profesori/${this.$route.params.id}/komentari`, {
          ocjena: parseFloat(this.novaOcjena),
          tekst: this.noviKomentar
        });

        const response = await axios.get(`${API_BASE_URL}/profesori/${this.$route.params.id}`);
        this.profesor = response.data;

        this.novaOcjena = "";
        this.noviKomentar = "";
      } catch (error) {
        console.error("Greška pri slanju komentara:", error);
      }
    }
  }
};
</script>
