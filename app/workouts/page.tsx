"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

const trackingPeriodSchema = z.object({
  period_name: z.string().min(1, "Period name is required"),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date().optional(),
});

type TrackingPeriodFormValues = z.infer<typeof trackingPeriodSchema>;

export default function WorkoutsPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const trackingPeriods =
    useQuery(api.exercisesAndTrackingPeriods.getTrackingPeriodsByUserId) || [];

  const createTrackingPeriod = useMutation(
    api.exercisesAndTrackingPeriods.createNewTrackingPeriod,
  );

  const form = useForm<TrackingPeriodFormValues>({
    resolver: zodResolver(trackingPeriodSchema),
    defaultValues: {
      period_name: "",
      start_date: new Date(),
      end_date: undefined,
    },
  });

  const onSubmit = async (data: TrackingPeriodFormValues) => {
    await createTrackingPeriod({
      period_name: data.period_name,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date?.toISOString(),
    });

    form.reset({
      period_name: "",
      start_date: new Date(),
      end_date: undefined,
    });

    setIsOpen(false);
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workout Tracking Periods</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Tracking Period
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tracking Period</DialogTitle>
              <DialogDescription>
                Add a new period to track your workouts.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="period_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Period Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Summer Bulk 2025"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, "PPP")
                                : "Select date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, "PPP")
                                : "Select date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => {
                              const startDate = form.getValues("start_date");
                              return startDate ? date < startDate : false;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Leave empty for ongoing tracking periods
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Create Period</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {trackingPeriods.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No tracking periods yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first tracking period to start logging workouts
          </p>
          <Button onClick={() => setIsOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Tracking Period
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trackingPeriods.map((period: Doc<"trackingPeriods">) => (
            <Card
              key={period._id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/workouts/${period._id}`)}
            >
              <CardHeader>
                <CardTitle>{period.period_name}</CardTitle>
                <CardDescription>
                  Started: {format(new Date(period.start_date), "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {period.end_date ? (
                  <p className="text-sm text-muted-foreground">
                    Ends: {format(new Date(period.end_date), "PPP")}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Ongoing</p>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/workouts/${period._id}`);
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
