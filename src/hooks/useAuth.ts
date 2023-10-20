import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabaseClient";
import { AuthError } from "@supabase/supabase-js";
import router from "@/router";
import { start } from "repl";

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

    if (data.user?.user_metadata.disabled) {
      rejected();
      await logout();
      return { message: "Login rejected." };
    }

    handleResponse(error);

    if (error !== null) {
      return { message: "Invalid credentials." };
    }

    return null;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    router.push({ name: "Login" });
    rejected();
  };

  const signup = async (email: string, password: string) => {
    startLoading();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          disabled: true,
        },
      },
    });
    rejected();
    return error;
  };

  return {
    login,
    initAuth,
    logout,
    signup,
  };
};
