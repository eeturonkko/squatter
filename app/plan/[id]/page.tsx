"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import WorkoutForm from "@/components/workout-form-modal";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

function WorkoutPlanPage() {
  const { id } = useParams<{ id: string }>();
  const workoutPlan = useQuery(api.workoutplan.getWorkoutPlanById, {
    id: id as Id<"workoutplan">,
  });
  const workouts = useQuery(api.workoutplan.getWorkoutsByWorkoutPlanId, {
    workoutPlanId: id as Id<"workoutplan">,
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {workoutPlan?.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {workoutPlan?.description}
          </p>
        </div>
        <WorkoutForm workoutPlanId={id} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Workouts</CardTitle>
          <CardDescription>
            All workouts in this plan. You can add, edit or delete workouts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workouts && workouts.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Weight</TableHead>
                    <TableHead>Reps</TableHead>
                    <TableHead>Week</TableHead>
                    <TableHead>Description</TableHead>

                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workouts.map((workout) => (
                    <TableRow key={workout._id}>
                      <TableCell>{workout.weight}</TableCell>
                      <TableCell>{workout.reps}</TableCell>
                      <TableCell className="font-medium">
                        {workout.week}
                      </TableCell>
                      <TableCell>{workout.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-muted-foreground mb-4">
                No workouts found for this plan
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default WorkoutPlanPage;
