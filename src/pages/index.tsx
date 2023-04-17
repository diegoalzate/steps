import {
  RedirectToSignIn,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  const { isSignedIn } = useUser();

  return (
    <>
      <Head>
        <title>Steps</title>
        <meta name="description" content="One step at a time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col gap-4">
        <div className="self-end p-1">
          {!isSignedIn ? (
            <SignInButton mode="modal" afterSignInUrl="/habits">
              <button className="max-w-md rounded-lg border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black">
                Sign in
              </button>
            </SignInButton>
          ) : (
            <SignOutButton />
          )}
        </div>
        <div className="flex grow flex-col items-center justify-center gap-12">
          <h2 className="text-5xl font-bold text-amber-600">
            track habits with friends
          </h2>
          {!isSignedIn ? (
            <SignInButton mode="modal" afterSignInUrl="/habits">
              <button className="max-w-md rounded-lg border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black">
                give it a try!
              </button>
            </SignInButton>
          ) : (
            <Link
              href={"/habits"}
              className="max-w-md rounded-lg border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black"
            >
              give it a try!
            </Link>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
