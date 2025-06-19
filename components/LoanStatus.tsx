"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle } from "lucide-react";
import { LoanProgress } from "./types";

interface LoanStatusProps {
  status: string;
  amount: number;
  dateApplied: string;
  approvedDate?: string;
  dueDate?: string;
  progress: LoanProgress;

  onNewLoan: () => void;
}

export function LoanStatus({
  status, amount, dateApplied, approvedDate, dueDate,
  progress,
}: LoanStatusProps) {
  const accountDetails = {
    bankName: "NFVCB Cooperative Bank",
    accountNumber: "1234567890",
    accountName: "NFVCB Cooperative Society",
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  switch (status) {
    case "processing":
      return (
        <Card className='bg-white shadow-lg border-yellow-200 py-8'>
          <CardHeader>
            <CardTitle className='text-yellow-800 text-center text-xl'>
         
              Loan Application Processing
            </CardTitle>
          </CardHeader>
          <CardContent className='text-center'>
            <div className='flex flex-col items-center space-y-4'>
              <div className='animate-pulse bg-yellow-100 rounded-full p-4'>
                <Clock className='text-yellow-600' size={48} />
              </div>
              <div className='space-y-2'>
                <p className='text-xl font-semibold'>
                  Your loan application is being reviewed
                </p>
                <p className='text-gray-600'>
                  We&apos;re processing your loan request for{" "}
                  <span className='font-bold text-green-700'>
                    ₦{amount.toLocaleString()}
                  </span>
                </p>
                <p className='text-gray-600'>
                  Applied on {formatDate(dateApplied)}
                </p>
              </div>
              <div className='bg-yellow-50 p-4 rounded-lg mt-4 max-w-md'>
                <h3 className='font-semibold text-yellow-800 mb-2'>
                  What&apos;s happening next?
                </h3>
                <ul className='text-sm text-gray-600 list-disc pl-5 space-y-1 text-left'>
                  <li>Loan committee is reviewing your application</li>
                  <li>Verifying your contribution history</li>
                  <li>Final approval decision within 24-48 hours</li>
                  <li>You&apos;ll receive a notification once processed</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className='justify-center'>
            <Button
              className='bg-yellow-500 hover:bg-yellow-600 py-4 px-8'
              disabled>
              Processing...
            </Button>
          </CardFooter>
        </Card>
      );

    case "approved":
      return (
        <Card className='bg-white shadow-lg border-green-200'>
          <CardHeader>
            <CardTitle className='text-green-800 flex items-center gap-2'>
              <CheckCircle className='text-green-500' size={24} />
              Active Loan Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <div className='space-y-3'>
                  <div>
                    <p className='text-gray-500'>Loan Amount</p>
                    <p className='font-semibold text-xl'>
                      ₦{amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Approval Date</p>
                    <p className='font-semibold'>
                      {formatDate(approvedDate)}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Repayment Due Date</p>
                    <p className='font-semibold'>
                      {formatDate(dueDate)}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Days Remaining</p>
                    <p
                      className={`font-semibold text-2xl ${
                        progress.isOverdue ? "text-red-600" : "text-green-600"
                      }`}>
                      {progress.isOverdue ? "-" : ""}
                      {progress.daysLeft}{" "}
                      {progress.daysLeft === 1 ? "day" : "days"}
                      {progress.isOverdue ? " overdue" : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className='mb-3 flex justify-between'>
                  <span className='text-gray-600'>Repayment Progress</span>
                  <span className='font-semibold'>
                    {Math.round(progress.progressPercentage)}%
                  </span>
                </div>
                <Progress
                  value={progress.progressPercentage}
                  className='h-4 bg-green-100'
                />

                <div className='mt-6'>
                  <h4 className='font-semibold text-green-800 mb-2'>
                    Repayment Account Details
                  </h4>
                  <div className='bg-green-50 p-4 rounded-lg'>
                    <p className='font-medium'>{accountDetails.bankName}</p>
                    <p>Account Number: {accountDetails.accountNumber}</p>
                    <p>Account Name: {accountDetails.accountName}</p>
                    <p className='mt-3 text-sm text-red-600 font-medium'>
                      Please use your membership ID as payment reference
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
         
        </Card>
      );

   
  }
}
