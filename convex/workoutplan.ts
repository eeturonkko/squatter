import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createWorkoutPlan = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to create a workout plan");
    }

    const userId = identity.tokenIdentifier;

    const workoutPlanId = await ctx.db.insert("workoutplan", {
      name: args.name,
      description: args.description,
      userId: userId,
    });

    return workoutPlanId;
  },
});

export const getWorkoutPlansByUserId = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to view workout plans");
    }

    const userId = identity.tokenIdentifier;

    const workoutPlans = await ctx.db
      .query("workoutplan")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return workoutPlans;
  },
});

export const getWorkoutPlanById = query({
  args: {
    id: v.id("workoutplan"),
  },
  handler: async (ctx, args) => {
    const workoutPlan = await ctx.db.get(args.id);
    if (!workoutPlan) {
      throw new Error("Workout plan not found");
    }
    return workoutPlan;
  },
});

export const createNewWorkout = mutation({
  args: {
    workoutPlanId: v.id("workoutplan"),
    weight: v.number(),
    reps: v.number(),
    week: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const workoutId = await ctx.db.insert("workout", {
      weight: args.weight,
      reps: args.reps,
      week: args.week,
      workoutplanId: args.workoutPlanId,
      description: args.description,
    });

    return workoutId;
  },
});

export const getWorkoutsByWorkoutPlanId = query({
  args: {
    workoutPlanId: v.id("workoutplan"),
  },
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query("workout")
      .filter((q) => q.eq(q.field("workoutplanId"), args.workoutPlanId))
      .collect();

    return workouts;
  },
});
