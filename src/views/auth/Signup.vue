<template>
  <v-card
    v-if="!auth_loading"
    class="pa-6 d-flex flex-column align-center"
    min-width="350"
    elevation="20"
  >
    <v-img :src="nebulaLogo" height="100"></v-img>
    <span class="text-h5 mb-10 mt-3"
      >Sign-up for the
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
        @click="submitSignup"
        prepend-icon="mdi-login"
        >Sign-up</v-btn
      >
    </v-card-actions>
    <div class="mt-5 d-flex flex-column align-center text-body-2">
      <div>Already have an account?</div>
      <v-btn
        variant="text"
        @click="() => router.push({ name: 'Login' })"
        class="nebulaTextGradient"
      >
        Login
      </v-btn>
    </div>
  </v-card>
  <v-card v-else title="Loading..."> </v-card>
</template>

<script setup lang="ts">
import useAuth from "@/hooks/useAuth";
import { ref } from "vue";
import { useSnackbarStore } from "@/store/snackbarStore";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import nebulaLogo from "@/assets/logo.svg";
import router from "@/router/index";

const { newSnackbarMessage } = useSnackbarStore();
const email = ref("");
const password = ref("");
const { auth_loading } = storeToRefs(useAuthStore());
const { signup } = useAuth();

const valid = ref(false);
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
const passwordRules = [
  (value: string) => {
    if (value) return true;
    return "Password is required.";
  },
];
const showPassword = ref(false);

async function submitSignup() {
  const error = await signup(email.value, password.value);
  console.log(error);
  if (error !== null) {
    newSnackbarMessage("Signup failed!", "error");
  } else {
    newSnackbarMessage("A new account has been requested!", "info");
  }
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
