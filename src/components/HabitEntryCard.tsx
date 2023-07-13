import type { HabitEntry } from "@prisma/client";
import dayjs from "~/utils/dayjs";

const EMOJI_FEELINGS = ["😭", "😢", "😐", "🙂", "😄"];

const HabitEntryCard = ({ habitEntry }: { habitEntry: HabitEntry }) => {
  return (
    <div className="border-1 flex min-h-max flex-col justify-between space-y-2 overflow-ellipsis p-4 shadow-sm">
      <div className="flex justify-between">
        <h4>
          {habitEntry.description ??
            dayjs(habitEntry.created_at).format("DD/MM")}
        </h4>{" "}
        {/* add dropdown menu here */}
      </div>
      <div>
        {habitEntry.feeling && (
          <span className="font-light text-slate-400">
            feeling: {EMOJI_FEELINGS.at(habitEntry.feeling)}
          </span>
        )}
      </div>
    </div>
  );
};

export default HabitEntryCard;
