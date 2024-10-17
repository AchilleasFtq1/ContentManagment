/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string; // Add username to the session
    } & DefaultSession["user"];
  }

  interface User {
    username: string; // Include username in the User interface
  }
}

/**
 * Options for NextAuth.js
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        username: user.username, // Include username in the session callback
      },
    }),
    // Redirect after login
    redirect: async ({ url, baseUrl }) => {
      // Redirect to dashboard if login is successful
      return url.startsWith(baseUrl) ? `${baseUrl}/dashboard` : baseUrl;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    // Credentials provider for username and password
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

          let isValid = false;

          try {
            // Verify the password with bcrypt
            isValid = await bcrypt.compare(credentials.password, user.password);
          } catch (innerError) {
            // Handle the bcrypt.compare error specifically
            console.error("Error comparing passwords:", innerError);
            if (innerError instanceof Error) {
              throw new Error(innerError.message);
            }
            throw new Error("Password comparison failed");
          }

          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          // If everything is valid, return the user object
          return { id: user.id, username: user.username, email: user.email };
        } catch (outerError) {
          // Ensure proper type guarding on the error object
          if (outerError instanceof Error) {
            console.error("Error during authorization:", outerError.message);
            throw new Error(outerError.message);
          }
          throw new Error("Unknown error occurred during authorization");
        }
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 */
export const getServerAuthSession = () => getServerSession(authOptions);
