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
      throw new Error("You must be logged in to view workout plans");
    }

    const userId = identity.tokenIdentifier;

    const weeks = await ctx.db
      .query("week")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return weeks;
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
    const week = await ctx.db.get(args.id);
    if (!week) {
      throw new Error("Week not found");
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
    const week = await ctx.db.get(args.id);
    if (!week) {
      throw new Error("Week not found");
    }
    await ctx.db.delete(args.id);
  },
});

export const createNewDailyWeight = mutation({
  args: {
    weekId: v.id("week"),
    weight: v.float64(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
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
    weight: v.float64(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const dailyWeight = await ctx.db.get(args.id);
    if (!dailyWeight) {
      throw new Error("Daily weight not found");
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
    const dailyWeight = await ctx.db.get(args.id);
    if (!dailyWeight) {
      throw new Error("Daily weight not found");
    }
    await ctx.db.delete(args.id);
  },
});
