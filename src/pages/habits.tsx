import { type NextPage } from "next";

const Habits: NextPage = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="min-w-full border-b border-gray-900/10 p-2">
          <form className="flex flex-col items-start">
            <div>
              <h2 className="text-base leading-7">Create a new Habit</h2>
            </div>
            <div className="flex items-baseline space-x-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Habit
              </label>
              <div className="mt-2">
                <input
                  id="habit"
                  name="habit"
                  type="text"
                  autoComplete="habit"
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="flex items-baseline space-x-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Amount
              </label>
              <div className="mt-2">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  autoComplete="amount"
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="flex items-baseline space-x-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Time
              </label>
              <div className="mt-2">
                <input
                  id="Time"
                  name="Time"
                  type="string"
                  autoComplete="Time"
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="flex items-baseline space-x-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Sharing options
              </label>
              <div className="mt-2">
                <input
                  id="Sharing"
                  name="Sharing"
                  type="string"
                  autoComplete="Sharing"
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <button className="max-w-md rounded-lg border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black">
              save
            </button>
          </form>
        </div>
        <div>show your habits</div>
      </main>
    </>
  );
};

export default Habits;
