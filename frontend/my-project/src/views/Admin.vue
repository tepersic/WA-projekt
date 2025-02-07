<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-3xl font-bold mb-6 text-gray-900">Manage Users</h2>
    <!-- Users List -->
    <div v-if="users.length > 0" class="space-y-6">
      <div v-for="user in users" :key="user._id" class="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
        <div class="space-x-4">
          <p class="text-gray-900 font-semibold">{{ user.name }}</p>
          <p class="text-gray-600">{{ user.email }}</p>
          <p class="text-gray-500">{{ user.role }}</p>
        </div>
        <div class="space-x-4">
          <!-- Promote button -->
          <button
            
            @click="promoteUser(user._id)"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            Promote
          </button>
          <!-- Demote button -->
          <button
            
            @click="demoteUser(user._id)"
            class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-300"
          >
            Demote
          </button>
          <!-- Delete button -->
          <button
            @click="deleteUser(user._id)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <!-- No Users Message -->
    <div v-else>
      <p class="text-gray-600">No users available to manage.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import API_BASE_URL from "../config.js";

export default {
  data() {
    return {
      users: [],
    };
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        if (!token) {
          alert("You are not authorized to view this page.");
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/korisnici`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users.");
      }
    },
    async promoteUser(userId) {
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const response = await axios.post(
          `${API_BASE_URL}/api/korisnici/${userId}/promote`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        alert("User promoted successfully.");
        await this.fetchUsers();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("User already promoted, updating UI.");
          await this.fetchUsers();
          alert("User has been promoted.");
        } else {
          console.error("Error promoting user:", error);
          alert("Failed to promote user.");
        }
      }
    },
    async demoteUser(userId) {
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const response = await axios.post(
          `${API_BASE_URL}/api/korisnici/${userId}/demote`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        alert("User demoted successfully.");
        await this.fetchUsers();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("User already demoted, updating UI.");
          await this.fetchUsers();
          alert("User has been demoted.");
        } else {
          console.error("Error demote user:", error);
          alert("Failed to demote user.");
        }
      }
    },
    async deleteUser(id) {
      try {
        console.log("Deleting user with id:", id);
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        if (!token) {
          alert("You are not authorized to perform this action.");
          return;
        }
        const response = await axios.delete(`${API_BASE_URL}/api/korisnici/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log("Delete response:", response);
        alert(response.data.message);
        await this.fetchUsers();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("User already deleted, updating UI.");
          await this.fetchUsers();
          alert("User has been deleted.");
        } else {
          console.error("Error deleting user:", error);
          alert("Failed to delete user.");
        }
      }
    },
  },
};
</script>