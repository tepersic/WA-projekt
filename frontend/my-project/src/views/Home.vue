<template>
  <div class="max-w-6xl mx-auto p-6 space-y-12">
    <!-- Uvod -->
    <section class="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 p-8 rounded-xl shadow-lg">
      <h1 class="text-4xl font-extrabold text-blue-700 mb-4">Dobrodošli na <span class="text-blue-900">Rate Your Professor</span>!</h1>
      <p class="text-lg text-gray-800 leading-relaxed">
        Ocijeni Profesora je platforma gdje studenti mogu podijeliti svoja iskustva, ocijeniti profesore 
        i pomoći drugima da donesu informirane odluke o svom obrazovanju. Bez obzira tražite li informacije 
        o kolegiju ili želite ostaviti povratnu informaciju za svog omiljenog profesora, na pravom ste mjestu.
      </p>
    </section>

    <!-- Kako koristiti aplikaciju -->
    <section class="bg-white p-8 rounded-xl shadow-lg border-l-4 border-blue-500">
      <h2 class="text-3xl font-semibold text-gray-800 mb-6">Kako koristiti aplikaciju</h2>
      <ul class="list-disc pl-8 space-y-3 text-gray-700 text-lg">
        <li>Pretražite profesora prema imenu ili organizacijskoj jedinici.</li>
        <li>Pregledajte njihov profil kako biste vidjeli ocjene i komentare drugih studenata.</li>
        <li>Prijavite se kako biste ostavili svoju ocjenu i komentar.</li>
        <li>Pomozite drugima dijeleći svoje iskreno i poštovanje povratne informacije.</li>
      </ul>
    </section>

    <!-- Pravila komentiranja -->
    <section class="bg-red-50 p-8 rounded-xl shadow-lg border-l-4 border-red-500">
      <h2 class="text-3xl font-semibold text-red-600 mb-6">Pravila komentiranja</h2>
      <p class="text-lg text-gray-800 mb-4">
        Kako bismo osigurali poštovanje i konstruktivno okruženje, molimo da slijedite ova pravila prilikom ostavljanja komentara:
      </p>
      <ul class="list-disc pl-8 space-y-3 text-gray-700 text-lg">
        <li>Bez uvredljivog jezika, govora mržnje ili osobnih napada.</li>
        <li>Ostanite na temi i pružite konstruktivnu povratnu informaciju.</li>
        <li>Nemojte dijeliti osobne podatke drugih osoba.</li>
        <li>Budite iskreni, ali poštujte druge u svojim recenzijama.</li>
      </ul>
      <p class="text-sm text-gray-600 mt-4">
        Komentari koji krše ova pravila mogu biti uklonjeni, a ponovljena kršenja mogu rezultirati suspenzijom računa.
      </p>
    </section>

    <!-- Poziv na akciju -->
    <section class="flex flex-col md:flex-row gap-6">
      <button
        @click="$router.push('/profesori')"
        class="flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl shadow-md text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 w-full md:w-auto">
        Pretraži nastavnike
      </button>
      <button
        @click="$router.push('/login')"
        class="flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-xl shadow-md text-lg font-semibold hover:bg-green-700 transition duration-300 transform hover:scale-105 w-full md:w-auto">
        Prijava / Registracija
      </button>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style>
/* Dodajte prilagođene stilove ako je potrebno */
</style>