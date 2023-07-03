<template>
  <v-card
    v-if="!auth_loading"
    class="pa-6 d-flex flex-column align-center"
    min-width="350"
  >
    <v-img :src="nebulaLogo" height="100"></v-img>
    <span class="text-h5 mb-10 mt-3"
      >Login to the
      <span class="font-weight-black nebulaTextGradient">Nebula</span></span
    >
    <v-form v-model="valid" class="w-100">
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="Email"
        prepend-inner-icon="mdi-email"
        required
        color="primary"
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
        color="primary"
      ></v-text-field>
    </v-form>

    <v-card-actions>
      <v-btn
        class="text-h6 font-weight-bold nebulaBgGradient px-5 d-flex"
        @click="submitLogin"
        >Login</v-btn
      >
    </v-card-actions>
  </v-card>
  <v-card v-else title="Loading..."> </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import useAuth from "@/hooks/useAuth";
import nebulaLogo from "@/assets/logo.svg";

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

<style scoped>
.nebulaTextGradient {
  background-image: linear-gradient(90deg, #c782f1, #5270dc);
  background-clip: border-box;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.nebulaBgGradient {
  background-image: linear-gradient(90deg, #c782f1, #5270dc);
  -webkit-text-fill-color: transparent;
  -webkit-text-fill-color: white;
}
</style>
