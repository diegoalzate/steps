import { type Habit } from "@prisma/client";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import Link from "next/link";
import { api } from "~/utils/api";
import { lastRelevantEntriesDate } from "~/utils/helpers";

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

const COMPLETED_HABIT = "🟢";
const PENDING_HABIT = "⚪";

const HabitCard = ({ habit }: { habit: Habit }) => {
  const ctx = api.useContext();

  const { data, isLoading } = api.habitEntries.getEntries.useQuery({
    habitId: habit.id,
    createdAfterDate: lastRelevantEntriesDate(habit.frequency),
  });

  const { data: streak } = api.habitEntries.getStreak.useQuery(habit.id)

  const { mutate } = api.habitEntries.create.useMutation({
    onSuccess: () => {
      void ctx.habitEntries.getEntries.invalidate();
    },
  });

  if (isLoading) return <span>loading...</span>;

  if (!data) return <span>try again later...</span>;

  const numberOfPendingHabits =
    habit.amount - data.length < 40 ? habit.amount - data.length : 40;

  return (
    <div className="border-1 flex min-h-max flex-col justify-between space-y-2 overflow-ellipsis p-4 shadow-sm">
      <div className="flex justify-between">
        <Link href={`/habits/${habit.id}`}>
          <h4>{habit.task}</h4>{" "}
          {!!streak && <h3 className="mt-2">{streak}🔥</h3>}
        </Link>
        <button
          onClick={() => mutate(habit.id)}
          className="max-w-md rounded-full border-2 border-amber-600 bg-amber-600 p-1 text-slate-200 hover:bg-slate-200 hover:text-black"
        >
          +
        </button>
      </div>
      <div>
        <span>
          {data.map(() => COMPLETED_HABIT).join(" ")}{" "}
          {numberOfPendingHabits > 0
            ? Array.from({ length: numberOfPendingHabits })
              .map(() => PENDING_HABIT)
              .join(" ")
            : null}
        </span>
      </div>
      <div>
        <span className="font-light text-slate-400">
          {habit.frequency.toLocaleLowerCase()}
        </span>
      </div>
    </div>
  );
};

export default HabitCard;
