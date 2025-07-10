import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  zeroAuth: (error?: string) => Promise<string | undefined>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
