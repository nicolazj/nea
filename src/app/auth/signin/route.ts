import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  let client = createClient();
  let url = new URL(request.url);
  let redirect = url.searchParams.get("redirect");

  console.log({ url }, { redirect });
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "linkedin_oidc",
    options: {
      scopes: "r_basicprofile",
      redirectTo:
        url.origin +
        "/auth/callback" +
        (redirect ? `?redirect=${redirect}` : ""),
    },
  });
  console.log({ data, error });
  // should send to error page
  if (error || !data.url) {
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;
    return NextResponse.redirect(origin);
  }
  // URL to redirect to after sign up process completes
  return NextResponse.redirect(data.url);
}
