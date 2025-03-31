import React from "react";
import ProviderIcon from "./ProviderIcon";
import slack from "@/public/Slack.png";
import outlook from "@/public/outlook.png";
import gmail from "@/public/gmail.png";
import notion from "@/public/notion.png";
import asana from "@/public/asana.png";
import Marquee from "react-fast-marquee";

export default function AllProviders() {
  return (
    <>
      {/* Marquee for smaller screens (visible below md, hidden on md and above) */}
      <div className="block md:hidden mt-10 pb-10">
        <Marquee play={true}>
          <div className="flex justify-center gap-8 mt-6 mr-8 md:mr-0">
            <ProviderIcon image={outlook} title={"outlook"} />
            <ProviderIcon image={gmail} title={"gmail"} />
            <ProviderIcon image={slack} title={"slack"} commingSoon={true} />
            <ProviderIcon image={notion} title={"notion"} commingSoon={true} />
            <ProviderIcon image={asana} title={"asana"} commingSoon={true} />
          </div>
        </Marquee>
      </div>

      {/* Static layout for larger screens (hidden below md, visible on md and above) */}
      <div className="hidden md:block sm:mt-2">
        <div className="flex justify-center gap-10">
          <ProviderIcon image={outlook} title={"outlook"} />
          <ProviderIcon image={gmail} title={"gmail"} />
          <ProviderIcon image={slack} title={"slack"} commingSoon={true} />
          <ProviderIcon image={notion} title={"notion"} commingSoon={true} />
          <ProviderIcon image={asana} title={"asana"} commingSoon={true} />
        </div>
      </div>
    </>
  );
}
