import authConfig from "@/auth.config";
import { db } from "@/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { RoleUser } from "@/prisma/generated";
import NextAuth from "next-auth";
import { getAccountByUserId } from "./data/accounts";
import { getUserById } from "./data/user";

// Asegurarse de que el secreto esté definido
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "NEXTAUTH_SECRET must be defined in your environment variables"
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/admin")) {
        return auth?.user.roleUser === RoleUser.ADMIN;
      }

      return !!auth;
    },
    /* Si el email es igual al de ADMIN_EMAIL desdde el enviroment entonces volverlo un */
    async signIn({ user }) {
      const isAdmin = user.email === process.env.ADMIN_EMAIL;

      if (isAdmin) {
        const existingUser = await getUserById(user.id);

        if (existingUser) {
          await db.user.update({
            where: { id: user.id },
            data: { roleUser: RoleUser.ADMIN },
          });
        }

        user.roleUser = RoleUser.ADMIN;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.roleUser = user.roleUser;
      }

      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }
      const existingAccount = await getAccountByUserId(existingUser.id);

      if (!existingAccount) {
        return token;
      }

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.roleUser = existingUser.roleUser;

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.roleUser && session.user) {
        session.user.roleUser = token.roleUser as RoleUser;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/?auth=signin",
    signOut: "/",
    error: "/?error=DEFAULT",
  },
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
});
