import * as React from "react";

import { cn } from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30",
          "border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs",
          "transition-[color,box-shadow] outline-none",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
        ),

        plain_text: cn(
          "border-none bg-transparent shadow-none outline-none px-0 py-0",
          "h-auto min-h-0 w-auto",
          "text-base md:text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:ring-0 focus-visible:border-none",
          "selection:bg-primary selection:text-primary-foreground"
        ),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Input({
  className,
  variant,
  type,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({
          variant,
        }),
        className
      )}
      {...props}
    />
  );
}

export { Input };
