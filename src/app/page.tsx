import { DateList } from "@/components/date-list";

export default async function Home() {
  return (
    <div className="container ">
      <div className="grid text-center gap-8 mb-8">
        <h1 className="text-3xl">Never Eat Alone</h1>
        <p>
          Gone are the days of solitary lunches and missed networking
          opportunities. <br /> With Never Eat Alone, connecting with
          like-minded professionals for a power lunch has never been easier.
        </p>
      </div>

      <DateList />
    </div>
  );
}

export const dynamic = "force-dynamic";
