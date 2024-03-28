import { createClient } from "@/utils/supabase/server";
import { Loggedin } from "./loggedin";
import { ToLogin } from "./tologin";
import Link from "next/link";

export async function Header() {
  let supabase = createClient()
  let {data:{user}} = await supabase.auth.getUser();
  let loggedIn = !!user;
  return (
    <div className="flex justify-between my-2 container">
      <Link href="/">
      <div className="bg-foreground text-background leading-0 flex flex-col justify-center items-start  w-[64px] h-[64px] p-1 text-xs">
        <span>NEVER</span>
        <span>EAT</span>
        <span>ALONE</span>
      </div></Link>
      <div></div>
      {loggedIn ? <Loggedin/>: <ToLogin />}
      
    </div>
  );
}
