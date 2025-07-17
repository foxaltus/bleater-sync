/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "../lib/auth";
import "./__root.css";
import { ZeroInit } from "../lib/zero/zero-init";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Bleater",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: import.meta.env.BASE_URL + "logo.png",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Wrap children in AuthProvider to provide authentication context */}
        <AuthProvider>
          <ZeroInit>
            <div id="root">{children}</div>
          </ZeroInit>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
