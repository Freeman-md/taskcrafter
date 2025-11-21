import { IconMoodEmpty } from "@tabler/icons-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  IconComponent?: React.ElementType; 
  iconBgClass?: string; 
};

export default function EmptyState({
  title = "Nothing to See Here",
  description = "Content will appear once data is available or a process is completed.",
  IconComponent = IconMoodEmpty,
  iconBgClass = "bg-muted/60",
}: EmptyStateProps) {
  
  const Icon = IconComponent;

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground min-h-[300px]">
      <span className={`${iconBgClass} text-muted-foreground flex size-14 items-center justify-center rounded-xl`}>
        <Icon className="size-7" />
      </span>
      <div className="space-y-1">
        <h3 className="text-xl font-medium text-foreground">{title}</h3>
        <p className="text-sm max-w-sm">{description}</p>
      </div>
    </div>
  );
}