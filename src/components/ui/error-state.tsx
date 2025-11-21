"use client";

import { useEffect } from "react";

type ErrorStateProps = {
  error: Error & { digest?: string };
  reset?: () => void;
  title?: string;
};

export default function ErrorState({
  error,
  reset,
  title = "Data Load Failed",
}: ErrorStateProps) {
  useEffect(() => {
    console.error(`ERROR: ${title}`, error);
  }, [error, title]);

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg min-h-[300px]">
      <h2 className="text-2xl font-bold text-red-700">🚨 {title}</h2>
      <p className="text-gray-600 mt-2">
        Could not load the requested section.
      </p>
      <p className="text-sm italic mt-1">Details: {error.message}</p>

      {reset && (
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
        >
          Click to Retry
        </button>
      )}
    </div>
  );
}