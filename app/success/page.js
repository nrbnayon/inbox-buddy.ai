// app/success/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      // If we have a session ID, refresh the user data to get updated subscription info
      const fetchData = async () => {
        try {
          await refreshUser();
          setLoading(false);
        } catch (error) {
          console.error("Error refreshing user data:", error);
          setLoading(false);
        }
      };

      fetchData();
    } else {
      // If there's no session ID in the URL, just stop loading
      setLoading(false);
    }
  }, [searchParams, refreshUser]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center'>
        <CheckCircle className='w-16 h-16 mx-auto text-green-500 mb-4' />
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>
          Payment Successful!
        </h1>
        <p className='text-gray-600 mb-6'>
          Thank you for your subscription. Your account has been upgraded and
          your new features are now available.
        </p>
        <div className='flex flex-col gap-3'>
          <Button onClick={() => router.push("/dashboard")} className='w-full'>
            Go to Dashboard
          </Button>
          <Button
            onClick={() => router.push("/profile")}
            variant='outline'
            className='w-full'
          >
            View Subscription Details
          </Button>
        </div>
      </div>
    </div>
  );
}
