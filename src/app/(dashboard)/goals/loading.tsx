import LoadingState from "@/components/ui/loading-state";

export default function GoalsLoading() {
  return (
    <LoadingState 
      message="Building Goal Dashboard" 
      subText="Fetching your latest objectives and tasks..."
      color="purple-500"
    />
  );
}