import { Frequency, type Habit, SharingOptions } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import {
  type ChangeEvent,
  type SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { Button } from "~/components";
import { api } from "~/utils/api";

const EditHabitPage: NextPage = () => {
  const router = useRouter();
  const ctx = api.useContext();
  const { id } = router.query;
  const { data: habit } = api.habits.getOne.useQuery(id as string);
  const { mutate: update, isLoading } = api.habits.update.useMutation({
    onSuccess: () => {
      void ctx.habits.invalidate();
      toast.dismiss();
      toast.success("updated habit");
    },
    onMutate: () => {
      toast.loading("updating...");
    },
  });
  const [form, setForm] = useState<
    Omit<Habit, "id" | "created_at" | "updated_at">
  >({
    sharingOptions: "FRIENDS",
    amount: 0,
    frequency: "DAY",
    groupId: habit?.groupId === undefined ? null : habit?.groupId,
    task: "",
    userId: null,
  });

  useEffect(() => {
    if (habit) {
      setForm({ ...habit });
    }
  }, [habit]);

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
    <>
      <div className="flex min-h-screen min-w-full flex-col items-center space-y-2 ">
        <div className="flex w-4/5 justify-between">
          <h4 className="text-5xl font-bold text-amber-600">edit</h4>{" "}
        </div>
        <div className="flex w-4/5 flex-col">
          <form
            className="flex flex-col items-start gap-4 p-4 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              update({
                ...form,
                id: id as string,
              });
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
            </div>
            <div className="flex min-w-full items-baseline space-x-6">
              <label className="block min-w-max text-sm font-medium leading-6 text-gray-900">
                task
              </label>
              <input
                id="task"
                name="task"
                value={form.task}
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
                value={form.amount}
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
                value={form.frequency}
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
            {habit?.groupId ? null : (
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
                        defaultChecked={habit?.sharingOptions === option}
                      />
                      <label htmlFor={option}>
                        {option.toLocaleLowerCase()}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button
              onClick={() => {
                console;
              }}
              value="update"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default EditHabitPage;
