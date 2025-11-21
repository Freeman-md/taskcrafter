import { getGoalById } from "@/features/goals/data/get-goal-by-id";
import { Goal } from "@prisma/client";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: Goal["id"];
  }>;
}) {
  const { id } = await params;
  const goal = await getGoalById(id);

  console.log(goal);
  return (
    <>
      <div>This is the goals page with id: {id}</div>
    </>
  );
}
