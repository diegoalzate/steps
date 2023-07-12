import { useUser } from "@clerk/nextjs";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
const ResponsiveCalendar = dynamic(
  () => import("@nivo/calendar").then((res) => res.ResponsiveCalendar),
  { ssr: false }
);
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { DropdownMenu } from "~/components";
import { api } from "~/utils/api";
import dayjs from "~/utils/dayjs";

const HabitPage: NextPage = () => {
  const router = useRouter();
  const { habitId } = router.query;
  const { user } = useUser();
  const { data: habit } = api.habits.getOne.useQuery(habitId as string);
  const { data: entries } = api.habitEntries.getEntries.useQuery({
    habitId: habitId as string,
  });
  const { mutate: deleteHabit } = api.habits.delete.useMutation({
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
              <DropdownMenu
                menuTitle={`options`}
                options={[
                  {
                    title: "edit",
                    icon: PencilIcon,
                    link: `${habitId as string}/edit`,
                  },
                  {
                    title: "leave",
                    icon: TrashIcon,
                    onClick: () => {
                      if (habitId) {
                        deleteHabit(habitId as string);
                      }
                    },
                  },
                ]}
              />
            )
          }
        </div>
        <div className="flex w-4/5 flex-col">
          <div id="heatmap" className="md: hidden sm:block sm:h-64">
            <ResponsiveCalendar
              data={
                entries?.map((entry) => ({
                  value: 1,
                  day: dayjs(entry.created_at).format("YYYY-MM-DD"),
                })) ?? []
              }
              from={dayjs().startOf("year").toDate()}
              to={dayjs().toDate()}
              emptyColor="#eeeeee"
              colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
              margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
              yearSpacing={40}
              align="top"
              monthBorderColor="#ffffff"
              dayBorderWidth={2}
              dayBorderColor="#ffffff"
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default HabitPage;
