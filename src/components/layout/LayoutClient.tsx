"use client";

import { ClerkProvider } from "@clerk/nextjs";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

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
      </header>

      {children}
    </ClerkProvider>
  );
}
