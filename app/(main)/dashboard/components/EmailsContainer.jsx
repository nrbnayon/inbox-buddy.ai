import React from "react";
import EmailCard from "./EmailCard";

export default function EmailsContainer() {
  return (
    <div className="flex flex-col gap-4 overflow-y-scroll messages">
      <EmailCard />
      <EmailCard />
      <EmailCard />
      {/* <EmailCard />
      <EmailCard />
      <EmailCard />
      <EmailCard />
      <EmailCard />
      <EmailCard /> */}
    </div>
  );
}
