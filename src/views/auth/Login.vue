<template>
  <v-card
    v-if="!auth_loading"
    class="pa-6 d-flex flex-column align-center"
    min-width="350"
    elevation="20"
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
        elevation="10"
        class="text-h6 font-weight-bold nebulaBgGradient px-5 d-flex"
        @click="submitLogin"
        prepend-icon="mdi-login"
        >Login</v-btn
      >
    </v-card-actions>
  </v-card>
  <v-card v-else title="Loading..."> </v-card>
  <CustomSnackbar
    v-model="snackbarOpen"
    :text="snackbarText"
    :color="snackbarColor"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import useAuth from "@/hooks/useAuth";
import nebulaLogo from "@/assets/logo.svg";
import CustomSnackbar from "@/components/generic/CustomSnackbar.vue";

const valid = ref(false);
const email = ref("");
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
const password = ref("");
const passwordRules = [
  (value: string) => {
    if (value) return true;
    return "Password is required.";
  },
];
const showPassword = ref(false);

const { login } = useAuth();
const { auth_loading } = storeToRefs(useAuthStore());
async function submitLogin() {
  const error = await login(email.value, password.value);
  if (error !== null) {
    snackbarOpen.value = true;
    snackbarText.value = "Invalid login credentials!";
    snackbarColor.value = "deep-orange";
  }
}

const snackbarOpen = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("");
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
