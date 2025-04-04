"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateWeekForm from "@/components/create-week-form";
import TrackWeightForm from "@/components/track-weight-form";
/* import { useState } from "react"; */
/* import type { Week, WeightEntry } from "@/lib/types"; */

export default function WeightPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Weight Tracker</h1>

      <Tabs defaultValue="create-week" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create-week">Create Week</TabsTrigger>
          <TabsTrigger value="track-weight">Track Weight</TabsTrigger>
        </TabsList>

        <TabsContent value="create-week">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Week</CardTitle>
              <CardDescription>
                Define a new tracking week with a name, target, and start date.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateWeekForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="track-weight">
          <Card>
            <CardHeader>
              <CardTitle>Track Your Weight</CardTitle>
              <CardDescription>
                Log your daily weight measurements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrackWeightForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
