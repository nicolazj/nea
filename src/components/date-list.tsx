import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { QueryData } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
export async function DateList() {
  let supabase = createClient();
  //   let {
  //     data: { user },
  //   } = await supabase.auth.getUser();
  let datesWithProfile = supabase.from("dates").select(`
   *,
    host:profiles!fk_created_by (
      id,
      name,
      picture,
      vanity_name, 
      title
    )
  `);
  type DatesWithProfile = QueryData<typeof datesWithProfile>;

  let { data } = await datesWithProfile;
  let dates: DatesWithProfile = data ?? [];
  return (
    <main className="container grid gap-4">
      {/* <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
        Hi, {user?.user_metadata.given_name}
      </h1>
      <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed dark:text-gray-400">
        Find someone to have lunch or dinner with. Create a date or join someone
        else's.
      </p> */}

      <h2 className="text-2xl font-bold tracking-tight">This Week</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {dates?.map((date) => {
          return (
            <Card key={date.id} className="hover:bg-accent">
              <CardHeader>
                <CardTitle>{date.where}</CardTitle>
                <CardDescription>
                  {" "}
                  {new Date(date.when! * 1000).toLocaleString()}
                </CardDescription>
                <CardDescription> {date.what}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-accent-foreground">
                  {date.whatelse}
                </p>
              </CardContent>

              <CardFooter className="flex justify-between">
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
                    <a
                      href={`https://www.linkedin.com/in/${
                        date.host!.vanity_name
                      }`}
                    >
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
                <Button asChild>
                  <Link href={`/dates/${date.id}`}>RSVP</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
