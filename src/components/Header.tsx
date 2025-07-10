import SignOut from "./SignOut";
import type { User } from "@supabase/supabase-js";
import { getUserName } from "../lib/auth/utils";

export interface HeaderProps {
  user: User;
}

export default function Header({ user }: Readonly<HeaderProps>) {
  const username = getUserName(user);
  const avatar = user.user_metadata?.avatar_url;

  return (
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
            {username &&
              (avatar ? (
                <img
                  src={avatar}
                  alt={`@${username}'s profile`}
                  className="header-avatar-img"
                />
              ) : (
                <div className="header-avatar">
                  {username.charAt(0).toUpperCase()}
                </div>
              ))}
            <span className="username">@{username}</span>
          </div>
          <SignOut />
        </div>
      </div>
    </header>
  );
}
