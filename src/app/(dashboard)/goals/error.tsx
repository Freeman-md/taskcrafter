"use client"

import ErrorState from "@/components/ui/error-state";

type GoalsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GoalsError({ error, reset }: GoalsErrorProps) {
  return (
    <ErrorState
      error={error}
      reset={reset}
      title="Goals Data Unavailable"
    />
  );
}