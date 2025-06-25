import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    dateJoined: v.string(), // ISO date string
    totalContribution: v.number(),
    monthlyContribution: v.number(),
    pin: v.string(),
    ippis: v.string(),
    coreLoan: v.optional(v.union(v.literal("yes"), v.literal("no"))),
    status: v.optional(v.union(v.literal("pending"), v.literal("done"))),
  })
    .index("by_pin", ["pin"])
    .index("by_name", ["name"]),

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

  coreLoans: defineTable({
    userId: v.id("users"),
    name: v.string(),
    ippis: v.string(),
    mobileNumber: v.string(),
    amountRequested: v.number(),
    bank: v.string(),
    accountNumber: v.string(),
    existingLoan: v.union(v.literal("yes"), v.literal("no")),
    guarantor1Name: v.string(),
    guarantor1Phone: v.string(),
    guarantor2Name: v.string(),
    guarantor2Phone: v.string(),
    attestation: v.string(),
    loanDate: v.string(),
    location: v.string(),
    status: v.optional(v.union(v.literal("pending"), v.literal("done"))),
  }),
});
