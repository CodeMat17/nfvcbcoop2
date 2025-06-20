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
import Image from "next/image";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onVerify: (pin: string) => Promise<void>;
}

export function LoginForm({ onVerify }: LoginFormProps) {
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  const handlePinChange = (value: string, index: number) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`pin-input-${index + 1}`);
        if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = async () => {
    const enteredPin = pin.join("");
    if (enteredPin.length !== 6) {
      return;
    }

    setIsLoading(true);
    try {
      await onVerify(enteredPin);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
    if (e.key === "Enter" && index === 5) {
      handleSubmit();
    }
  };

  return (
    <Card className='bg-white shadow-lg w-full max-w-md mx-auto'>
      <CardHeader className='flex flex-col items-center'>
        <div className='flex flex-col items-center mb-6'>
          <div className='relative rounded-xl w-16 h-16 mb-3'>
            <Image
              alt='Cooperative Logo'
              fill
              priority
              src='/coop-logo.webp'
              className='object-contain'
            />
          </div>
          <h2 className='text-2xl font-bold text-green-800 text-center'>
            NFVCB Multipurpose Cooperative
          </h2>
        </div>
        <CardTitle className='text-green-800 text-center'>
          Member Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-gray-600 text-center mb-6'>
          Enter your 6-digit membership PIN
        </p>
        <div className='flex justify-center space-x-3 mb-6'>
          {pin.map((digit, index) => (
            <Input
              key={index}
              id={`pin-input-${index}`}
              type='password'
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className='w-12 h-12 text-2xl text-center border-2 border-green-300 focus:border-green-500'
              disabled={isLoading}
              inputMode='numeric'
              autoFocus={index === 0}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          className='w-full bg-green-600 hover:bg-green-700 py-6'
          disabled={isLoading || pin.join("").length !== 6}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Verifying...
            </>
          ) : (
            "Verify Membership"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
