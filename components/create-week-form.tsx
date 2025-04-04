"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Week name must be at least 2 characters.",
  }),
  target: z.enum(["bulk", "cut"], {
    required_error: "Please select a target.",
  }),
});

export default function CreateWeekForm() {
  const createWeek = useMutation(api.weeksAndWeight.createNewWeek);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      target: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitted!");
    console.log(values);
    createWeek({
      name: values.name,
      target: values.target,
      isArchived: false,
    });
    form.reset();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  }

  return (
    <div>
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Week created successfully!
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Week Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Summer Cut Week 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="bulk" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Bulk
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="cut" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Cut
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Create Week
          </Button>
        </form>
      </Form>
    </div>
  );
}
