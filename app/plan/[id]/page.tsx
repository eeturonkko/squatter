"use client";
import { useParams } from "next/navigation";

function WorkoutPlanPage() {
  // Get the plan ID from the URL parameters
  const { id } = useParams<{ id: string }>();
  return <div>WorkoutPlanPage with id: {id}</div>;
}

export default WorkoutPlanPage;
