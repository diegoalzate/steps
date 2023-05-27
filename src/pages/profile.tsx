import { SignedIn, UserProfile, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { type NextPage } from "next";

const ProfilePage: NextPage = () => {
    return (
        <div className="flex justify-center">
            <SignedIn>
                <UserProfile appearance={{
                    elements: {
                        headerTitle: "text-amber-600",
                        profileSectionPrimaryButton: "text-amber-600"
                    }
                }} />
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>
    );
};

export default ProfilePage;
