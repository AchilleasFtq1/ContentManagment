"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      void router.push("/api/auth/signin");
    } else {
      void router.push("/dashboard");
    }
  }, [session, status, router]);

  return null;
}
