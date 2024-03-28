"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

async function signInWithLinkedIn() {
  console.log("linked in login");
  let client = createClient();
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "linkedin_oidc",
    options: {
      scopes: "r_basicprofile",
      redirectTo: window.location.origin + "/auth/callback",
    },
  });
}

export default function Login() {
  useEffect(() => {
    let client = createClient();
    client.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: {
        scopes: "r_basicprofile",
        redirectTo: window.location.origin + "/auth/callback",
      },
    });
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <Button onClick={signInWithLinkedIn}>login with linkedin</Button> */}
    </main>
  );
}
