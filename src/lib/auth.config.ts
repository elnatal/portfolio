import type { NextAuthConfig } from "next-auth";

// Edge-safe config — no Node.js-only imports (no bcryptjs).
// Credentials provider is added in auth.ts which runs in Node.js.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      if (isAdminRoute) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
  providers: [],
};
