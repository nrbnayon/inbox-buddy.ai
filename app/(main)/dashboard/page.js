// app\(main)\dashboard\page.js

import { EmailPagination } from "./components/EmailPagination";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import mail from "@/public/mail.png";
import meeting from "@/public/meeting.png";
import FilterMails from "./components/FilterMails";
import Link from "next/link";
import EmailTable from "./components/EmailTable";
import { axiosInstance } from "@/lib/axios";
import { cookies } from "next/headers";
import { getUserData } from "@/lib/server-api";
import EmailsContainer from "./components/EmailsContainer";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  let user;
  let unreadEmailsCount = 0;
  let meetingsCount = 0;

  if (token?.value) {
    try {
      // Fetch user data
      const userResponse = await getUserData(token.value);
      user = userResponse?.data;

      // Fetch unread emails count
      const unreadEmailsResponse = await axiosInstance.get(
        "/emails?filter=unread"
      );
      unreadEmailsCount = unreadEmailsResponse.data?.emails?.length || 0;

      // Fetch meetings count
      const meetingsResponse = await axiosInstance.get(
        "/emails/all/search?query=meeting"
      );
      meetingsCount = meetingsResponse.data?.emails?.length || 0;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  return (
    <section className="flex flex-col w-full p-2 md:p-0">
      {/* welcome messages */}
      <h1 className="text-3xl font-bold mb-3">Hi {user?.name || "User"},</h1>
      <p className="inline-flex items-center gap-2">
        <FaCheckCircle color="#68D391" />
        Here's the latest. Let me know how I can help!
      </p>

      {/* statics */}
      <div className="flex mt-6 gap-4 md:gap-16 w-full">
        {/* unread mails */}
        <div className="flex gap-3">
          <Image src={mail} alt="gmail logo" className="size-11" />
          <div className="flex flex-col">
            <p className="text-[#A0AEC0]">Unread Emails</p>
            <h4 className="text-[#2D3748]">{unreadEmailsCount}</h4>
          </div>
        </div>

        {/* upcoming meetings */}
        <div className="flex gap-3">
          <Image src={meeting} alt="gmail logo" className="size-11" />
          <div className="flex flex-col">
            <p className="text-[#A0AEC0]">Meetings this week</p>
            <h4 className="text-[#2D3748]">{meetingsCount}</h4>
          </div>
        </div>
      </div>

      {/* mails */}
      <EmailsContainer user={user} />
    </section>
  );
}