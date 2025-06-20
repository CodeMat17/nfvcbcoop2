"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Member } from "./types";

interface MemberDashboardProps {
  member: Member;
}

export function MemberDashboard({ member }: MemberDashboardProps) {
  return (
    <Card className='bg-white shadow-lg sm:p-8'>
      <CardContent>
        <div className='space-y-4 text-center'>
          <div>
            <p className='text-gray-500'>Welcome back!</p>
            <p className='font-bold text-3xl sm:text-4xl md:text-5xl'>
              {member.name}
            </p>
          </div>
          <div>
            <p className='text-gray-500'>Date Joined</p>
            <p className='font-semibold'>{member.dateJoined}</p>
          </div>
          <div className='grid grid-cols-2 gap-4 mt-6'>
            <div className='bg-green-50 p-4 rounded-lg'>
              <p className='text-gray-500'>Total Contribution</p>
              <p className='font-bold text-xl sm:text-2xl'>
                ₦{member.totalContribution.toLocaleString()}
              </p>
            </div>
            <div className='bg-green-50 p-4 rounded-lg'>
              <p className='text-gray-500'>Monthly Contribution</p>
              <p className='font-bold text-xl sm:text-2xl'>
                ₦{member.monthlyContribution.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
