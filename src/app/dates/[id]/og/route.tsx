import { createClient } from "@/utils/supabase/server";
import { formatTime } from "@/utils/time";
import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    let id = context.params.id;
    let supabase = createClient();

    let { data: date } = await supabase
      .from("dates")
      .select(
        `
      *,
       host:profiles!fk_created_by (
         id,
         name,
         picture,
         vanity_name, 
         title
       ),
       attendances(
          profiles!public_attendances_user_id_fkey(
            *
          )
       )
     `
      )
      .eq("id", id)
      .limit(1)
      .single();
    if (!date) return null;
    return new ImageResponse(
      (
        <div tw="bg-black flex flex-col w-full h-full gap-4 p-8" style={{}}>
          <div tw="flex text-[40px] text-white">{date?.where}</div>
          <div tw="flex text-[40px] text-white">{formatTime(date.when!)}</div>
          <div tw="flex text-[40px] text-white">{date?.what}</div>
          <div tw="flex text-[40px] text-white">{date?.whatelse}</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
