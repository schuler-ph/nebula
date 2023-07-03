// import jwtDecode from "jwt-decode";
import { useAuthStore } from "@/store/authStore"
import { supabase } from "@/lib/supabaseClient"

const { loginSuccess } = useAuthStore()

export default () => {
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if(error?.status) {
      return error
    }
    else {
      loginSuccess(data.session!.access_token, data.user!)
      return null
    }
  };

//   const refreshToken = async () => {
//     try {
//       const { accessToken } = await $fetch("/api/auth/refresh");
//       setToken(accessToken);
//       return true;
//     } catch (error) {
//       return false;
//     }
//   };

//   const getUser = async () => {
//     try {
//       const { user } = await useFetchApi("/api/auth/user");
//       setUser(user);
//       return true;
//     } catch (error) {
//       return false;
//     }
//   };

//   const reRefreshAccessToken = async () => {
//     const authToken = useAuthToken();

//     if (!authToken.value) {
//       return;
//     }

//     const jwt: any = jwtDecode(authToken.value);
//     const newRefreshTime = jwt.exp - 60000;

//     setTimeout(async () => {
//       await refreshToken();
//       reRefreshAccessToken();
//     }, newRefreshTime);
//   };

//   const initAuth = async () => {
//     setIsLoading(true);
//     try {
//       if (await refreshToken()) {
//         await getUser();
//       }

//       reRefreshAccessToken();
//       return true;
//     } catch (error) {
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

  return {
    login,
  //   useAuthUser,
  //   useAuthToken,
  //   useAuthLoading,
  //   initAuth,
  };
};
