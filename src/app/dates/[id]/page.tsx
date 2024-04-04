import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { Join } from "./join";

export default async function Page({ params }: { params: { id: string } }) {
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
    .eq("id", params.id)
    .limit(1)
    .single();
  console.log(JSON.stringify(date, null, 2));
  if (!date) return null;
  return (
    <div className="container grid gap-4 mt-8">
      <h1 className="text-3xl">{date?.where}</h1>
      <p className="">{new Date(date?.when! * 1000).toLocaleString()}</p>
      <div>
        <Badge>{date.what}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-12">{date?.whatelse}</p>
      <p>Host:</p>
      <div className="flex gap-2">
        <Image
          src={date.host!.picture!}
          width={64}
          height={64}
          alt=""
          className="block rounded-full  "
        />
        <div>
          <p className="text-sm">{date.host!.name}</p>
          <p className="text-xs">{date.host!.title}</p>
          <a href={`https://www.linkedin.com/in/${date.host!.vanity_name}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#0077b5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </div>
      <p>{`Who's going:`}</p>
      {date.attendances.map((att) => {
        let profile = att.profiles;
        return (
          <div className="flex gap-2" key={profile?.id}>
            <Image
              src={profile!.picture!}
              width={64}
              height={64}
              alt=""
              className="block rounded-full  "
            />
            <div>
              <p className="text-sm">{profile!.name}</p>
              <p className="text-xs">{profile!.title}</p>
              <a href={`https://www.linkedin.com/in/${date.host!.vanity_name}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#0077b5"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        );
      })}

      <Join date={date} />
    </div>
  );
}

export const dynamic = "force-dynamic";
