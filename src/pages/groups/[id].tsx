import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, HabitForm, HabitList } from "~/components";
import { api } from "~/utils/api";
import { ShareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const Creator = ({ groupId }: { groupId: string }) => {
  const [habitIsOpen, setHabitIsOpen] = useState(false);

  if (habitIsOpen) {
    return <HabitForm setIsOpen={setHabitIsOpen} groupId={groupId} />;
  } else {
    return (
      <div className="flex space-x-4">
        <Button onClick={() => setHabitIsOpen(true)} value="create new habit" />
      </div>
    );
  }
};


const HabitPage: NextPage = () => {
  const router = useRouter();
  const ctx = api.useContext();
  const id = router.query.id as string | undefined;
  const { data: group, isLoading } = api.groups.getOne.useQuery(id);
  const { data: groupUser } = api.groupUsers.getOne.useQuery(id);
  const { mutate: joinGroup } = api.groupUsers.create.useMutation({
    onSuccess: () => {
      void ctx.groupUsers.invalidate();
    },
  });
  const { mutate: leaveGroup } = api.groupUsers.delete.useMutation({
    onSuccess: () => {
      toast.success("left group")
      void ctx.groupUsers.invalidate();
      router.back()
    },
  })

  const { isSignedIn } = useAuth();

  if (isLoading) return <span>loading...</span>;
  if (!group) return <span>oops looks like this groups does not exist</span>;

  if (!groupUser) {
    return (
      <main className="flex min-h-screen min-w-full flex-col items-center justify-center space-y-2 ">
        <div id="header" className="flex flex-col">
          <h2 className="text-5xl font-bold text-amber-600">
            you have been invited to: {group?.name}
          </h2>
          <h3 className="text-base font-light text-amber-600">
            {group?.description}
          </h3>
        </div>
        {!isSignedIn ? (
          <SignInButton mode="modal" afterSignInUrl="/home">
            <button className="max-w-md rounded-lg border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black">
              create account to continue
            </button>
          </SignInButton>
        ) : (
          <Button
            value="join group"
            onClick={() => {
              joinGroup(group.id);
            }}
          />
        )}
      </main>
    );
  }

  return (
    <>
      <main className="flex min-h-screen min-w-full flex-col items-center space-y-2 ">
        {groupUser?.role === "ADMIN" ? (
          <div className="w-4/5">
            <Creator groupId={group.id} />
          </div>
        ) : null}
        <div id="header" className="flex w-4/5 flex-col">
          <div className="flex items-baseline justify-between space-x-4">
            <h2 className="text-5xl font-bold text-amber-600">{group?.name}</h2>
            <div className="flex">
              <ShareIcon
                className="h-6 w-6 hover:cursor-pointer"
                onClick={() => {
                  navigator.clipboard
                    .writeText(location.origin + router.asPath)
                    .then(() => {
                      toast.success("copied link to clipboard");
                    })
                    .catch(() => console.error("error copying to clipboard"));
                }}
              />
              <TrashIcon className="h-6 w-6 hover:cursor-pointer" onClick={() => {
                if (id) {
                  leaveGroup(id)
                }
              }} />
            </div>
          </div>
          <h3 className="text-base font-light text-amber-600">
            {group?.description}
          </h3>
        </div>
        <div id="creator"></div>
        <div id="habitList" className="flex w-4/5 flex-col">
          <HabitList groupId={id} />
        </div>
      </main>
    </>
  );
};

export default HabitPage;
