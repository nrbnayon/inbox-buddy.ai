import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingPlans() {
  // Remove the billingCycle state and tabs-related code

  const plans = [
    {
      name: "Basic",
      price: "$5",
      description: "/mo",
      features: [
        "Connect One inbox",
        "15 queries per day",
        "Basic Summary Function",
        "Standard Support",
        "Limited Third Party Integration",
      ],
      highlighted: false,
    },
    {
      name: "Premium",
      price: "$15",
      description: "/mo",
      features: [
        "Connect three inboxes",
        "100 queries per day",
        "Unlimited AI Agent",
        "Advanced Summaries",
        "Advanced Third Party Integration",
      ],
      highlighted: true,
    },
    {
      name: "Enterpise",
      price: "$50",
      description: "/mo",
      features: [
        "Connect 10 inboxes",
        "Unlimited queries",
        "Unlimited AI Agents",
        "Advanced Summaries",
        "Unlimied Third Party Integration",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center">
        {/* Remove the Tabs component */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col h-full shadow-none border border-[#D9D9D9] rounded-md ${
                plan.highlighted
                  ? "bg-gradient-to-br from-[#00ACDA] to-[#43D4FB] text-white"
                  : ""
              }`}
            >
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-4">
                <div className="flex justify-center items-baseline mb-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-sm ml-1">{plan.description}</span>
                </div>
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-4">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-white text-[#00ACDA] hover:bg-gray-100"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  Select Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
