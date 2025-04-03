"use client";

import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Dumbbell, ArrowRight, Calendar } from "lucide-react";
import WorkoutFormDialog from "@/components/workoutplan-form-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function CreatePlanPage() {
  const workoutPlans = useQuery(api.workoutplan.getWorkoutPlansByUserId);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Workout Plans
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your personalized workout routines
          </p>
        </div>
        <WorkoutFormDialog />
      </div>

      {workoutPlans?.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlans?.map((plan) => (
            <Link
              href={`/plan/${plan._id}`}
              key={plan._id}
              className="block group"
            >
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Workout Plan
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 h-10">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Created {new Date(plan._creationTime).toLocaleDateString()}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto group-hover:bg-primary/10 transition-colors"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="w-full border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          <Dumbbell className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No workout plans yet</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          Create your first workout plan to start tracking your fitness journey.
          Customize exercises, sets, and reps to match your goals.
        </p>
        <WorkoutFormDialog />
      </CardContent>
    </Card>
  );
}

export default CreatePlanPage;
