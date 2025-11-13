import { IconMoodEmpty } from "@tabler/icons-react";

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
      <span className="bg-muted/60 text-muted-foreground flex size-12 items-center justify-center rounded-xl">
        <IconMoodEmpty className="size-6" />
      </span>
      <div className="space-y-1">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
