import { type Habit } from "@prisma/client";
import Link from "next/link";
import { api } from "~/utils/api";
import { lastRelevantEntriesDate } from "~/utils/helpers";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useReward } from "react-rewards";
import useLongPress from "~/hooks/UseLongPress";

const COMPLETED_HABIT = "🟢";
const PENDING_HABIT = "⚪";

const HabitCard = ({ habit }: { habit: Habit }) => {
  const router = useRouter();
  const ctx = api.useContext();
  const longPressEvent = useLongPress({
    onLongPress: () => {
      // go to create habit entry with extra info page
      void router.push(`/habits/${habit.id}/habitEntries/add`);
    },
    onClick: () => mutate({ habitId: habit.id }),
  });

  const { data, isLoading } = api.habitEntries.getAll.useQuery({
    habitId: habit.id,
    createdAfterDate: lastRelevantEntriesDate(habit.frequency),
  });

  const { data: streak } = api.habitEntries.getStreak.useQuery(habit.id);

  const { mutate, isLoading: isMutating } = api.habitEntries.create.useMutation(
    {
      onSuccess: () => {
        void ctx.habitEntries.getAll.invalidate();
        toast.dismiss();
        toast.success("added habit");
        reward();
      },
      onMutate: () => {
        toast.loading("adding...");
      },
    }
  );
  const { reward, isAnimating } = useReward(
    `newHabitReward${habit.id}`,
    "confetti"
  );

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
          <span id={`newHabitReward${habit.id}`} />
        </Link>
        <div className="flex flex-col">
          <button
            disabled={isMutating || isAnimating}
            {...longPressEvent}
            className="max-w-md select-none rounded-full border-2 border-amber-600 bg-amber-600 p-1 text-slate-200 hover:bg-slate-200 hover:text-black disabled:opacity-40"
          >
            +
          </button>
        </div>
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
