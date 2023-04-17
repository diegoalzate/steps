import { type NextPage } from "next";
import { Frequency, type Habit, SharingOptions } from "@prisma/client";
import * as dayjs from "dayjs";
import { api } from "~/utils/api";
import { type ChangeEvent, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";

const HabitForm = () => {
  const ctx = api.useContext();
  const [form, setForm] =
    useState<Omit<Habit, "id" | "created_at" | "updated_at">>();
  const { mutate } = api.habits.create.useMutation({
    onSuccess: () => {
      void ctx.habits.invalidate();
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
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
      onSubmit={() => mutate({ ...form } as Habit)}
    >
      <div>
        <h2 className="text-base leading-7">Create a new Habit</h2>
      </div>
      <div className="flex min-w-full items-baseline space-x-6">
        <label className="block min-w-max text-sm font-medium leading-6 text-gray-900">
          Task
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
          Amount
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
          Frequency
        </label>
        <select
          name="frequency"
          id="frequency"
          onChange={handleChange}
          className="block rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
        >
          {Object.values(Frequency).map((frequency) => (
            <option value={frequency} key={frequency}>
              {frequency.toLocaleLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="flex min-w-full items-baseline space-x-6">
        <label className="block min-w-max text-sm font-medium leading-6 text-gray-900">
          Sharing options
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
        save
      </button>
    </form>
  );
};

const HabitList = () => {
  const { data, isLoading } = api.habits.getAll.useQuery();

  if (isLoading) return <span>is loading...</span>;

  if (!data) return <span>try again later...</span>;

  return (
    <div className="flex min-w-full flex-col space-y-2">
      <h1 className="text-5xl font-bold text-amber-600">your habits</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.map((habit, key) => (
          <HabitCard key={key} habit={habit} />
        ))}
      </div>
    </div>
  );
};

const HabitCard = ({ habit }: { habit: Habit }) => {
  const ctx = api.useContext();
  const { data, isLoading } = api.habitEntries.getEntries.useQuery(habit.id);
  const { mutate } = api.habitEntries.create.useMutation({
    onSuccess: () => {
      void ctx.habitEntries.getEntries.invalidate();
    },
  });

  if (isLoading) return <span>is loading...</span>;

  if (!data) return <span>try again later...</span>;

  // get habit entries
  // if daily habit get entries from this week
  // if weekly or monthly habit get entries from this month

  return (
    <div className="border-1 min-h-max flex-col space-y-2 rounded-sm p-4 shadow-sm">
      <div className="flex justify-between">
        <h4>{habit.task}</h4>
        <button
          onClick={() => mutate(habit.id)}
          className="max-w-md rounded-full border-2 border-amber-600 bg-amber-600 p-1 text-slate-200 hover:bg-slate-200 hover:text-black"
        >
          +
        </button>
      </div>
      <span>
        {data.length}/{habit.amount}
      </span>
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
        <div className="w-4/5">
          <HabitForm />
        </div>
        <div className="w-4/5">{<HabitList />}</div>
      </main>
    </>
  );
};

export default Habits;
