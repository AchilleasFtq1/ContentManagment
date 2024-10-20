import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";
import LoginForm from "./LoginForm"; // Import your login form component

export default async function LoginPage() {
  const session: Session | null = await getServerSession(authOptions);

  // If the user is already logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
    return null; // Return null to prevent rendering
  }

  return <LoginForm />;
}
