import type { User } from "@supabase/supabase-js";

// Check for all possible username keys in metadata
export const getUserName = (user: User) => {
  if (!user.user_metadata) return user?.email?.split("@")[0] ?? "User";

  // Try different possible keys for username
  return (
    user.user_metadata.user_name ??
    user.user_metadata.username ??
    user.user_metadata.name ??
    user.email?.split("@")[0] ??
    "User"
  );
};
