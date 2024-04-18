import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

import { db } from "./lib/db";
import { getUserById } from "./actions/get-user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 /* one day */ },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id as string);

      // Prevent sign in for inactive users
      if (!existingUser?.active) return false;

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    // @ts-ignore
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.fullName = token.fullName;
        session.user.email = token.email;
        session.user.school = token.school;
        session.user.color = token.color;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      token.firstName = existingUser.firstName;
      token.lastName = existingUser.lastName;
      token.fullName = existingUser.fullName;
      token.email = existingUser.email;
      token.school = existingUser.school;
      token.role = existingUser.role;
      token.color = existingUser.color;

      return token;
    },
  },
  ...authConfig,
});
