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
  if (error || !data.url) return NextResponse.redirect("/");
  // URL to redirect to after sign up process completes
  return NextResponse.redirect(data.url);
}

// https://cgjxlinbhijgcnrybfpb.supabase.co/auth/v1/authorize?provider=linkedin_oidc&redirect_to=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scopes=r_basicprofile&code_challenge=l1s2sEd4-0ay7zKb-ImaQ7Fs1TSTp1ByZjru7LFa9uQ&code_challenge_method=s256

// https://cgjxlinbhijgcnrybfpb.supabase.co/auth/v1/authorize?provider=linkedin_oidc&redirect_to=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scopes=r_basicprofile&code_challenge=rn2Ibg1LFOLIo41Ps93trgyevtH9p9I18Mhujyj0Ncg&code_challenge_method=s256
