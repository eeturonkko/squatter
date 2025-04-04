import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
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
});
