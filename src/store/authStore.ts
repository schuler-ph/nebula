import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    auth_token: undefined as string | undefined,
    auth_user: undefined as Object | undefined,
    auth_loading: true,
  }),
  actions: {
    loginSuccess(token: string, user: Object) {
      this.auth_token = token
      this.auth_user = user
    },
  }
})
