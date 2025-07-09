import HeartIcon from "./HeartIcon";
import type { Like } from "../lib/zero/schema";
import { useAuth } from "../lib/auth/useAuth";

export interface LikeButtonProps {
  likes: ReadonlyArray<Like>;
}

export default function LikeButton({ likes }: Readonly<LikeButtonProps>) {
  const { user } = useAuth();
  const liked = likes.some((like) => like.user_id === user?.id);
  const count = likes.length;

  return (
    <button
      className={`like-button ${liked ? "liked" : ""}`}
      aria-label={liked ? "Unlike post" : "Like post"}
      disabled
    >
      <HeartIcon filled={liked} />
      {count > 0 && <span className="like-count">{count}</span>}
    </button>
  );
}
