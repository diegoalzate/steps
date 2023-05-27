import { SignedIn, UserProfile, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { type NextPage } from "next";

const UserPage: NextPage = () => {
  return (
    <>
      <SignedIn>
        <UserProfile />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default UserPage;
