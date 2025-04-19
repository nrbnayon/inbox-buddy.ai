// app\pricing\page.js
import { cookies } from "next/headers";
import PricingPlans from "./components/PricingPlans";

export default async function pricingPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken");
  return (
    <section className="flex flex-col h-full items-center justify-center mt-8 md:mt-28">
      <h1 className="font-bold text-5xl md:text-6xl text-center">
        Subscription that fit like a glove
      </h1>
      <PricingPlans accessToken={token?.value} />
    </section>
  );
}
