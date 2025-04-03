"use client";

import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Dumbbell, ArrowRight, Clock } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";

function CreatePlanPage() {
  const workoutPlans = useQuery(api.workoutplan.getWorkoutPlansByUserId);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
      </header>

      <main>
        {workoutPlans === undefined ? (
          <LoadingState />
        ) : workoutPlans.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutPlans.map((plan) => (
              <Link
                href={`/plan/${plan._id}?id=${plan._id}`}
                key={plan._id}
                className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              >
                <Card className="h-full transition-all hover:shadow-md border-2 hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant="outline"
                        className="px-3 py-1 font-medium"
                      >
                        <Dumbbell className="h-3.5 w-3.5 mr-1" />
                        Workout Plan
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        aria-label="Created date"
                      >
                        {formatDistanceToNow(new Date(plan._creationTime), {
                          addSuffix: true,
                        })}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-xl group-hover:text-primary transition-colors">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px]">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(plan._creationTime), "MMM d, yyyy")}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto group-hover:bg-primary/10 transition-colors"
                        aria-label={`View details for ${plan.name}`}
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
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

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="h-full">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-7 w-3/4 mt-4" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Skeleton className="h-9 w-28 ml-auto" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default CreatePlanPage;
