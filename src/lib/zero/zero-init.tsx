import { ZeroProvider } from "@rocicorp/zero/react";
import { schema } from "./schema";
import { useMemo } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "../auth/useAuth";
import { zeroAuth } from "../auth";
import { createMutators } from "./mutators";

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
      mutators: createMutators(
        session?.user?.id ? { sub: session?.user?.id } : undefined
      ),
    };
  }, [session?.user?.id, router]);

  return <ZeroProvider {...opts}>{children}</ZeroProvider>;
}
