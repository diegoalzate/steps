import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const HabitPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const { data: habit, isLoading: habitIsLoading } = api.habits.getOne.useQuery(
    id as string
  );
  const { mutate, isLoading } = api.habits.delete.useMutation({
    onSuccess: () => {
      void router.back();
    },
  });

  return (
    <>
      <main className="flex min-h-screen min-w-full flex-col items-center space-y-2 ">
        <div className="flex w-4/5 justify-between">
          <h4 className="text-5xl font-bold text-amber-600">{habit?.task}</h4>{" "}
          {
            // only possibly delete if you created this habit
            habit && habit.userId === user?.id && (
              <button
                disabled={isLoading}
                onClick={() => mutate(id as string)}
                className="max-w-md rounded-full border-2 border-amber-600 bg-amber-600 p-1 text-slate-200 hover:bg-slate-200 hover:text-black"
              >
                delete
              </button>
            )
          }
        </div>
        <div className="flex w-4/5 flex-col"></div>
      </main>
    </>
  );
};

export default HabitPage;
