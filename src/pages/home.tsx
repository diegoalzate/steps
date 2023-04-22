import { type NextPage } from "next";
import {
  Frequency,
  type Habit,
  SharingOptions,
  type Group,
} from "@prisma/client";
import { api } from "~/utils/api";
import { type ChangeEvent, useState, type SyntheticEvent } from "react";
import { SignOutButton } from "@clerk/nextjs";
import HabitList from "~/Components/HabitList";
import { useRouter } from "next/router";
import Link from "next/link";

const HabitCreator = () => {
  const [isOpen, setIsOpen] = useState(false);

  return isOpen ? (
    <HabitForm setIsOpen={setIsOpen} />
  ) : (
    <button
      onClick={() => setIsOpen(true)}
      className="max-w-lg self-center rounded-3xl border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black "
    >
      create new habit
    </button>
  );
};

const HabitForm = ({ setIsOpen }: { setIsOpen: (bool: boolean) => void }) => {
  const ctx = api.useContext();
  const [form, setForm] =
    useState<Omit<Habit, "id" | "created_at" | "updated_at">>();
  const { mutate } = api.habits.create.useMutation({
    onSuccess: () => {
      void ctx.habits.invalidate();
      setIsOpen(false);
      setForm(undefined);
    },
  });

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | SyntheticEvent<HTMLSelectElement, Event>
  ) => {
    const { name, value } = e.currentTarget;
    if (name === "amount") {
      setForm({ ...form, [name]: +value } as Habit);
    } else {
      setForm({ ...form, [name]: value } as Habit);
    }
  };

  return (
    <form
      className="flex flex-col items-start gap-4 p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        mutate({ ...form } as Habit);
      }}
    >
      <div className="flex min-w-full justify-between">
        <p className="text-3xl font-bold text-amber-600">
          {!!form?.sharingOptions
            ? form?.sharingOptions === "FRIENDS"
              ? "🫂: "
              : "👤: "
            : null}
          {form?.task} {form?.amount}{" "}
          {form?.frequency
            ? `times a 
      ${form?.frequency.toLocaleLowerCase()}`
            : ""}
        </p>
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
          task
        </label>
        <input
          id="task"
          name="task"
          type="text"
          autoComplete="off"
          placeholder="ex: meditate every day at 3pm at home"
          onChange={handleChange}
          className="block w-full rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
        />
      </div>
      <div className="flex min-w-full items-baseline space-x-6">
        <label className="block min-w-max text-sm font-medium leading-6 text-gray-900">
          amount
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          onChange={handleChange}
          placeholder="3"
          className=" block w-full rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
        />
      </div>
      <div className="flex min-w-full items-baseline space-x-6">
        <label className="block  min-w-max text-sm font-medium leading-6 text-gray-900">
          frequency
        </label>
        <select
          name="frequency"
          id="frequency"
          onChange={handleChange}
          className="block rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
        >
          <option selected disabled>
            select frequency
          </option>
          {Object.values(Frequency).map((frequency) => (
            <option value={frequency} key={frequency}>
              {frequency.toLocaleLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="flex min-w-full items-baseline space-x-6">
        <label className="block min-w-max text-sm font-medium leading-6 text-gray-900">
          sharing options
        </label>
        <div className="flex flex-col gap-2">
          {Object.values(SharingOptions).map((option) => (
            <div key={option} className="flex space-x-2">
              <input
                type="radio"
                name="sharingOptions"
                id={option}
                value={option}
                key={option}
                onChange={handleChange}
              />
              <label htmlFor={option}>{option.toLocaleLowerCase()}</label>
            </div>
          ))}
        </div>
      </div>
      <button className="max-w-md self-center rounded-lg border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black ">
        promise
      </button>
    </form>
  );
};

const GroupCreator = () => {
  const [isOpen, setIsOpen] = useState(false);
  return isOpen ? (
    <GroupForm setIsOpen={setIsOpen} />
  ) : (
    <button
      onClick={() => setIsOpen(true)}
      className="max-w-lg self-center rounded-3xl border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black "
    >
      create new group
    </button>
  );
};

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

const Habits: NextPage = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center space-y-2">
        <div className="self-end p-4">
          <SignOutButton />
        </div>
        <div className="flex w-4/5 space-x-4">
          <HabitCreator />
          <GroupCreator />
        </div>
        <div className="w-4/5">{<HabitList />}</div>
        <div className="w-4/5">{<GroupList />}</div>
      </main>
    </>
  );
};

export default Habits;
