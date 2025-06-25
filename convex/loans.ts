import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const applyForLoan = mutation({
  args: {
    userId: v.id("users"),
    pin: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, { userId, pin, amount }) => {
    // Verify PIN matches user
    const user = await ctx.db.get(userId);
    if (!user || user.pin !== pin) {
      throw new Error("Invalid PIN");
    }

    // Check for existing active loans
    const activeLoans = await ctx.db
      .query("loans")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", userId).eq("status", "processing")
      )
      .collect();

    if (activeLoans.length > 0) {
      throw new Error(
        "You must repay your current loan before applying for a new one"
      );
    }

    // Create new loan
    return await ctx.db.insert("loans", {
      userId,
      amount,
      dateApplied: new Date().toISOString(),
      status: "processing",
    });
  },
});

export const approveLoan = mutation({
  args: {
    loanId: v.id("loans"),
    adminName: v.string(),
  },
  handler: async (ctx, { loanId, adminName }) => {
    const approvalDate = new Date().toISOString();
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 6); // 6 months term

    await ctx.db.patch(loanId, {
      status: "approved",
      approvedDate: approvalDate,
      dueDate: dueDate.toISOString(),
      approvedBy: adminName,
    });
  },
});

export const clearLoan = mutation({
  args: {
    loanId: v.id("loans"),
  },
  handler: async (ctx, { loanId }) => {
    await ctx.db.patch(loanId, {
      status: "cleared",
    });
  },
});

export const getActiveLoan = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("loans")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", userId).eq("status", "approved")
      )
      .first();
  },
});

export const getLatestLoan = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("loans")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(1)
      .then((loans) => loans[0] ?? null);
  },
});

export const getLoansByStatus = query({
  args: {
    status: v.union(
      v.literal("cleared"),
      v.literal("processing"),
      v.literal("approved")
    ),
  },
  handler: async (ctx, { status }) => {
    const loans = await ctx.db
      .query("loans")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect();

    const usersMap = new Map<string, string | null>();

    for (const loan of loans) {
      const userIdStr = loan.userId;
      if (!usersMap.has(userIdStr)) {
        const user = await ctx.db.get(loan.userId);
        usersMap.set(userIdStr, user?.name ?? null);
      }
    }

    return loans.map((loans) => ({
      ...loans,
      userName: usersMap.get(loans.userId) ?? null,
    }));
  },
});

export const getUserLoans = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("loans")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const rejectLoan = mutation({
  args: {
    loanId: v.id("loans"),
  },
  handler: async (ctx, { loanId }) => {
    await ctx.db.delete(loanId);
  },
});
