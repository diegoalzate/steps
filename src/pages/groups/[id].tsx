import { SignOutButton } from "@clerk/nextjs";
import { NextPage } from "next";
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
        <div className="flex w-4/5 justify-between">
          <h4 className="text-5xl font-bold text-amber-600">{group?.name}</h4>{" "}
        </div>
      </main>
    </>
  );
};

export default HabitPage;
