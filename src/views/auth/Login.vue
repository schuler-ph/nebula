<template>
  <v-card
    v-if="!auth_loading"
    class="pa-6"
    title="Login to your Nebula account"
  >
    <v-form v-model="valid">
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="Email"
        prepend-inner-icon="mdi-email"
        required
        color="indigo"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        prepend-inner-icon="mdi-form-textbox-password"
        required
        :type="showPassword ? '' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        color="indigo"
      ></v-text-field>
    </v-form>

    <v-card-actions>
      <v-btn class="bg-indigo" color="white" @click="submitLogin">Login</v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-else title="Loading..."> </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import useAuth from "@/hooks/useAuth";

const valid = ref(false);
const email = ref(import.meta.env.VITE_SUPABASE_USER);
const emailRules = [
  (value: string) => {
    if (value) return true;
    return "E-mail is required.";
  },
  (value: string) => {
    if (/.+@.+\..+/.test(value)) return true;
    return "E-mail must be valid.";
  },
];
const password = ref(import.meta.env.VITE_SUPABASE_PASSWORD);
const passwordRules = [
  (value: string) => {
    if (value) return true;
    return "Password is required.";
  },
];
const showPassword = ref(false);

const { login } = useAuth();
const { auth_loading } = storeToRefs(useAuthStore());
function submitLogin() {
  login(email.value, password.value);
}
</script>
