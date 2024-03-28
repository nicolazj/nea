import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect = requestUrl.searchParams.get("redirect");
  const origin = requestUrl.origin;

  if (code) {
    console.log("exchange code", code);
    const supabase = createClient();
    let {
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code);

    let {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      let token = session?.provider_token;

      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      let res = await fetch("https://api.linkedin.com/v2/me", {
        method: "GET",
        headers,
      }).then((r) => r.json());

      console.log({ res });

      await supabase
        .from("profiles")
        .update({ vanity_name: res.vanityName, title: res.localizedHeadline })
        .eq("id", user.id);
    }
  }
console.log(redirect)
  // URL to redirect to after sign up process completes
  return NextResponse.redirect(redirect ? origin + redirect : origin);
}
