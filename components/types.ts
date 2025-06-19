import { Id } from "@/convex/_generated/dataModel";

export type Member = {
  _id: string;
  name: string;
  dateJoined: string;
  totalContribution: number;
  monthlyContribution: number;
  pin: string;
};



export type Loan = {
  _id: Id<"loans">;
  _creationTime: number;
  userId: Id<"users">;
  amount: number;
  dateApplied: string; 
  status: 'cleared' | 'processing' | 'approved';
  approvedDate?: string;
  dueDate?: string;
  approvedBy?: string;
  repaymentDate?: string;
};

export type LoanProgress = {
  daysLeft: number;
  progressPercentage: number;
  repaymentDate: Date | null;
  isOverdue: boolean;
};
