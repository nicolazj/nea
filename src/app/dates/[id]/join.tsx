import { Button } from "@/components/ui/button";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

async function attend(formData: FormData) {
  "use server";
  let sp = createClient();
  let {
    data: { user },
  } = await sp.auth.getUser();
  let date_id = formData.get("date_id");
  if (!user || !date_id) {
    return;
  }

  let row = {
    user_id: user.id,
    date_id: +date_id,
  };
  console.log("insert", row);

  const { data, error } = await sp.from("attendances").insert(row);

  revalidatePath(`/dates/${date_id}`);

  console.log(error, data);
}
async function unattend(formData: FormData) {
  "use server";
  let sp = createClient();
  let {
    data: { user },
  } = await sp.auth.getUser();
  let date_id = formData.get("date_id");
  if (!user || !date_id) {
    return;
  }

  const { data, error } = await sp
    .from("attendances")
    .delete()
    .eq("date_id", date_id)
    .eq("user_id", user!.id);

  revalidatePath(`/dates/${date_id}`);

  console.log(error, data);
}

export async function Join({ date }: { date: Tables<"dates"> }) {
  let attended = false;
  let sp = createClient();
  let {
    data: { user },
  } = await sp.auth.getUser();

  let loggedin = !!user;
  if (loggedin) {
    let isOwner = date.created_by === user?.id;
    if (isOwner) return null;

    let { data } = await sp
      .from("attendances")
      .select()
      .eq("date_id", date.id)
      .eq("user_id", user!.id);
    attended = (data?.length ?? 0) > 0;
  }

  return (
    <div>
      <div>
        {!loggedin ? (
          <form action={`/auth/signin`}>
            <input name="redirect" value={`/dates/${date.id}`} type="hidden" />
            <Button className="text-3xl h-auto p-4">Sign in to RSVP </Button>
          </form>
        ) : attended ? (
          <form action={unattend}>
            <input name="date_id" value={date.id} type="hidden" />
            <Button className="text-3xl h-auto p-4">
             {`No, I've changed my mind`}
            </Button>
          </form>
        ) : (
          <form action={attend}>
            <input name="date_id" value={date.id} type="hidden" />
            <Button className="text-3xl h-auto p-4">{`Yessss!, I'm going`} </Button>
          </form>
        )}
      </div>
    </div>
  );
}
