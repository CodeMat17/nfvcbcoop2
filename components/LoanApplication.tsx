"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { Member } from "./types";

interface LoanApplicationProps {
  member: Member;
  loanAmount: number;
  setLoanAmount: (amount: number) => void;
  onApply: (pin: string) => Promise<void>;
}

export function LoanApplication({
  member,
  loanAmount,
  setLoanAmount,
  onApply,
}: LoanApplicationProps) {
  const [confirmationPin, setConfirmationPin] = useState<string>("");
  const [showPin, setShowPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (confirmationPin.length === 6) {
      setPinError(confirmationPin !== member.pin);
    } else {
      setPinError(false);
    }
  }, [confirmationPin, member.pin]);

  return (
    <Card className='bg-white shadow-lg'>
      <CardHeader>
        <CardTitle className='text-green-800 text-center text-xl'>
          Apply for Quick Fix Loan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div>
            <label className='block text-gray-700 mb-2'>Loan Amount (₦)</label>
            <Select
              value={loanAmount.toString()}
              onValueChange={(val) => setLoanAmount(Number(val))}>
              <SelectTrigger className='border-green-300 h-14 text-base w-full py-6'>
                <SelectValue placeholder='Select loan amount' />
              </SelectTrigger>
              <SelectContent>
                {[
                  10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
                  100000, 110000, 120000, 130000, 140000, 150000,
                ].map((amount) => (
                  <SelectItem
                    key={amount}
                    value={amount.toString()}
                    className='text-base'>
                    ₦{amount.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='block text-gray-700 mb-2'>Confirm Your PIN</label>
            <div className='relative'>
              <Input
                type={showPin ? "text" : "password"}
                value={confirmationPin}
                onChange={(e) => setConfirmationPin(e.target.value)}
                placeholder='Enter 6-digit PIN'
                maxLength={6}
                className={`border-green-300 h-14 text-base pr-12 ${
                  pinError ? "border-red-500" : ""
                }`}
              />
              <button
                onClick={() => setShowPin(!showPin)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {pinError && (
              <p className='text-red-500 text-sm mt-1'>
                PIN does not match. Please try again.
              </p>
            )}
          </div>

          <div className='bg-green-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-green-800 mb-2'>Loan Terms</h3>
            <ul className='text-sm text-gray-600 list-disc pl-5 space-y-1'>
              <li>5% interest rate on the principal amount</li>
              <li>Repayment period: 6 months</li>
              <li className='text-red-500 font-semibold'>
                Defaulting will result in blacklisting from future loans
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={async () => {
            setIsLoading(true);
            try {
              await onApply(confirmationPin);
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={pinError || confirmationPin.length !== 6 || isLoading}
          className='w-full bg-green-600 hover:bg-green-700 py-6 text-base disabled:bg-gray-700 disabled:cursor-not-allowed'>
          {isLoading ? (
            <div className='flex items-center justify-center gap-2'>
              <Minus className='animate-spin w-4 h-4' /> Processing...
            </div>
          ) : (
            `Apply for ₦${loanAmount.toLocaleString()}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
