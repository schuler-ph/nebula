import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://nsysvbhfzbomwglmhzus.supabase.co",
  import.meta.env.VITE_SUPABASE_KEY
);

export const getUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error === null) {
    return data.user.id;
  } else {
    return "";
  }
};
