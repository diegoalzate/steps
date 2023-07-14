import type { HabitEntry } from "@prisma/client";
import dayjs from "~/utils/dayjs";
import DropdownMenu from "./DropdownMenu";
import { PencilIcon } from "@heroicons/react/24/outline";

const EMOJI_FEELINGS = ["😭", "😢", "😐", "🙂", "😄"];

const HabitEntryCard = ({ habitEntry }: { habitEntry: HabitEntry }) => {
  return (
    <div className="border-1 flex min-h-max flex-col justify-between space-y-2 overflow-ellipsis shadow-sm">
      <div className="flex justify-end">
        <DropdownMenu
          menuTitle="options"
          options={[
            {
              title: "edit",
              icon: PencilIcon,
              link: `${habitEntry.habitId}/habitEntries/${habitEntry.id}/edit`,
            },
          ]}
        />
      </div>
      <div className="p-4">
        <h4>
          {habitEntry.description ??
            dayjs(habitEntry.created_at).format("DD/MM")}
        </h4>{" "}
        {habitEntry.feeling && (
          <span className="font-light text-slate-400">
            feeling: {EMOJI_FEELINGS.at(habitEntry.feeling - 1)}
          </span>
        )}
      </div>
    </div>
  );
};

export default HabitEntryCard;
