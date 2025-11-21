"use client";

import { IconLoader2 } from "@tabler/icons-react";

type LoadingStateProps = {
  message?: string; 
  subText?: string; 
  iconColorClass?: string;
};

export default function LoadingState({
  message = "Loading content...",
  subText = "Please wait a moment.",
  iconColorClass = "text-primary",
}: LoadingStateProps) {

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[150px]">
      <div className="flex items-center gap-3 text-muted-foreground">
        <IconLoader2 className={`size-6 animate-spin ${iconColorClass}`} />
        <span className="text-lg font-medium">{message}</span>
      </div>
      {subText && (
        <p className="text-sm text-gray-500 mt-2">{subText}</p>
      )}
    </div>
  );
}