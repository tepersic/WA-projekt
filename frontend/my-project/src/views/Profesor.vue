<template>
    <div class="max-w-4xl mx-auto p-6">
      <h2 class="text-3xl font-bold text-gray-800">{{ profesor.profesor }}</h2>
      <img v-if="profesor.slika" :src="profesor.slika" alt="Profesor" class="w-48 h-48 rounded-full my-4">
      <p class="text-gray-600">Kolegij: {{ profesor.kolegij }}</p>
      <p class="text-gray-700 font-semibold">Ocjena: {{ prosjecnaOcjena ? prosjecnaOcjena.toFixed(1) : 'N/A' }} / 10</p>
  
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
          <li v-for="(komentar, index) in komentari" :key="index" class="border-b py-2">
            <p><strong>Ocjena:</strong> {{ komentar.ocjena }}/10</p>
            <p>{{ komentar.tekst }}</p>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "Profesor",
    data() {
      return {
        profesor: {},
        komentari: [],
        novaOcjena: "",
        noviKomentar: ""
      };
    },
    computed: {
      prosjecnaOcjena() {
        if (this.komentari.length === 0) return null;
        const suma = this.komentari.reduce((acc, k) => acc + k.ocjena, 0);
        return suma / this.komentari.length;
      }
    },
    async created() {
      try {
        const profesorResponse = await axios.get(`http://localhost:3000/profesori/${this.$route.params.id}`);
        this.profesor = profesorResponse.data;
  
        const komentariResponse = await axios.get(`http://localhost:3000/komentari?profesorId=${this.$route.params.id}`);
        this.komentari = komentariResponse.data;
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
      }
    },
    methods: {
      async posaljiKomentar() {
        if (!this.novaOcjena || !this.noviKomentar) {
          alert("Unesite ocjenu i komentar!");
          return;
        }
  
        try {
          const response = await axios.post(`http://localhost:3000/komentari`, {
            profesorId: this.$route.params.id,
            ocjena: parseInt(this.novaOcjena),
            tekst: this.noviKomentar
          });
  
          this.komentari.push(response.data);
          this.novaOcjena = "";
          this.noviKomentar = "";
        } catch (error) {
          console.error("Greška pri slanju komentara:", error);
        }
      }
    }
  };
  </script>