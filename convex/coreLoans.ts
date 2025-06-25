import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCoreLoan = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    ippis: v.string(),
    mobileNumber: v.string(),
    location: v.string(),
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
  },
  handler: async (ctx, args) => {
    const coreLoanId = await ctx.db.insert("coreLoans", {
      ...args,
      status: "pending",
    });

    // Update the user's status to 'pending'
    await ctx.db.patch(args.userId, {
      status: "pending",
    });

    // Return both the loan ID and updated user data
    const updatedUser = await ctx.db.get(args.userId);
    const createdLoan = await ctx.db.get(coreLoanId);

    return {
      success: true,
      coreLoanId,
      updatedUser,
      createdLoan,
    };
  },
});

export const getCoreLoans = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("done"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("coreLoans");

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    // Execute query and get loans
    const loans = await query.collect();

    return loans;
  },
});

export const rejectCoreLoan = mutation({
  args: {
    userId: v.id("users"),
    loanId: v.id("coreLoans"),
  },
  handler: async (ctx, { userId, loanId }) => {
    // Verify the user exists
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify the loan exists and belongs to this user
    const loan = await ctx.db.get(loanId);
    if (!loan || loan.userId !== userId) {
      throw new Error("Loan not found or does not belong to user");
    }
    await ctx.db.patch(userId, {
      status: "done",
    });
    await ctx.db.delete(loanId);
  },
});

export const approveCoreLoan = mutation({
  args: {
    userId: v.id("users"),
    loanId: v.id("coreLoans"),
  },
  handler: async (ctx, { userId, loanId }) => {
    // Verify the user exists
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify the loan exists and belongs to this user
    const loan = await ctx.db.get(loanId);
    if (!loan || loan.userId !== userId) {
      throw new Error("Loan not found or does not belong to user");
    }
    await ctx.db.patch(userId, {
      status: "done",
    });

    await ctx.db.patch(loanId, {
      status: "done",
      existingLoan: "yes",
    });
  },
});

export const getCoreLoanById = query({
  args: {
    loanId: v.id("coreLoans"),
  },
  handler: async (ctx, { loanId }) => {
    const loan = await ctx.db.get(loanId);
    if (!loan) {
      throw new Error("Loan not found.");
    }
    return loan;
  },
});
