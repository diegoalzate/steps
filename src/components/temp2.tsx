import { api } from "~/utils/api";
import HabitCard from "./temp4";

const HabitList = ({
  groupId,
  title,
}: {
  groupId?: string;
  title?: string;
}) => {
  const { data, isLoading } = api.habits.getAll.useQuery(groupId);

  if (isLoading) return <span>loading...</span>;

  if (!data?.length) return <span></span>;

  return (
    <div className="flex min-w-full flex-col space-y-2">
      {!!title && (
        <h1 className="text-5xl font-bold text-amber-600">{title}</h1>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.map((habit, key) => (
          <HabitCard key={key} habit={habit} />
        ))}
      </div>
    </div>
  );
};

export default HabitList;
