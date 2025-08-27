import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";

const HomePage = () => {
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
