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
