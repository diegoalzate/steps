import { SignOutButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import { Habit } from "@prisma/client";
import { useCallback } from "react";

const HabitPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: habit, isLoading: habitIsLoading } = api.habits.getOne.useQuery(
    id as string
  );
  const { mutate, isLoading } = api.habits.delete.useMutation({
    onSuccess: () => {
      void router.push("/habits");
    },
  });

  /**
   * Gets the maximum date we will show, 5 units of time behind today
   */
  const getMaxLastDate = useCallback(
    (habit?: Habit | null) => {
      const now = dayjs();
      if (!habit) return;
      if (habit.frequency === "DAY") {
        const todayMinus5UnitsOfTime = now.subtract(5, "days");
        return todayMinus5UnitsOfTime.toISOString();
      } else if (habit.frequency === "WEEK") {
        const todayMinus5UnitsOfTime = now.subtract(5, "weeks");
        return todayMinus5UnitsOfTime.toISOString();
      } else {
        const todayMinus5UnitsOfTime = now.subtract(5, "months");
        return todayMinus5UnitsOfTime.toISOString();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [habit]
  );

  //   const { data: habits, isLoading: habitsIsLoading } =
  //     api.habitEntries.getEntries.useQuery({
  //       habitId: id as string,
  //     });

  return (
    <>
      <main className="flex min-h-screen min-w-full flex-col items-center space-y-2 ">
        <div className="self-end p-4">
          <SignOutButton />
        </div>
        <div className="flex w-4/5 justify-between">
          <h4 className="text-5xl font-bold text-amber-600">{habit?.task}</h4>{" "}
          <button
            disabled={isLoading}
            onClick={() => mutate(id as string)}
            className="max-w-md rounded-full border-2 border-amber-600 bg-amber-600 p-1 text-slate-200 hover:bg-slate-200 hover:text-black"
          >
            delete
          </button>
        </div>
        <div className="flex w-4/5 flex-col">
          {/* {Array.from({ length: 5 }).map((_, index) =>
            habit ? (
              <div key={index}>{`${habit.frequency.toLowerCase()} ${
                index + 1
              }`}</div>
            ) : null
          )} */}
        </div>
      </main>
    </>
  );
};

export default HabitPage;
