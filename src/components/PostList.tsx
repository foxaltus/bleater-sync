import { useQuery, useZero } from "@rocicorp/zero/react";
import Post from "./Post";
import type { Schema } from "../lib/zero/schema";

export default function PostList() {
  const z = useZero<Schema>();
  const [posts] = useQuery(
    z.query.post
      .related("user")
      .related("likes")
      .orderBy("created_at", "desc")
      .limit(20)
  );

  if (!posts?.length) {
    return <div className="no-posts">No posts yet. Be the first to post!</div>;
  }

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
