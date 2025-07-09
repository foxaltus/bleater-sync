import { ZeroProvider } from "@rocicorp/zero/react";
import { schema } from "./schema";
import { useMemo } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "../auth/useAuth";
import { zeroAuth } from "../auth";

const serverURL = import.meta.env.VITE_PUBLIC_SERVER;

// Check for missing environment variables
if (!serverURL) {
  throw new Error(
    "Missing Public Server environment variables. Check your .env file."
  );
}

export function ZeroInit({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session } = useAuth();

  const opts = useMemo(() => {
    return {
      schema,
      userID: session?.user?.id ?? "anon",
      auth: zeroAuth,
      server: serverURL,
    };
  }, [session?.user?.id, router]);

  return <ZeroProvider {...opts}>{children}</ZeroProvider>;
}
