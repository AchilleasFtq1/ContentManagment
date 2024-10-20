"use client";

import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DismissableAlert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for storing the error message
  const { data: session, status } = useSession();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // Prevent default form submission
    const result = await signIn("credentials", {
      redirect: false, // Prevent NextAuth from redirecting automatically
      username,
      password,
    });

    if (result?.error) {
      setError("Invalid username or password"); // Show the custom error message
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/dashboard";
    }
  }, [session, status]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="mt-20 w-full max-w-md px-4">
          <Card className="relative w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your username and password to login to your account.
              </CardDescription>
              {/* Conditionally display the error message */}
              {error && (
                <DismissableAlert variant="destructive" className="mb-4">
                  {error}
                </DismissableAlert>
              )}
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  label="Username"
                  id="username"
                  name="username" // Add name for autofill
                  type="text"
                  autoComplete="username" // Enable autofill for username
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Input
                  id="password"
                  name="password" // Add name for autofill
                  type="password"
                  autoComplete="current-password" // Enable autofill for password
                  label="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit">
                Sign in
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
}
