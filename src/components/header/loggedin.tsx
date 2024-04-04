"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Loggedin() {
  let router = useRouter();

  let logout = async () => {
    let supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };
  return (
    <div className="flex  gap-2 ">
      <Button asChild>
        <Link href={"/new"}>Create a date</Link>
      </Button>

      <form method="GET" action="/auth/signout">
        <Button variant={"secondary"}>Log out</Button>
      </form>
    </div>
  );
}
