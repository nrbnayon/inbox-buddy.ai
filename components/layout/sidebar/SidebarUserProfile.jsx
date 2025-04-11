"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserProfile = ({ user, imageSrc, openProfileModal, className = "" }) => {
  return (
    <button
      onClick={openProfileModal}
      className={`flex items-center gap-3 font-bold w-full text-left ${className}`}
    >
      {/* Log the src just before rendering */}
      <Avatar>
        <AvatarImage src={imageSrc} alt={user?.name} />
        <AvatarFallback className="bg-gradient-to-r from-[#00ACDA] to-[#43D4FB] text-sm">
          {user?.name?.charAt(0) || "N/A"}
        </AvatarFallback>
      </Avatar>
      {/* <Image
        src={imageSrc || "/placeholder.svg"}
        alt="profile picture"
        width={100}
        height={100}
      /> */}
      <div>
        <h4 className="font-semibold text-[20px]">{user?.name || "N/A"}</h4>
        <span className="text-xs font-light text-[#101010]">
          {user?.email || "N/A"}
        </span>
      </div>
    </button>
  );
};

export default UserProfile;
