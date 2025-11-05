"use client";

import { ClerkProvider } from "@clerk/nextjs";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <header>
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <Button>Sign up</Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <Link href={"/"}>Dashboard</Link>
        </SignedIn>
      </header>

      {children}
    </ClerkProvider>
  );
}
