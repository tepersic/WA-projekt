import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Profesori from './views/Profesori.vue';
import Profesor from './views/Profesor.vue'; // Dodajemo novu komponentu
import Login from './views/Login.vue';
import Register from './views/Register.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/profesori', component: Profesori },
  { path: '/profesori/:id', component: Profesor, props: true }, // Ruta za prikaz profesora
  { path: '/login', component: Login },
  { path: '/register', component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;