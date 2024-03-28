"use server";

import { revalidatePath } from "next/cache";

export const customRevalidatePath = (path: string) => {
  return revalidatePath(path);
};
