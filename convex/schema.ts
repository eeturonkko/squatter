import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  workoutplan: defineTable({
    name: v.string(),
    description: v.string(),
    userId: v.string(),
  }),
  workout: defineTable({
    weight: v.number(),
    reps: v.number(),
    week: v.number(),
    workoutplanId: v.id("workoutplan"), // Reference to the associated workoutplan
    description: v.optional(v.string()),
  }),
  week: defineTable({
    name: v.string(),
    target: v.string(),
    isArchived: v.boolean(),
    userId: v.string(),
  }),
  dailyWeight: defineTable({
    weight: v.float64(),
    date: v.string(),
    weekId: v.id("week"), // Reference to the associated week
  }),
  exerciseLogs: defineTable({
    periodId: v.id("trackingPeriods"),
    exerciseId: v.id("exercises"),
    weight: v.number(),
    reps: v.number(),
    sets: v.number(),
    created_at: v.string(), // Store as ISO date string
    userId: v.string(),
  }),

  exercises: defineTable({
    exercise_name: v.string(),
    exercise_description: v.optional(v.string()),
    userId: v.string(),
  }),

  trackingPeriods: defineTable({
    period_name: v.string(),
    start_date: v.string(), // Store as ISO date string
    end_date: v.optional(v.string()), // Optional end date
    userId: v.string(),
  }),

  trackedExercises: defineTable({
    periodId: v.id("trackingPeriods"),
    exerciseId: v.id("exercises"),
    date: v.string(), // Store as ISO date string
    userId: v.string(),
  }),
});
