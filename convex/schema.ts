import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    dateJoined: v.string(), // ISO date string
    totalContribution: v.number(),
    monthlyContribution: v.number(),
    pin: v.string(),
  })
    .index("by_pin", ["pin"])
    .index("by_name", ["name"]), // Index for fast PIN lookups

  loans: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    dateApplied: v.string(),
    approvedDate: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    status: v.union(
      v.literal("cleared"),
      v.literal("processing"),
      v.literal("approved")
    ),
    approvedBy: v.optional(v.string()), //
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_userId_status", ["userId", "status"]),
});
