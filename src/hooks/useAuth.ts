import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabaseClient";
import { AuthError } from "@supabase/supabase-js";
import router from "@/router";

export default () => {
  const { validated, rejected, startLoading } = useAuthStore();

  const handleResponse = (error: AuthError | null) => {
    if (error === null) {
      validated();
      router.push({ name: "Home" });
    } else {
      rejected();
    }
  };

  const initAuth = async () => {
    startLoading();
    const { data, error } = await supabase.auth.refreshSession();
    handleResponse(error);
  };

  const login = async (email: string, password: string) => {
    startLoading();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    handleResponse(error);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    router.push({ name: "Login" });
    rejected();
  };

  return {
    login,
    initAuth,
    logout,
  };
};
