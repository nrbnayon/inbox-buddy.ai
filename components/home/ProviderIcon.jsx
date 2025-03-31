import Image from "next/image";
import React from "react";

export default function ProviderIcon({ image, title, commingSoon }) {
  return (
    <div className="flex-1 w-[115px] gap-2">
      <div className="flex flex-col justify-between flex-1 items-center gap-3 w-full">
        <div className="w-[75px] h-[65px] flex justify-center">
          <Image src={image} alt={title} width={100} height={100} />
        </div>

        {commingSoon && (
          <p className="link-btn text-[10px] md:text-[12px] rounded-full text-center py-1 px-4">
            Coming Soon!
          </p>
        )}
      </div>
    </div>
  );
}
