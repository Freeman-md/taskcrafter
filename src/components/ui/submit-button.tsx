// components/submit-button.tsx
"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

interface SubmitButtonProps
  extends React.ComponentProps<typeof Button>,
    VariantProps<typeof buttonVariants> {
  pendingText?: React.ReactNode;
  defaultText?: React.ReactNode;
  children?: React.ReactNode;
}

export function SubmitButton({
  pendingText = "Saving...",
  defaultText = "Save",
  children,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const content = pending 
    ? pendingText 
    : (children ?? defaultText); 

  return (
    <Button
      type="submit"
      disabled={pending || props.disabled}
      {...props}
    >
      {content}
    </Button>
  );
}