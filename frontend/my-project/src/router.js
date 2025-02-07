import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Profesori from './views/Profesori.vue';
import Profesor from './views/Profesor.vue'; // Dodajemo novu komponentu
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Admin from './views/Admin.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/profesori', component: Profesori },
  { path: '/profesori/:id', component: Profesor, props: true }, // Ruta za prikaz profesora
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: "/admin",
    component: Admin,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      // Check for 'admin' role instead of 'role'
      if (user && user.admin) {  // We check for 'admin' here
        next(); // Allow access if user is an admin
      } else {
        next("/"); // Redirect to home if not an admin
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;