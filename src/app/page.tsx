import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";

const HomePage = async () => {
  const { userId } = await getCurrentUser({ allData: false });
  console.log("jobInfo table",{userId});
  return (
    <div>
      <div>
        <SignInButton />
        <UserButton />
      </div>
      <div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default HomePage;

