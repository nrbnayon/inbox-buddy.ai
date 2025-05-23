// app/cancel/page.jsx
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your subscription process was cancelled. No charges have been made.
          You can try again whenever you're ready.
        </p>
        <div className="flex flex-col gap-3">
          {/* <Button
            variant="blueGradient"
            onClick={() => redirect("/pricing")}
            className="w-full"
          >
            Return to Pricing
          </Button> */}
          <Button
            onClick={() => redirect("/chat")}
            variant="outline"
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
