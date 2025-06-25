import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const verifyUser = mutation({
  args: { pin: v.string() },
  handler: async (ctx, { pin }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_pin", (q) => q.eq("pin", pin))
      .unique();

    if (!user || user.pin !== pin) {
      throw new Error("Invalid PIN");
    }
    return user;
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_name")
      .order("asc")
      .collect();
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    dateJoined: v.string(),
    totalContribution: v.number(),
    monthlyContribution: v.number(),
    pin: v.string(),
    ippis: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.pin.length !== 6) {
      throw new Error("PIN must be exactly 6 digits");
    }

    // Validate PIN contains only digits
    if (!/^\d+$/.test(args.pin)) {
      throw new Error("PIN must contain only numbers");
    }

    // Check if PIN already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_pin", (q) => q.eq("pin", args.pin))
      .unique();

    if (existingUser) {
      throw new Error(
        "This PIN is already in use. Please choose a different PIN."
      );
    }

    // Create new user if PIN is unique
    const newUserId = await ctx.db.insert("users", {
      name: args.name,
      dateJoined: args.dateJoined,
      totalContribution: args.totalContribution,
      monthlyContribution: args.monthlyContribution,
      pin: args.pin,
      ippis: args.ippis,
    });

    return newUserId;
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    dateJoined: v.string(),
    totalContribution: v.number(),
    monthlyContribution: v.number(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Get the current user data first
    const currentUser = await ctx.db.get(userId);

    // Check if the user exists
    if (!currentUser) {
      throw new Error("User not found");
    }

    // Prepare the update object with only provided fields
    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.dateJoined !== undefined) updates.dateJoined = args.dateJoined;
    if (args.totalContribution !== undefined)
      updates.totalContribution = args.totalContribution;
    if (args.monthlyContribution !== undefined)
      updates.monthlyContribution = args.monthlyContribution;

    // Update the user record
    await ctx.db.patch(userId, updates);

    // Return the updated user data
    return { ...currentUser, ...updates };
  },
});
