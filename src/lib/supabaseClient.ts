import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const VITE_SUPABASE_URL = "https://nsysvbhfzbomwglmhzus.supabase.co";
const VITE_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zeXN2YmhmemJvbXdnbG1oenVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODgzMjU2NTEsImV4cCI6MjAwMzkwMTY1MX0.rGhjby52xmnA5H9c57-mj3hsL6QoPF6hBnE3WcwpPZc";

export const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_KEY
);

export const getUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error === null) {
    return data.user.id;
  } else {
    return "";
  }
};
