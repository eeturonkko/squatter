import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createNewWeek = mutation({
  args: {
    name: v.string(),
    target: v.string(),
    isArchived: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to create a workout plan");
    }

    const userId = identity.tokenIdentifier;
    const weekId = await ctx.db.insert("week", {
      name: args.name,
      target: args.target,
      isArchived: args.isArchived,
      userId: userId,
    });
    return weekId;
  },
});

export const getWeeksByUserId = query({
  handler: async (ctx) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.tokenIdentifier;

    const weeks = await ctx.db
      .query("week")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return weeks;
  },
});

export const getWeekById = query({
  args: { id: v.id("week") },
  handler: async (ctx, args) => {
    // Get the authenticated user's ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to view this week");
    }

    const userId = identity.tokenIdentifier;

    const week = await ctx.db.get(args.id);
    if (!week) {
      throw new Error("Week not found");
    }

    // Ensure the user owns this week
    if (week.userId !== userId) {
      throw new Error("Unauthorized to view this week");
    }

    return week;
  },
});

export const updateWeekById = mutation({
  args: {
    id: v.id("week"),
    name: v.string(),
    target: v.string(),
    isArchived: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to update a week");
    }

    const userId = identity.tokenIdentifier;

    const week = await ctx.db.get(args.id);
    if (!week) {
      throw new Error("Week not found");
    }

    // Ensure the user owns this week
    if (week.userId !== userId) {
      throw new Error("Unauthorized to update this week");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      target: args.target,
      isArchived: args.isArchived,
    });
  },
});

export const deleteWeekById = mutation({
  args: {
    id: v.id("week"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to delete a week");
    }

    const userId = identity.tokenIdentifier;

    const week = await ctx.db.get(args.id);
    if (!week) {
      throw new Error("Week not found");
    }

    // Ensure the user owns this week
    if (week.userId !== userId) {
      throw new Error("Unauthorized to delete this week");
    }

    await ctx.db.delete(args.id);
  },
});

export const createNewDailyWeight = mutation({
  args: {
    weekId: v.id("week"),
    weight: v.number(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to track weight");
    }

    const userId = identity.tokenIdentifier;

    // Verify the week belongs to the user
    const week = await ctx.db.get(args.weekId);
    if (!week) {
      throw new Error("Week not found");
    }

    if (week.userId !== userId) {
      throw new Error("Unauthorized to add weight to this week");
    }

    const dailyWeightId = await ctx.db.insert("dailyWeight", {
      weight: args.weight,
      date: args.date,
      weekId: args.weekId,
    });
    return dailyWeightId;
  },
});

export const getDailyWeightsByWeekId = query({
  args: {
    weekId: v.id("week"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to view weight data");
    }

    const userId = identity.tokenIdentifier;

    // Verify the week belongs to the user
    const week = await ctx.db.get(args.weekId);
    if (!week) {
      throw new Error("Week not found");
    }

    if (week.userId !== userId) {
      throw new Error("Unauthorized to view weights for this week");
    }

    const dailyWeights = await ctx.db
      .query("dailyWeight")
      .filter((q) => q.eq(q.field("weekId"), args.weekId))
      .collect();

    return dailyWeights;
  },
});

export const updateDailyWeightById = mutation({
  args: {
    id: v.id("dailyWeight"),
    weight: v.number(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to update weight data");
    }

    const dailyWeight = await ctx.db.get(args.id);
    if (!dailyWeight) {
      throw new Error("Daily weight not found");
    }

    // Verify the week belongs to the user
    const week = await ctx.db.get(dailyWeight.weekId);
    if (!week || week.userId !== identity.tokenIdentifier) {
      throw new Error("Unauthorized to update this weight entry");
    }

    await ctx.db.patch(args.id, {
      weight: args.weight,
      date: args.date,
    });
  },
});

export const deleteDailyWeightById = mutation({
  args: {
    id: v.id("dailyWeight"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to delete weight data");
    }

    const dailyWeight = await ctx.db.get(args.id);
    if (!dailyWeight) {
      throw new Error("Daily weight not found");
    }

    // Verify the week belongs to the user
    const week = await ctx.db.get(dailyWeight.weekId);
    if (!week || week.userId !== identity.tokenIdentifier) {
      throw new Error("Unauthorized to delete this weight entry");
    }

    await ctx.db.delete(args.id);
  },
});
