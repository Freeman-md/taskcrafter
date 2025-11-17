import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const textareaVariants = cva("", {
  variants: {
    variant: {
      default:
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

      plain_text: cn(
        "border-none bg-transparent shadow-none outline-none px-0 py-0",
        "min-h-0 h-auto w-full",
        "text-base md:text-sm",
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        "focus-visible:ring-0 focus-visible:border-none",
        "resize-none rows-3"
      ),
    },
  },

  defaultVariants: {
    variant: "default",
  },
});

function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
