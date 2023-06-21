import type { Habit } from "@prisma/client";
import dayjs from "./dayjs";

export const lastRelevantEntriesDate = (frequency: Habit["frequency"]) => {
  if (frequency === "DAY") {
    const now = dayjs();
    const startOfDay = now.startOf("day");
    return startOfDay.toISOString();
  } else if (frequency === "WEEK") {
    const now = dayjs();
    const startOfWeek = now.startOf("week");
    return startOfWeek.toISOString();
  } else {
    const now = dayjs();
    const startOfMonth = now.startOf("month");
    return startOfMonth.toISOString();
  }
};
