/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name!,
        email: token.email!,
      };

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard on successful sign-in
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/dashboard`;
      }
      return url;
    },
  },

  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Ensure credentials exist
          if (!credentials?.username || !credentials.password) {
            throw new Error("Missing credentials");
          }

          // Find user by username
          const user = await db.user.findUnique({
            where: { username: credentials.username },
          });

          // If no user is found or password is invalid
          if (!user?.password) {
            throw new Error("Invalid credentials");
          }

          // Verify the password with bcrypt
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          // If everything is valid, return the user object (without the password)
          return {
            id: user.id,
            username: user.username,
            email: user.email,
          };
        } catch (error: unknown) {
          // <-- Typed as unknown
          if (error instanceof Error) {
            // <-- Type guard
            console.error("Error during authorization:", error.message);
          } else {
            console.error("Unknown error during authorization");
          }
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 604800, // 7 days
  },
  jwt: {
    maxAge: 604800, // 7 days
  },
  pages: {
    signIn: "/login",
  },
  debug: false,
};

export const getServerAuthSession = () => getServerSession(authOptions);
