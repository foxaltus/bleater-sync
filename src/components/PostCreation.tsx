import { getUserName } from "../lib/auth/utils";
import type { User } from "@supabase/supabase-js";
import PostForm from "./PostForm";

export interface PostFormProps {
  user: User;
}

export default function PostCreation({ user }: Readonly<PostFormProps>) {
  const username = getUserName(user);
  const avatar = user.user_metadata?.avatar_url;

  return (
    <div className="post-creation">
      <div className="profile-picture">
        {user.user_metadata?.avatar_url ? (
          <img
            src={avatar}
            alt={`@${username}'s profile`}
            className="avatar-img"
          />
        ) : (
          <div className="avatar">{username?.charAt(0).toUpperCase()}</div>
        )}
      </div>
      <PostForm />
    </div>
  );
}
