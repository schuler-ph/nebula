<template>
  <v-card class="pa-6" :loading="loginLoading" title="Login to your Nebula account">

    <v-form v-model="valid">
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="Email"
        prepend-icon="mdi-email"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        prepend-icon="mdi-form-textbox-password"
        required
        :type="showPassword ? '' : 'password'"
      ></v-text-field>
    </v-form>

    <v-card-actions>
      <v-btn class="bg-indigo" @click="submitLogin">Login</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useAuth from "@/hooks/useAuth"
import { useAuthStore } from "@/store/authStore"
import { storeToRefs } from 'pinia';

const { login } = useAuth()

const { auth_user, auth_token } = storeToRefs(useAuthStore())

const valid = ref(false)
const email = ref(import.meta.env.VITE_SUPABASE_USER)
const emailRules =  [
  (value: string) => {
    if (value) return true
    return 'E-mail is required.'
  },
  (value: string) => {
    if (/.+@.+\..+/.test(value)) return true
    return 'E-mail must be valid.'
  },
]
const password = ref(import.meta.env.VITE_SUPABASE_PASSWORD)
const passwordRules =  [
  (value: string) => {
    if (value) return true
    return 'Password is required.'
  },
]
const showPassword = ref(false)

const loginLoading = ref(false)
async function submitLogin() {
  loginLoading.value = true

  login(email.value, password.value).then(err => {
    if(err) {
      console.log(err)
    }
    loginLoading.value = false
  })
}
</script>
