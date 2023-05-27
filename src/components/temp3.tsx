import { Frequency, SharingOptions, type Habit } from "@prisma/client";
import { type ChangeEvent, type SyntheticEvent, useState } from "react";
import { api } from "~/utils/api";

const HabitForm = ({
  setIsOpen,
  groupId,
}: {
  setIsOpen: (bool: boolean) => void;
  groupId?: string;
}) => {
  const ctx = api.useContext();
  const [form, setForm] = useState<
    Omit<Habit, "id" | "created_at" | "updated_at">
  >({
    sharingOptions: "FRIENDS",
    amount: 0,
    frequency: "DAY",
    groupId: groupId === undefined ? null : groupId,
    task: "",
    userId: null,
  });

  const { mutate } = api.habits.create.useMutation({
    onSuccess: () => {
      void ctx.habits.invalidate();
      setIsOpen(false);
      setForm({
        sharingOptions: "FRIENDS",
        amount: 0,
        frequency: "DAY",
        groupId: groupId === undefined ? null : groupId,
        task: "",
        userId: null,
      });
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
      {groupId ? null : (
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
      )}
      <button className="max-w-md self-center rounded-lg border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black ">
        promise
      </button>
    </form>
  );
};

export default HabitForm;
