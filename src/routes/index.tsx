import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuth } from "../lib/useAuth";
import "./index.css";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  // Redirect to login if user is not authenticated
  if (!loading && !user) {
    router.navigate({ to: "/auth/login", search: { auto_login: "on" } });
  }

  // Show nothing while loading or redirecting
  if (!user) {
    return null;
  }

  // Check for all possible username keys in metadata
  const getUserName = () => {
    if (!user?.user_metadata) return user?.email?.split("@")[0] ?? "User";

    // Try different possible keys for username
    return (
      user.user_metadata.user_name ??
      user.user_metadata.username ??
      user.user_metadata.name ??
      user?.email?.split("@")[0] ??
      "User"
    );
  };

  const displayName = getUserName();

  return (
    <div className="dashboard">
      <header className="twitter-header">
        <div className="header-content">
          <h1>
            <img
              src={import.meta.env.BASE_URL + "logo.png"}
              alt="Bleater Logo"
              className="twitter-logo"
            />{" "}
            Bleater
          </h1>
          <div className="user-info">
            <div className="user-profile">
              {user?.email &&
                (user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={`@${displayName}'s profile`}
                    className="header-avatar-img"
                  />
                ) : (
                  <div className="header-avatar">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                ))}
              <span className="username">@{displayName}</span>
            </div>
            <button
              className="signout-button"
              onClick={signOut}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="posts-container">
          <h2>Recent Bleats</h2>
          <div className="no-posts">No posts yet. Be the first to post!</div>
        </div>
      </main>
    </div>
  );
}
