"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Dumbbell, Scale } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

export default function WeekPage() {
  const params = useParams();
  const weekId = params.id as Id<"week">;

  const week = useQuery(api.weeksAndWeight.getWeekById, { id: weekId });
  const weights = useQuery(api.weeksAndWeight.getDailyWeightsByWeekId, {
    weekId,
  });

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
        <Button variant="outline">Edit Week</Button>
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
      </div>
    </div>
  );
}
