import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { ArrowLeftCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
import { DropdownMenu } from "~/components";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const currentYear = new Date().getFullYear();
  const { isSignedIn, signOut } = useAuth()
  const { user } = useUser()
  return (
    <>
      <header className="m-auto flex w-11/12 max-w-screen-xl justify-between py-8">
        <Link href="/home">
          <h1 className="text-2xl font-bold text-amber-600">steps</h1>
        </Link>
        {!isSignedIn ? (
          <SignInButton mode="modal" afterSignInUrl="/home">
            <button className="max-w-md rounded-lg border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black">
              sign in
            </button>
          </SignInButton>
        ) : (
          <DropdownMenu menuTitle={`@${user?.username ?? 'username'}`} options={[
            { title: 'profile', icon: UserIcon, link: '/profile' },
            { title: 'sign out', icon: ArrowLeftCircleIcon, onClick: () => { void signOut() } }
          ]} />
        )}
      </header>
      {/* Should be main, as it wraps the main page content, need to refactor other pages that use main too. */}
      {/* Check min-heigth: 100vh, I'd suggest, using calc(100vh - (nav and footer heights))*/}
      <div className="m-auto w-11/12 max-w-screen-xl">{children}</div>
      <footer className="m-auto w-11/12 max-w-screen-xl py-4 text-center">
        <p>steps © {currentYear}</p>
      </footer>
    </>
  );
};

export default Layout;
