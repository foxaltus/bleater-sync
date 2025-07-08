import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../lib/useAuth";
import "../routes/index.css"; // Reusing the styles

export const Route = createFileRoute("/auth/login")({
  component: LoginComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      auto_login: search.auto_login,
    };
  },
});

function LoginComponent() {
  const { user, loading, signInWithGitHub } = useAuth();

  const search = Route.useSearch();
  const autoLogin = search.auto_login !== "off";

  useEffect(() => {
    if (!loading && !user && autoLogin) {
      // Auto-login if enabled
      signInWithGitHub();
    }
  }, [loading, user, signInWithGitHub, autoLogin]);

  return (
    <div className="loading-container">
      {!autoLogin ? (
        <div className="login-container">
          <img
            src={import.meta.env.BASE_URL + "logo.png"}
            alt="Bleater Logo"
            className="loading-logo"
          />
          <h2>Welcome to Bleater</h2>
          <button className="login-button" onClick={() => signInWithGitHub()}>
            Sign in with GitHub
          </button>
        </div>
      ) : (
        <img
          src={import.meta.env.BASE_URL + "logo.png"}
          alt="Bleater Logo"
          className="loading-logo"
        />
      )}
    </div>
  );
}
