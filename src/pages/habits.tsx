import { type NextPage } from "next";
import { Frequency, type Habit, SharingOptions } from "@prisma/client";
import dayjs from "dayjs";
import { api } from "~/utils/api";
import { type ChangeEvent, useState, SyntheticEvent } from "react";
import { SignOutButton } from "@clerk/nextjs";

const COMPLETED_HABIT = "🟢";
const PENDING_HABIT = "⚪";

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
      onSubmit={() => mutate({ ...form } as Habit)}
    >
      <div>
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

const HabitList = () => {
  const { data, isLoading } = api.habits.getAll.useQuery();

  if (isLoading) return <span>loading...</span>;

  if (!data) return <span>no data</span>;

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

  const lastRelevantEntriesDate = (habit: Habit) => {
    if (habit.frequency === "DAY") {
      const now = dayjs();
      const startOfDay = now.startOf("day");
      return startOfDay.toISOString();
    } else if (habit.frequency === "WEEK") {
      const now = dayjs();
      const startOfWeek = now.startOf("week");
      return startOfWeek.toISOString();
    } else {
      const now = dayjs();
      const startOfMonth = now.startOf("month");
      return startOfMonth.toISOString();
    }
  };

  const { data, isLoading } = api.habitEntries.getEntries.useQuery({
    habitId: habit.id,
    createdAfterDate: lastRelevantEntriesDate(habit),
  });

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
        <h4>{habit.task}</h4>
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
