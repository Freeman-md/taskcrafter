import EmptyState from "@/components/ui/empty-state";
import GoalCard from "@/features/goals/components/goal-card";
import { getGoals } from "@/features/goals/data/get-goals";

export default async function Page() {
  const goals = await getGoals();

  if (!goals || goals.length === 0) {
    return (
      <EmptyState
        title="No Goals Found"
        description="Start planning your next objective to see your goal cards appear here."
      />
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6">
        Your Goal Plans ({goals.length})
      </h1>
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </main>
  );
}
