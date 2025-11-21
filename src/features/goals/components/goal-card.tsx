import { Goal } from "@prisma/client";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

type GoalCardProps = {
  goal: Goal;
};

export default function GoalCard({ goal }: GoalCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
      <h3 className="text-xl font-bold text-indigo-700">{goal.title}</h3>
      {goal.deadline && (
        <p className="text-sm text-gray-500 mt-1">
          <strong>Deadline:</strong> {dateFormatter.format(goal.deadline)}
        </p>
      )}
      <p className="text-gray-700 mt-3 line-clamp-2">{goal.summary}</p>
      <div className="mt-4 text-xs text-right text-gray-400">
        Goal ID: {goal.id.substring(0, 8)}...
      </div>
    </div>
  );
}
