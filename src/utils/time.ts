import { format } from "date-fns";

export function formatTime(seconds: number) {
  return format(new Date(seconds * 1000), "yyyy-MM-dd HH:mm");
}
