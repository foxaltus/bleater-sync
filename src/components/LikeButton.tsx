import HeartIcon from "./HeartIcon";
import type { Like, Schema } from "../lib/zero/schema";
import { useAuth } from "../lib/auth/useAuth";
import type { Mutators } from "../lib/zero/mutators";
import { useZero } from "@rocicorp/zero/react";

export interface LikeButtonProps {
  postId: string;
  likes: ReadonlyArray<Like>;
}

export default function LikeButton({
  postId,
  likes,
}: Readonly<LikeButtonProps>) {
  const z = useZero<Schema, Mutators>();

  const { user } = useAuth();
  const liked = likes.some((like) => like.user_id === user?.id);
  const count = likes.length;

  return (
    <button
      className={`like-button ${liked ? "liked" : ""}`}
      aria-label={liked ? "Unlike post" : "Like post"}
      onClick={() =>
        liked ? z.mutate.likes.remove(postId) : z.mutate.likes.add(postId)
      }
    >
      <HeartIcon filled={liked} />
      {count > 0 && <span className="like-count">{count}</span>}
    </button>
  );
}
