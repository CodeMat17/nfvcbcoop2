"use client";

import { LoanApplication } from "@/components/LoanApplication";
import { LoanHistory } from "@/components/LoanHistory";
import { LoanStatus } from "@/components/LoanStatus";
import { LoginForm } from "@/components/LoginForm";
import { MemberDashboard } from "@/components/MemberDashboard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

type User = {
  _id: Id<"users">;
  name: string;
  dateJoined: string;
  totalContribution: number;
  monthlyContribution: number;
  pin: string;
};

export default function NFVCBCooperativeApp() {
  const router = useRouter();
  const [member, setMember] = useState<User | null>(null);
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [loanProgress, setLoanProgress] = useState({
    daysLeft: 0,
    progressPercentage: 0,
    repaymentDate: null as Date | null,
    isOverdue: false,
  });

  // Convex data fetching
  const loan = useQuery(
    api.loans.getLatestLoan,
    member ? { userId: member._id } : "skip"
  );

  const history = useQuery(
    api.loans.getUserLoans,
    member ? { userId: member._id } : "skip"
  );

  const activeLoan = useQuery(
    api.loans.getActiveLoan,
    member ? { userId: member._id } : "skip"
  );

  // Convex mutations
  const verifyUser = useMutation(api.users.verifyUser);
  const applyForLoan = useMutation(api.loans.applyForLoan);

  const handleLogin = async (pin: string) => {
    try {
      const user = await verifyUser({ pin });
      setMember(user);
      localStorage.setItem("userId", user._id);
      toast.success("Done!", {
        description: "You have been verified successfully!",
      });
    } catch (error) {
      toast.error("Error!", { description: "Invalid PIN. Please try again." });
      throw error;
    }
  };

  const handleApplyForLoan = async (confirmationPin: string) => {
    if (!member) return;

    try {
      await applyForLoan({
        userId: member._id,
        pin: confirmationPin,
        amount: loanAmount,
      });
      toast.info("Done!", {
        description: "Loan application submitted. Processing...",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Application failed"
      );
    }
  };

  // Calculate loan progress
  useEffect(() => {
    if (activeLoan?.approvedDate && activeLoan.dueDate) {
      const today = new Date();
      const approvalDate = new Date(activeLoan.approvedDate);
      const repaymentDate = new Date(activeLoan.dueDate);

      const totalDays = Math.ceil(
        (repaymentDate.getTime() - approvalDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const daysLeft = Math.ceil(
        (repaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      const progressPercentage = Math.min(
        Math.max(((totalDays - daysLeft) / totalDays) * 100, 0),
        100
      );

      setLoanProgress({
        daysLeft: Math.abs(daysLeft),
        progressPercentage,
        repaymentDate,
        isOverdue: daysLeft < 0,
      });
    }
  }, [activeLoan]);

  if (member === null) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-white'>
        <Toaster position='top-center' richColors />
        <div className='w-full max-w-lg mx-auto px-4 py-12'>
          <div className='w-full py-12'>
            <LoginForm onVerify={handleLogin} />
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-white'>
      <Toaster position='top-center' richColors />

      <div className='container mx-auto px-4 py-12'>
        <header className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-green-800'>
            NFVCB Cooperative <br />{" "}
            <span className='font-medium text-2xl'>(Quick Loan)</span>
          </h1>
          <p className='text-green-600 mt-2'>
            Financial Empowerment for Members
          </p>
        </header>

        <div className='max-w-4xl mx-auto space-y-8'>
          <MemberDashboard member={member} />

          {member && (
            <div>
              {(!loan ||
                loan.status === "cleared" ||
                (loan.status !== "processing" &&
                  loan.status !== "approved")) && (
                <LoanApplication
                  member={member}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  onApply={handleApplyForLoan}
                />
              )}

              {loan && (
                <LoanStatus
                  status={loan.status}
                  amount={loan.amount}
                  dateApplied={loan.dateApplied}
                  approvedDate={loan.approvedDate}
                  dueDate={loan.dueDate}
                  progress={loanProgress}
                  onNewLoan={() => router.refresh()}
                />
              )}
            </div>
          )}

          {history && history.length > 0 ? (
            <LoanHistory loans={history} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Loan History</CardTitle>
                <CardDescription>No loan history found.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
