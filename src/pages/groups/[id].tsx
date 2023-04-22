import { SignOutButton } from "@clerk/nextjs";
import { NextPage } from "next";
import { useRouter } from "next/router";

const HabitPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <main className="flex min-h-screen min-w-full flex-col items-center space-y-2 ">
        <div className="self-end p-4">
          <SignOutButton />
        </div>
        <div className="flex w-4/5 justify-between">
          <h4 className="text-5xl font-bold text-amber-600">{id}</h4>{" "}
        </div>
      </main>
    </>
  );
};

export default HabitPage;
