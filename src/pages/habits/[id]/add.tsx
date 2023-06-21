import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { toast } from "react-hot-toast";
import { Button } from "~/components";
import { api } from "~/utils/api";

const EMOJI_FEELINGS = ["😭", "😢", "😐", "🙂", "😄"];

const EditHabitPage: NextPage = () => {
  const router = useRouter();
  const ctx = api.useContext();
  const { id } = router.query;
  const { data: habit } = api.habits.getOne.useQuery(id as string);
  const { mutate: create } = api.habitEntries.create.useMutation({
    onSuccess: () => {
      void ctx.habits.invalidate();
      toast.dismiss();
      toast.success("added habit");
    },
    onMutate: () => {
      toast.loading("adding...");
    },
  });
  const [form, setForm] = useState<{
    feeling?: number;
    description?: string;
  }>();

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | SyntheticEvent<HTMLSelectElement, Event>
  ) => {
    const { name, value } = e.currentTarget;
    if (name === "feeling") {
      setForm({ ...form, [name]: +value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <>
      <div className="flex min-h-screen min-w-full flex-col items-center space-y-2 ">
        <div className="flex w-4/5 justify-between">
          <h4 className="text-5xl font-bold text-amber-600">
            {habit?.task ?? "add"}
          </h4>
        </div>
        <div className="flex w-4/5 flex-col">
          <form
            className="flex flex-col items-start gap-4 p-4 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              if (habit?.id) {
                create({
                  habitId: habit?.id,
                  ...form,
                });
              }
            }}
          >
            <div className="flex min-w-full items-baseline space-x-6">
              <label className="block min-w-max text-sm font-medium leading-6 text-gray-900">
                description
              </label>
              <input
                id="description"
                name="description"
                value={form?.description ?? ""}
                type="text"
                autoComplete="off"
                placeholder="ex: did more than I expected today"
                onChange={handleChange}
                className="block w-full rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
              />
            </div>
            <div className="flex min-w-full items-baseline space-x-6">
              <label className="block  min-w-max text-sm font-medium leading-6 text-gray-900">
                feeling
              </label>
              <select
                name="frequency"
                id="frequency"
                value={form?.feeling}
                onChange={handleChange}
                className="block rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
              >
                <option selected disabled>
                  select feeling
                </option>
                {EMOJI_FEELINGS.map((emoji, index) => (
                  <option value={index + 1} key={index}>
                    {emoji}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => {
                console;
              }}
              value="save"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default EditHabitPage;
