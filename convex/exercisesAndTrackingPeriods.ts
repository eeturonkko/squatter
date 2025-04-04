import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Tracking periods
export const createNewTrackingPeriod = mutation({
  args: {
    period_name: v.string(),
    start_date: v.string(), // Store as ISO date string
    end_date: v.optional(v.string()), // Optional end date
  },
  handler: async (ctx, args) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to create a tracking period");
    }

    const userId = identity.tokenIdentifier;
    const trackingPeriodId = await ctx.db.insert("trackingPeriods", {
      period_name: args.period_name,
      start_date: args.start_date,
      end_date: args.end_date,
      userId: userId,
    });
    return trackingPeriodId;
  },
});

export const getTrackingPeriodsByUserId = query({
  handler: async (ctx) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.tokenIdentifier;

    const trackingPeriods = await ctx.db
      .query("trackingPeriods")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return trackingPeriods;
  },
});

export const getTrackingPeriodById = query({
  args: { id: v.id("trackingPeriods") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to get a tracking period");
    }

    const userId = identity.tokenIdentifier;
    const trackingPeriod = await ctx.db.get(args.id);

    if (!trackingPeriod) {
      throw new Error("Tracking period not found");
    }

    // Verify the user owns this tracking period
    if (trackingPeriod.userId !== userId) {
      throw new Error("You don't have permission to view this tracking period");
    }

    return trackingPeriod;
  },
});

export const updateTrackingPeriod = mutation({
  args: {
    id: v.id("trackingPeriods"),
    period_name: v.string(),
    start_date: v.string(),
    end_date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to update a tracking period");
    }

    const userId = identity.tokenIdentifier;
    const trackingPeriod = await ctx.db.get(args.id);

    if (!trackingPeriod) {
      throw new Error("Tracking period not found");
    }

    // Verify the user owns this tracking period
    if (trackingPeriod.userId !== userId) {
      throw new Error(
        "You don't have permission to update this tracking period",
      );
    }

    await ctx.db.patch(args.id, {
      period_name: args.period_name,
      start_date: args.start_date,
      end_date: args.end_date,
    });
  },
});

export const deleteTrackingPeriod = mutation({
  args: { id: v.id("trackingPeriods") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to delete a tracking period");
    }

    const userId = identity.tokenIdentifier;
    const trackingPeriod = await ctx.db.get(args.id);

    if (!trackingPeriod) {
      throw new Error("Tracking period not found");
    }

    // Verify the user owns this tracking period
    if (trackingPeriod.userId !== userId) {
      throw new Error(
        "You don't have permission to delete this tracking period",
      );
    }

    await ctx.db.delete(args.id);
  },
});

// Exercise
export const createNewExercise = mutation({
  args: {
    exercise_name: v.string(),
    exercise_description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to create an exercise");
    }

    const userId = identity.tokenIdentifier;
    const exerciseId = await ctx.db.insert("exercises", {
      exercise_name: args.exercise_name,
      exercise_description: args.exercise_description,
      userId: userId,
    });
    return exerciseId;
  },
});

export const getExercisesByUserId = query({
  handler: async (ctx) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.tokenIdentifier;

    const exercises = await ctx.db
      .query("exercises")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return exercises;
  },
});

export const getExerciseById = query({
  args: { id: v.id("exercises") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to get an exercise");
    }

    const userId = identity.tokenIdentifier;
    const exercise = await ctx.db.get(args.id);

    if (!exercise) {
      throw new Error("Exercise not found");
    }

    // Verify the user owns this exercise
    if (exercise.userId !== userId) {
      throw new Error("You don't have permission to view this exercise");
    }

    return exercise;
  },
});

export const updateExercise = mutation({
  args: {
    id: v.id("exercises"),
    exercise_name: v.string(),
    exercise_description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to update an exercise");
    }

    const userId = identity.tokenIdentifier;
    const exercise = await ctx.db.get(args.id);

    if (!exercise) {
      throw new Error("Exercise not found");
    }

    // Verify the user owns this exercise
    if (exercise.userId !== userId) {
      throw new Error("You don't have permission to update this exercise");
    }

    await ctx.db.patch(args.id, {
      exercise_name: args.exercise_name,
      exercise_description: args.exercise_description,
    });
  },
});

export const deleteExercise = mutation({
  args: { id: v.id("exercises") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to delete an exercise");
    }

    const userId = identity.tokenIdentifier;
    const exercise = await ctx.db.get(args.id);

    if (!exercise) {
      throw new Error("Exercise not found");
    }

    // Verify the user owns this exercise
    if (exercise.userId !== userId) {
      throw new Error("You don't have permission to delete this exercise");
    }

    await ctx.db.delete(args.id);
  },
});

// Tracked exercises
export const createNewTrackedExercise = mutation({
  args: {
    periodId: v.id("trackingPeriods"),
    exerciseId: v.id("exercises"),
    date: v.string(), // Store as ISO date string
  },
  handler: async (ctx, args) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to create a tracked exercise");
    }

    const userId = identity.tokenIdentifier;
    const trackedExerciseId = await ctx.db.insert("trackedExercises", {
      periodId: args.periodId,
      exerciseId: args.exerciseId,
      date: args.date,
      userId: userId,
    });
    return trackedExerciseId;
  },
});

export const getTrackedExercisesByUserId = query({
  handler: async (ctx) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.tokenIdentifier;

    const trackedExercises = await ctx.db
      .query("trackedExercises")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return trackedExercises;
  },
});

export const updateTrackedExercise = mutation({
  args: {
    id: v.id("trackedExercises"),
    periodId: v.id("trackingPeriods"),
    exerciseId: v.id("exercises"),
    date: v.string(), // Store as ISO date string
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to update a tracked exercise");
    }

    const userId = identity.tokenIdentifier;
    const trackedExercise = await ctx.db.get(args.id);

    if (!trackedExercise) {
      throw new Error("Tracked exercise not found");
    }

    // Verify the user owns this tracked exercise
    if (trackedExercise.userId !== userId) {
      throw new Error(
        "You don't have permission to update this tracked exercise",
      );
    }

    await ctx.db.patch(args.id, {
      periodId: args.periodId,
      exerciseId: args.exerciseId,
      date: args.date,
    });
  },
});

export const deleteTrackedExercise = mutation({
  args: { id: v.id("trackedExercises") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to delete a tracked exercise");
    }

    const userId = identity.tokenIdentifier;
    const trackedExercise = await ctx.db.get(args.id);

    if (!trackedExercise) {
      throw new Error("Tracked exercise not found");
    }

    // Verify the user owns this tracked exercise
    if (trackedExercise.userId !== userId) {
      throw new Error(
        "You don't have permission to delete this tracked exercise",
      );
    }

    await ctx.db.delete(args.id);
  },
});

// Log exercise
export const createNewExerciseLog = mutation({
  args: {
    periodId: v.id("trackingPeriods"),
    exerciseId: v.id("exercises"),
    weight: v.number(),
    reps: v.number(),
    sets: v.number(),
    created_at: v.string(), // Store as ISO date string
  },
  handler: async (ctx, args) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to create an exercise log");
    }

    const userId = identity.tokenIdentifier;
    const exerciseLogId = await ctx.db.insert("exerciseLogs", {
      periodId: args.periodId,
      exerciseId: args.exerciseId,
      weight: args.weight,
      reps: args.reps,
      sets: args.sets,
      created_at: args.created_at,
      userId: userId,
    });
    return exerciseLogId;
  },
});

export const getExerciseLogsByUserId = query({
  handler: async (ctx) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.tokenIdentifier;

    const exerciseLogs = await ctx.db
      .query("exerciseLogs")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return exerciseLogs;
  },
});

export const updateExerciseLog = mutation({
  args: {
    id: v.id("exerciseLogs"),
    periodId: v.id("trackingPeriods"),
    exerciseId: v.id("exercises"),
    weight: v.number(),
    reps: v.number(),
    sets: v.number(),
    created_at: v.string(), // Store as ISO date string
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to update an exercise log");
    }

    const userId = identity.tokenIdentifier;
    const exerciseLog = await ctx.db.get(args.id);

    if (!exerciseLog) {
      throw new Error("Exercise log not found");
    }

    // Verify the user owns this exercise log
    if (exerciseLog.userId !== userId) {
      throw new Error("You don't have permission to update this exercise log");
    }

    await ctx.db.patch(args.id, {
      periodId: args.periodId,
      exerciseId: args.exerciseId,
      weight: args.weight,
      reps: args.reps,
      sets: args.sets,
      created_at: args.created_at,
    });
  },
});

export const deleteLogExercise = mutation({
  args: { id: v.id("exerciseLogs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to delete an exercise log");
    }

    const userId = identity.tokenIdentifier;
    const exerciseLog = await ctx.db.get(args.id);

    if (!exerciseLog) {
      throw new Error("Exercise log not found");
    }

    // Verify the user owns this exercise log
    if (exerciseLog.userId !== userId) {
      throw new Error("You don't have permission to delete this exercise log");
    }

    await ctx.db.delete(args.id);
  },
});
