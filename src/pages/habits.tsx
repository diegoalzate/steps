import { type NextPage } from "next";
import { Frequency, SharingOptions } from "@prisma/client";

const HabitForm = () => {
  return (
    <form className="flex flex-col items-start gap-4 p-4 shadow-sm">
      <div>
        <h2 className="text-base leading-7">Create a new Habit</h2>
      </div>
      <div className="flex min-w-full items-baseline space-x-6">
        <label className="block min-w-max text-sm font-medium leading-6 text-gray-900">
          Habit
        </label>
        <input
          id="habit"
          name="habit"
          type="text"
          placeholder="ex: I will meditate every day at 3pm at home"
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
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
          placeholder="3"
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
        />
      </div>
      <div className="flex min-w-full items-baseline space-x-6">
        <label className="block  min-w-max text-sm font-medium leading-6 text-gray-900">
          Frequency
        </label>
        <select
          name="frequencySelect"
          id="frequencySelect"
          className="block rounded-md border-0 px-2 py-1.5 text-gray-900 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
        >
          {Object.values(Frequency).map((frequency) => (
            <option value="frequency" key={frequency}>
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
                name="sharingOption"
                id={option}
                value={option}
                key={option}
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
  return <h1>your habits</h1>;
};
const Habits: NextPage = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-4/5">
          <HabitForm />
        </div>
        <div>{<HabitList />}</div>
      </main>
    </>
  );
};

export default Habits;
