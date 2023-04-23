import { SignOutButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const HabitPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const { data: group } = api.groups.getOne.useQuery(id);
  return (
    <>
      <main className="flex min-h-screen min-w-full flex-col items-center space-y-2 ">
        <div className="self-end p-4">
          <SignOutButton />
        </div>
        <div className="flex w-4/5 flex-col">
          <h2 className="text-5xl font-bold text-amber-600">{group?.name}</h2>{" "}
          <h3 className="text-base font-light text-amber-600">
            {group?.description}
          </h3>
        </div>
      </main>
    </>
  );
};

export default HabitPage;
