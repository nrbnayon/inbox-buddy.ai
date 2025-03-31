import Hero from "@/components/home/Hero";
import { Button } from "@/components/ui/button";

export default async function Home() {
  // await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s delay

  return (
    <>
      <Hero />
    </>
  );
}
