import type { Like, Post, Profile } from "../lib/zero/schema";
import LikeButton from "./LikeButton";

interface PostProps {
  post: Post & {
    readonly user?: Profile;
    readonly likes: ReadonlyArray<Like>;
  };
}

export default function Post({ post }: Readonly<PostProps>) {
  return (
    <div className={`post-item`}>
      <div className="post-avatar">
        {post?.user?.picture ? (
          <img
            src={post.user.picture}
            alt={post.user.name || "User"}
            className="avatar-img"
          />
        ) : (
          <div className="avatar">{post?.user?.name?.charAt(0) || "U"}</div>
        )}
      </div>
      <div className="post-content">
        <div className="post-header">
          <span className="post-author">@{post?.user?.name || "User"}</span>
          <span className="post-time">
            {new Date(post.created_at).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="post-message">{post.message}</div>
        <div className="post-actions">
          <div className="action-container">
            <LikeButton likes={post.likes} />
          </div>
        </div>
      </div>
    </div>
  );
}
