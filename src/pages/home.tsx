import { type NextPage } from "next";
import { type Group } from "@prisma/client";
import { api } from "~/utils/api";
import { type ChangeEvent, useState, type SyntheticEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, HabitForm, HabitList } from "~/Components";

const GroupForm = ({ setIsOpen }: { setIsOpen: (bool: boolean) => void }) => {
  const [form, setForm] =
    useState<Omit<Group, "id" | "created_at" | "updated_at">>();
  const router = useRouter();
  const { mutate } = api.groups.create.useMutation({
    onSuccess: (group) => {
      void router.push(`/groups/${group.id}`);
    },
  });
  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | SyntheticEvent<HTMLSelectElement, Event>
  ) => {
    const { name, value } = e.currentTarget;
    setForm({ ...form, [name]: value } as Group);
  };

  return (
    <form
      className="flex flex-col items-start gap-4 p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        mutate({
          ...form,
        } as Group);
      }}
    >
      <div className="flex min-w-full justify-end">
        <button
          className="justify-self-end"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          x
        </button>
      </div>
      <div className="flex min-w-full items-baseline space-x-6">
        <label className="block min-w-max text-sm font-medium leading-6 text-gray-900">
          name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          placeholder="ex: homies"
          onChange={handleChange}
          className="block w-full rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
        />
      </div>
      <div className="flex min-w-full items-baseline space-x-6">
        <label className="block min-w-max text-sm font-medium leading-6 text-gray-900">
          description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          autoComplete="off"
          placeholder="ex: meditate every day at 3pm at home"
          onChange={handleChange}
          className="block w-full rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
        />
      </div>
      <button className="max-w-md self-center rounded-lg border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black ">
        create
      </button>
    </form>
  );
};

const GroupList = () => {
  const { data, isLoading } = api.groups.getAll.useQuery();

  if (isLoading) return <span>loading...</span>;

  if (!data?.length) return <span></span>;

  return (
    <div className="flex min-w-full flex-col space-y-2">
      <h1 className="text-5xl font-bold text-amber-600">your groups</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.map((group, key) => (
          <div
            key={key}
            className="border-1 flex min-h-max flex-col justify-between space-y-2 overflow-ellipsis p-4 shadow-sm"
          >
            <div className="flex justify-between">
              <Link href={`/groups/${group.id}`}>
                <h4>{group.name}</h4>{" "}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Creator = () => {
  const [habitIsOpen, setHabitIsOpen] = useState(false);
  const [groupIsOpen, setGroupIsOpen] = useState(false);

  if (habitIsOpen) {
    return <HabitForm setIsOpen={setHabitIsOpen} />;
  }
  if (groupIsOpen) {
    return <GroupForm setIsOpen={setGroupIsOpen} />;
  } else {
    return (
      <div className="flex space-x-4">
        <Button onClick={() => setHabitIsOpen(true)} value="create new habit" />
        <Button onClick={() => setGroupIsOpen(true)} value="create new group" />
      </div>
    );
  }
};

const Habits: NextPage = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center space-y-2">
        <div className="w-4/5">
          <Creator />
        </div>
        <div className="w-4/5">
          <HabitList title="your habits" />
        </div>
        <div className="w-4/5">
          <GroupList />
        </div>
      </main>
    </>
  );
};

export default Habits;
