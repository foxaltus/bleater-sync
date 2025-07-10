import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuth } from "../lib/auth/useAuth";
import "./index.css";
import PostList from "../components/PostList";
import Header from "../components/Header";

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      error: search.error as string | undefined,
    };
  },
});

function Home() {
  const { error } = Route.useSearch();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if user is not authenticated
  if (!loading && !user) {
    router.navigate({
      to: "/auth/login",
      search: { auto_login: error ? "off" : "on" },
    });
  }

  // Show nothing while loading or redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">
      <Header user={user} />
      <main>
        <div className="posts-container">
          <h2>Recent Bleats</h2>
          <PostList />
        </div>
      </main>
    </div>
  );
}
