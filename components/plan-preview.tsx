import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface WorkoutDay {
  day: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: string;
  }[];
}

interface PlanPreviewProps {
  title?: string;
  subtitle?: string;
  planName?: string;
  planDescription?: string;
  duration?: string;
  progress?: number;
  workoutDays?: WorkoutDay[];
  ctaText?: string;
  ctaHref?: string;
}

export function PlanPreview({
  title = "Your Personalized Plan",
  subtitle = "See how Squatter creates a plan tailored to your goals",
  planName = "5/3/1 Squat Progression",
  planDescription = "A 12-week progressive overload program focused on building squat strength",
  duration = "12 weeks",
  progress = 35,
  workoutDays = [
    {
      day: "Monday",
      exercises: [
        { name: "Back Squat", sets: 5, reps: 5, weight: "75% of 1RM" },
        { name: "Romanian Deadlift", sets: 3, reps: 8 },
        { name: "Leg Press", sets: 3, reps: 10 },
      ],
    },
    {
      day: "Wednesday",
      exercises: [
        { name: "Front Squat", sets: 3, reps: 8, weight: "65% of 1RM" },
        { name: "Walking Lunges", sets: 3, reps: 12 },
        { name: "Leg Extensions", sets: 3, reps: 12 },
      ],
    },
    {
      day: "Friday",
      exercises: [
        { name: "Back Squat", sets: 3, reps: 3, weight: "85% of 1RM" },
        { name: "Bulgarian Split Squats", sets: 3, reps: 8 },
        { name: "Leg Curls", sets: 3, reps: 12 },
      ],
    },
  ],
  ctaText = "Create Your Own Plan",
  ctaHref = "/create-plan",
}: PlanPreviewProps) {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{planName}</CardTitle>
                  <CardDescription className="mt-2">
                    {planDescription}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{duration}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workoutDays.map((day, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">{day.day}</h3>
                    <div className="space-y-3">
                      {day.exercises.map((exercise, exIndex) => (
                        <div
                          key={exIndex}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Dumbbell className="h-4 w-4 text-primary" />
                            <span>{exercise.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.weight && ` @ ${exercise.weight}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={ctaHref}>
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
