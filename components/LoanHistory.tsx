"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { Loan } from "./types";

// interface LoanProgress {
//   daysLeft: number;
//   progressPercentage: number;
//   repaymentDate: Date | null;
//   isOverdue: boolean;
// }

export function LoanHistory({ loans }: { loans: Loan[] }) {
  // const calculateLoanProgress = (loan: Loan): LoanProgress => {
  //   if (!loan.approvedDate || !loan.repaymentDate) {
  //     return {
  //       daysLeft: 0,
  //       progressPercentage: 0,
  //       repaymentDate: null,
  //       isOverdue: false,
  //     };
  //   }

  //   const today = new Date();
  //   const approvalDate = new Date(loan.approvedDate);
  //   const repaymentDate = new Date(loan.repaymentDate);

  //   const totalTime = repaymentDate.getTime() - approvalDate.getTime();
  //   const totalDays = Math.ceil(totalTime / (1000 * 60 * 60 * 24));
  //   const remainingTime = repaymentDate.getTime() - today.getTime();
  //   const daysLeft = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
  //   const daysPassed = totalDays - daysLeft;

  //   const progressPercentage = Math.min(
  //     Math.max((daysPassed / totalDays) * 100, 0),
  //     100
  //   );
  //   const isOverdue = remainingTime < 0;

  //   return {
  //     daysLeft: Math.abs(daysLeft),
  //     progressPercentage,
  //     repaymentDate,
  //     isOverdue,
  //   };
  // };

  return (
    <Card className='bg-white shadow-lg'>
      <CardHeader>
        <CardTitle className='text-green-800'>Loan History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => {
              // const progress = calculateLoanProgress(loan);

              return (
                <TableRow key={loan._id}>
                  <TableCell className='font-medium'>
                    {dayjs(loan.dateApplied).format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell>₦{loan.amount.toLocaleString()}</TableCell>

                  <TableCell>
                    {loan.dueDate
                      ? dayjs(loan.dueDate).format("DD MMM YYYY")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${loan.status === "processing" ? "bg-yellow-500" : loan.status === "approved" ? "bg-green-500" : loan.status === "cleared" ? "border" : ""}`}>
                        {loan.status}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
