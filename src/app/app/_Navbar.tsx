"use client";

import Link from "next/link";
import {
  BookOpenIcon,
  BrainCircuit,
  FileSlidersIcon,
  SpeechIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClerk } from "@clerk/nextjs";

type NavbarProps = {
  user: {
    name: string;
    imageUrl: string;
  };
};

const navLinks = [
  { name: "Interviews", href: "interviews", Icon: SpeechIcon },
  { name: "Questions", href: "questions", Icon: BookOpenIcon },
  { name: "Resume", href: "resume", Icon: FileSlidersIcon },
];

const Navbar = ({ user }: NavbarProps) => {
  const { openUserProfile, signOut } = useClerk();

  const initials = (user?.name ?? "U N")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-header border-b">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="size-8 animate-pulse text-primary" />
          <span className="text-lg font-semibold tracking-tight">Landr</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="User menu" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user?.imageUrl} alt={user?.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuItem
                onClick={() => openUserProfile?.()}
                className="cursor-pointer"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut?.({ redirectUrl: "/" })}
                variant="destructive"
                className="cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
