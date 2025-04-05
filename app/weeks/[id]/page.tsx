"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Dumbbell, Scale, Trash2 } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schema for editing a week
const weekFormSchema = z.object({
  name: z.string().min(1, "Week name is required"),
  target: z.enum(["bulk", "cut"], {
    required_error: "Please select a target type",
  }),
});

type WeekFormValues = z.infer<typeof weekFormSchema>;

export default function WeekPage() {
  const router = useRouter();
  const params = useParams();
  const weekId = params.id as Id<"week">;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const week = useQuery(api.weeksAndWeight.getWeekById, { id: weekId });
  const updateWeekById = useMutation(api.weeksAndWeight.updateWeekById);
  const deleteWeekById = useMutation(api.weeksAndWeight.deleteWeekById);
  const weights = useQuery(api.weeksAndWeight.getDailyWeightsByWeekId, {
    weekId,
  });

  // Reset form when week data changes
  const form = useForm<WeekFormValues>({
    resolver: zodResolver(weekFormSchema),
    defaultValues: {
      name: "",
      target: "bulk",
    },
    // Use type assertion to ensure the target is of the correct type
    values: week
      ? {
          name: week.name,
          target:
            week.target === "bulk" || week.target === "cut"
              ? week.target
              : ("bulk" as const),
        }
      : undefined,
  });

  const onSubmit = (data: WeekFormValues) => {
    if (!week) return;

    updateWeekById({
      id: weekId,
      name: data.name,
      target: data.target,
      isArchived: week.isArchived,
    });

    setIsDialogOpen(false);
  };

  const onDelete = async () => {
    if (!week) return;
    await deleteWeekById({ id: weekId });
    router.push("/weight");
  };

  if (!week) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  const chartData =
    weights?.map((entry) => ({
      date: format(new Date(entry.date), "MMM dd"),
      weight: entry.weight,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{week.name}</h1>
          <p className="text-muted-foreground flex items-center gap-1">
            {week.target === "bulk" ? (
              <>
                <Dumbbell className="h-4 w-4 text-emerald-500" />
                <span>Bulk Week</span>
              </>
            ) : (
              <>
                <Scale className="h-4 w-4 text-purple-500" />
                <span>Cut Week</span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit Week</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Week</DialogTitle>
                <DialogDescription>
                  Update the details for this tracking week.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Week Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Summer Cut Week 1"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Give your week a descriptive name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="target"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a target type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bulk">
                              <div className="flex items-center">
                                <Dumbbell className="h-4 w-4 text-emerald-500 mr-2" />
                                <span>Bulk</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="cut">
                              <div className="flex items-center">
                                <Scale className="h-4 w-4 text-purple-500 mr-2" />
                                <span>Cut</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Are you bulking (gaining weight) or cutting (losing
                          weight)?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Delete confirmation dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Week
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  week &quot;{week.name}&quot; and all associated weight
                  entries.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 auto-rows-fr">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
            <CardDescription>
              Track your weight changes throughout this week
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {weights && weights.length > 0 ? (
              <div className="h-[300px] w-full flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke={week.target === "bulk" ? "#10b981" : "#8b5cf6"}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground flex-1 flex items-center justify-center">
                No weight entries yet. Start tracking your weight to see
                progress.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Weight Log</CardTitle>
            <CardDescription>Your recorded weight entries</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {weights && weights.length > 0 ? (
              <div className="space-y-2 h-full overflow-auto">
                {weights.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div className="font-medium">
                      {format(new Date(entry.date), "MMMM d, yyyy")}
                    </div>
                    <div className="text-lg font-bold">{entry.weight} kg</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground flex-1 flex items-center justify-center">
                No weight entries yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>
              Your weight statistics for this week
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {weights && weights.length > 0 ? (
              <div className="space-y-2 h-full overflow-auto">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div className="font-medium">Starting Weight</div>
                  <div className="text-lg font-bold">
                    {weights[0].weight} kg
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div className="font-medium">Average Weight</div>
                  <div className="text-lg font-bold">
                    {(
                      weights.reduce((acc, entry) => acc + entry.weight, 0) /
                      weights.length
                    ).toFixed(2)}{" "}
                    kg
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div className="font-medium">Current Weight</div>
                  <div className="text-lg font-bold">
                    {weights[weights.length - 1].weight} kg
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground flex-1 flex items-center justify-center">
                No weight entries yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
