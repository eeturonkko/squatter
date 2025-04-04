"use client";

import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
/* import type { Week, WeightEntry } from "@/lib/types"; */
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const formSchema = z.object({
  weight: z.coerce.number().positive({
    message: "Weight must be a positive number.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  weekId: z.string({
    required_error: "Please select a week.",
  }),
});

export default function TrackWeightForm() {
  const weeks = useQuery(api.weeksAndWeight.getWeeksByUserId);
  const createWeight = useMutation(api.weeksAndWeight.createNewDailyWeight);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 0,
      date: undefined,
      weekId: "", // will be overwritten on first selection
    },
    shouldUnregister: false, // this helps retain values after reset
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.weekId) {
      console.warn("Week ID missing, aborting");
      return;
    }

    createWeight({
      weekId: values.weekId as Id<"week">,
      weight: values.weight,
      date: values.date.toISOString(),
    });

    form.reset({
      weight: 0,
      date: undefined,
      weekId: values.weekId,
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div>
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Weight tracked successfully!
          </AlertDescription>
        </Alert>
      )}

      {weeks?.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">
            No weeks created yet. Please create a week first.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 75.5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
              name="weekId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Week</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a week" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {weeks?.map((week) => (
                        <SelectItem key={week._id} value={week._id}>
                          {week.name} ({week.target})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Track Weight
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
