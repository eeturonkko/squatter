"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import type { TooltipProps } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  PlusCircle,
  Edit,
  Trash2,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
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
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

const exerciseSchema = z.object({
  exercise_name: z.string().min(1, "Exercise name is required"),
  exercise_description: z.string().optional(),
});

type ExerciseFormValues = z.infer<typeof exerciseSchema>;

const exerciseLogSchema = z.object({
  exerciseId: z.string().min(1, "Please select an exercise"),
  weight: z.coerce.number().positive("Weight must be greater than 0"),
  reps: z.coerce.number().int().positive("Reps must be a positive integer"),
  sets: z.coerce.number().int().positive("Sets must be a positive integer"),
});

type ExerciseLogFormValues = z.infer<typeof exerciseLogSchema>;

export default function WorkoutDetailPage() {
  const router = useRouter();
  const params = useParams();
  const periodId = params.id as Id<"trackingPeriods">;

  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isEditLogDialogOpen, setIsEditLogDialogOpen] = useState(false);
  const [currentEditLog, setCurrentEditLog] =
    useState<Doc<"exerciseLogs"> | null>(null);
  const [logToDelete, setLogToDelete] = useState<Id<"exerciseLogs"> | null>(
    null,
  );
  const [isEditPeriodDialogOpen, setIsEditPeriodDialogOpen] = useState(false);
  const [editPeriodForm, setEditPeriodForm] = useState({
    period_name: "",
    start_date: "",
    end_date: "",
  });

  const trackingPeriod = useQuery(
    api.exercisesAndTrackingPeriods.getTrackingPeriodById,
    { id: periodId },
  );
  const exercises =
    useQuery(api.exercisesAndTrackingPeriods.getExercisesByUserId) || [];
  const exerciseLogs =
    useQuery(api.exercisesAndTrackingPeriods.getExerciseLogsByUserId) || [];

  const createExercise = useMutation(
    api.exercisesAndTrackingPeriods.createNewExercise,
  );
  const createExerciseLog = useMutation(
    api.exercisesAndTrackingPeriods.createNewExerciseLog,
  );
  const deleteLogExercise = useMutation(
    api.exercisesAndTrackingPeriods.deleteLogExercise,
  );
  const updateExerciseLog = useMutation(
    api.exercisesAndTrackingPeriods.updateExerciseLog,
  );
  const updatePeriod = useMutation(
    api.exercisesAndTrackingPeriods.updateTrackingPeriod,
  );

  const periodLogs = exerciseLogs.filter(
    (log: Doc<"exerciseLogs">) => log.periodId === periodId,
  );

  const logsByExercise: Record<
    Id<"exercises">,
    { exercise: Doc<"exercises">; logs: Doc<"exerciseLogs">[] }
  > = exercises.reduce(
    (acc, exercise) => {
      const exerciseLogs = periodLogs
        .filter((log) => log.exerciseId === exercise._id)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

      if (exerciseLogs.length > 0) {
        acc[exercise._id] = {
          exercise,
          logs: exerciseLogs,
        };
      }

      return acc;
    },
    {} as Record<
      Id<"exercises">,
      { exercise: Doc<"exercises">; logs: Doc<"exerciseLogs">[] }
    >,
  );

  const exerciseForm = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      exercise_name: "",
      exercise_description: "",
    },
  });

  const logForm = useForm<ExerciseLogFormValues>({
    resolver: zodResolver(exerciseLogSchema),
    defaultValues: {
      exerciseId: "",
      weight: undefined,
      reps: undefined,
      sets: undefined,
    },
  });

  const onSubmitExercise = async (data: ExerciseFormValues) => {
    await createExercise({
      exercise_name: data.exercise_name,
      exercise_description: data.exercise_description || undefined,
    });

    exerciseForm.reset();
    setIsExerciseDialogOpen(false);
  };

  const onSubmitLog = async (data: ExerciseLogFormValues) => {
    await createExerciseLog({
      periodId,
      exerciseId: data.exerciseId as Id<"exercises">,
      weight: data.weight,
      reps: data.reps,
      sets: data.sets,
      created_at: new Date().toISOString(),
    });

    logForm.reset();
    setIsLogDialogOpen(false);
  };

  const deleteExerciseLog = async (logId: Id<"exerciseLogs">) => {
    setLogToDelete(logId);
  };

  const confirmDelete = async () => {
    if (logToDelete) {
      await deleteLogExercise({ id: logToDelete });
      setLogToDelete(null);
    }
  };

  const onSubmitEditLog = async (data: ExerciseLogFormValues) => {
    if (!currentEditLog) return;

    await updateExerciseLog({
      id: currentEditLog._id,
      periodId,
      exerciseId: data.exerciseId as Id<"exercises">,
      weight: data.weight,
      reps: data.reps,
      sets: data.sets,
      created_at: currentEditLog.created_at,
    });

    setCurrentEditLog(null);
    setIsEditLogDialogOpen(false);
  };

  const openEditDialog = (log: Doc<"exerciseLogs">) => {
    setCurrentEditLog(log);
    logForm.reset({
      exerciseId: log.exerciseId,
      weight: log.weight,
      reps: log.reps,
      sets: log.sets,
    });
    setIsEditLogDialogOpen(true);
  };

  const prepareChartData = (logs: Doc<"exerciseLogs">[]) => {
    // Sort logs by date (oldest to newest) for proper timeline display
    return [...logs]
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
      .map((log) => ({
        date: format(new Date(log.created_at), "MMM d"),
        weight: log.weight,
        reps: log.reps,
        sets: log.sets,
        // Include full date for tooltip
        fullDate: format(new Date(log.created_at), "MMM d, yyyy"),
      }));
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{payload[0]?.payload.fullDate}</p>
          <div className="grid grid-cols-1 gap-1 mt-2">
            {payload.map((entry, index) => (
              <p key={`item-${index}`} style={{ color: entry.color }}>
                {entry.name}: {entry.value}{" "}
                {entry.name === "Weight" ? "kg" : ""}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const handleEditPeriod = () => {
    if (trackingPeriod) {
      setEditPeriodForm({
        period_name: trackingPeriod.period_name,
        start_date: trackingPeriod.start_date,
        end_date: trackingPeriod.end_date || "",
      });
      setIsEditPeriodDialogOpen(true);
    }
  };

  const handleUpdatePeriod = async () => {
    await updatePeriod({
      id: periodId,
      period_name: editPeriodForm.period_name,
      start_date: editPeriodForm.start_date,
      end_date: editPeriodForm.end_date || undefined,
    });
    setIsEditPeriodDialogOpen(false);
  };

  if (!trackingPeriod) {
    return (
      <div className="container py-10">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/workouts")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-10">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/workouts")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  {trackingPeriod.period_name}
                </h1>
                <p className="text-muted-foreground">
                  {format(new Date(trackingPeriod.start_date), "PPP")} -
                  {trackingPeriod.end_date
                    ? format(new Date(trackingPeriod.end_date), "PPP")
                    : " Ongoing"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditPeriod}
                className="flex items-center gap-1 ml-4"
              >
                <Edit className="h-4 w-4" />
                Edit Period
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="log" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="log">Log Exercise</TabsTrigger>
            <TabsTrigger value="history">Exercise History</TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Log Your Workout</h2>
              <div className="flex space-x-2">
                <Dialog
                  open={isExerciseDialogOpen}
                  onOpenChange={setIsExerciseDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Exercise
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Exercise</DialogTitle>
                      <DialogDescription>
                        Add a new exercise to your collection.
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...exerciseForm}>
                      <form
                        onSubmit={exerciseForm.handleSubmit(onSubmitExercise)}
                        className="space-y-4"
                      >
                        <FormField
                          control={exerciseForm.control}
                          name="exercise_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Exercise Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Bench Press"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={exerciseForm.control}
                          name="exercise_description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Brief description of the exercise"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <Button type="submit">Create Exercise</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isLogDialogOpen}
                  onOpenChange={setIsLogDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Log Exercise
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log Exercise</DialogTitle>
                      <DialogDescription>
                        Record your workout details.
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...logForm}>
                      <form
                        onSubmit={logForm.handleSubmit(onSubmitLog)}
                        className="space-y-4"
                      >
                        <FormField
                          control={logForm.control}
                          name="exerciseId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Exercise</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an exercise" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {exercises.map((exercise) => (
                                    <SelectItem
                                      key={exercise._id}
                                      value={exercise._id}
                                    >
                                      {exercise.exercise_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={logForm.control}
                            name="weight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Weight (kg)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={logForm.control}
                            name="reps"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reps</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={logForm.control}
                            name="sets"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sets</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <DialogFooter>
                          <Button type="submit">Save Log</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={isEditLogDialogOpen}
                  onOpenChange={setIsEditLogDialogOpen}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Exercise Log</DialogTitle>
                      <DialogDescription>
                        Update your workout details.
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...logForm}>
                      <form
                        onSubmit={logForm.handleSubmit(onSubmitEditLog)}
                        className="space-y-4"
                      >
                        <FormField
                          control={logForm.control}
                          name="exerciseId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Exercise</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an exercise" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {exercises.map((exercise) => (
                                    <SelectItem
                                      key={exercise._id}
                                      value={exercise._id}
                                    >
                                      {exercise.exercise_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={logForm.control}
                            name="weight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Weight (kg)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={logForm.control}
                            name="reps"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reps</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={logForm.control}
                            name="sets"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sets</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <DialogFooter>
                          <Button type="submit">Update Log</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {exercises.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No exercises yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first exercise to start logging workouts
                </p>
                <Button onClick={() => setIsExerciseDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Exercise
                </Button>
              </div>
            ) : periodLogs.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  No logs for this period yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start logging your workouts
                </p>
                <Button onClick={() => setIsLogDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Log Exercise
                </Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {Object.keys(logsByExercise).map((exerciseId) => {
                  const id = exerciseId as Id<"exercises">;
                  const { exercise, logs } = logsByExercise[id];
                  const latestLog = logs[0]; // Already sorted by date

                  return (
                    <AccordionItem key={exercise._id} value={exercise._id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-col items-start text-left">
                          <h3 className="text-lg font-semibold">
                            {exercise.exercise_name}
                          </h3>
                          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                            <span>
                              Last:{" "}
                              {format(new Date(latestLog.created_at), "MMM d")}
                            </span>
                            <span>{latestLog.weight} kg</span>
                            <span>{latestLog.sets} sets</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {logs.map((log: Doc<"exerciseLogs">) => (
                            <Card key={log._id} className="overflow-hidden">
                              <div className="bg-muted px-4 py-2 flex justify-between items-center">
                                <span className="font-medium">
                                  {format(
                                    new Date(log.created_at),
                                    "MMMM d, yyyy",
                                  )}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(log.created_at), "h:mm a")}
                                </span>
                              </div>
                              <CardContent className="p-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                      Weight
                                    </p>
                                    <p className="text-lg font-medium">
                                      {log.weight}
                                    </p>
                                  </div>
                                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                      Reps
                                    </p>
                                    <p className="text-lg font-medium">
                                      {log.reps}
                                    </p>
                                  </div>
                                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                      Sets
                                    </p>
                                    <p className="text-lg font-medium">
                                      {log.sets}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-muted">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditDialog(log)}
                                    className="hover:bg-blue-50 hover:border-blue-300 flex items-center"
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteExerciseLog(log._id)}
                                    className="hover:bg-red-600 flex items-center"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Exercise History</h2>

            {periodLogs.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  No workout history yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start logging your workouts to see your history
                </p>
                <Button onClick={() => setIsLogDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Log Exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <Accordion type="multiple" className="w-full">
                  {Object.keys(logsByExercise).map((exerciseId) => {
                    const id = exerciseId as Id<"exercises">;
                    const { exercise, logs } = logsByExercise[id];

                    return (
                      <AccordionItem key={exercise._id} value={exercise._id}>
                        <AccordionTrigger className="hover:no-underline ">
                          <div className="flex flex-col items-start text-left">
                            <h3 className="text-lg font-semibold">
                              {exercise.exercise_name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {logs.length} {logs.length === 1 ? "log" : "logs"}{" "}
                              recorded
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6 pt-2">
                            {/* Line Chart */}
                            <div className="h-[300px] w-full mt-4 mb-6">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={prepareChartData(logs)}
                                  margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                  }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                  />
                                  <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    stroke="#8884d8"
                                  />
                                  <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    stroke="#82ca9d"
                                  />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="weight"
                                    name="Weight"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                  />
                                  <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="reps"
                                    name="Reps"
                                    stroke="#82ca9d"
                                    activeDot={{ r: 6 }}
                                    strokeWidth={2}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Exercise Logs */}
                            <div className="space-y-4">
                              {logs.map((log: Doc<"exerciseLogs">) => (
                                <Card key={log._id} className="overflow-hidden">
                                  <div className="bg-muted px-4 py-2 flex justify-between items-center">
                                    <span className="font-medium">
                                      {format(
                                        new Date(log.created_at),
                                        "MMMM d, yyyy",
                                      )}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {format(
                                        new Date(log.created_at),
                                        "h:mm a",
                                      )}
                                    </span>
                                  </div>
                                  <CardContent className="p-4">
                                    <div className="grid grid-cols-3 gap-4">
                                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                          Weight
                                        </p>
                                        <p className="text-lg font-medium">
                                          {log.weight}
                                        </p>
                                      </div>
                                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                          Reps
                                        </p>
                                        <p className="text-lg font-medium">
                                          {log.reps}
                                        </p>
                                      </div>
                                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                          Sets
                                        </p>
                                        <p className="text-lg font-medium">
                                          {log.sets}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog
        open={logToDelete !== null}
        onOpenChange={(open) => !open && setLogToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              exercise log from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={isEditPeriodDialogOpen}
        onOpenChange={setIsEditPeriodDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tracking Period</DialogTitle>
            <DialogDescription>
              Update the name and date range for this tracking period.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="period_name">Period Name</Label>
              <Input
                id="period_name"
                value={editPeriodForm.period_name}
                onChange={(e) =>
                  setEditPeriodForm({
                    ...editPeriodForm,
                    period_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editPeriodForm.start_date ? (
                      format(new Date(editPeriodForm.start_date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      editPeriodForm.start_date
                        ? new Date(editPeriodForm.start_date)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        setEditPeriodForm({
                          ...editPeriodForm,
                          start_date: date.toISOString(),
                        });
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editPeriodForm.end_date ? (
                      format(new Date(editPeriodForm.end_date), "PPP")
                    ) : (
                      <span>No end date (ongoing)</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-2 border-b">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left font-normal"
                      onClick={() =>
                        setEditPeriodForm({ ...editPeriodForm, end_date: "" })
                      }
                    >
                      No end date (ongoing)
                    </Button>
                  </div>
                  <Calendar
                    mode="single"
                    selected={
                      editPeriodForm.end_date
                        ? new Date(editPeriodForm.end_date)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        setEditPeriodForm({
                          ...editPeriodForm,
                          end_date: date.toISOString(),
                        });
                      }
                    }}
                    initialFocus
                    disabled={(date) => {
                      // Disable dates before start date
                      if (!editPeriodForm.start_date) return false;
                      return date < new Date(editPeriodForm.start_date);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditPeriodDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePeriod}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
