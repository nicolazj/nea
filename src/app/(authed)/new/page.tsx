"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { customRevalidatePath } from "@/lib/revalidatePath";
const formSchema = z.object({
  where: z.string().min(2).max(50),
  when: z.string().min(2).max(50),
  what: z.string().min(2).max(50),
  whatelse: z.string().min(0).max(200).optional(),
});

export default function DateNew() {
  let router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      where: "",
      what: "",
      whatelse: "",
      when: format(new Date(), "yyyy-MM-dd'T12:00"),
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      let supabase = createClient();
      const { data, error } = await supabase.from("dates").insert({
        ...values,
        when: parseISO(values.when).getTime() / 1000,
      }).returns();
      console.log({data,error});
      toast("New date created");
      await customRevalidatePath("/");
      router.push(`/`);
      // so this way home page gets rerendered with new data
      // window.location.href = "/home";
    } catch (err) {
      toast("New date failed" + err);
    }
  }
  return (
    <div className="w-[600px] m-auto grid gap-4">
      <h1 className="text-3xl">Create a new date</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="when"
            render={({ field }) => (
              <FormItem>
                <FormLabel>When</FormLabel>
                <FormControl>
                  <Input type="datetime-local" placeholder="" {...field} />
                </FormControl>
                {/* <FormDescription>E.g. Lunch at Sushi shop</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="where"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription> E.g. Sushi shop on Fort st</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="what"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  E.g. Industry Trends, Leadership, Work-Life Balance, Diversity
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatelse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What else</FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Anything you want the attendees to know
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
