// app\(main)\dashboard\page.js
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import mail from "@/public/mail.png";
import meeting from "@/public/meeting.png";
import { axiosInstance } from "@/lib/axios";
import { cookies } from "next/headers";
// import { getUserData } from "@/lib/server-api";
import EmailsContainer from "./components/EmailsContainer";
import { getUserProfile } from "@/lib/api/user";
import { redirect } from "next/navigation";

export default async function dashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  const res = await getUserProfile(token?.value);

  const user = res?.data;
  let unreadEmailsCount = 0;
  let meetingsCount = 0;

  if (!user?._id) {
    return redirect("/login");
  }

  if (token?.value && user?._id) {
    try {
      // Fetch unread emails count
      const unreadEmailsResponse = await axiosInstance.get(
        "/emails?filter=unread"
      );

      // const tempres = await axiosInstance.get("/emails?filter=important");
      // console.log(tempres?.data?.emails?.length);
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
    <section className="flex flex-col w-full p-2 pb-6">
      <div className="sticky top-0 bg-white pb-5 z-50">
        {/* welcome messages */}
        <h1 className="text-3xl font-bold mb-3">Hi {user?.name || "N/A"},</h1>
        <p className="inline-flex items-center gap-2">
          <FaCheckCircle color="#68D391" />
          Here&apos;s the latest. Let me know how I can help!
        </p>

        {/* statics */}
        <div className="flex mt-6 gap-4 md:gap-16 w-full">
          {/* unread mails */}
          <div className="flex gap-3">
            <Image src={mail} alt="gmail logo" className="size-11" />
            <div className="flex flex-col">
              <p className="text-[#A0AEC0]">Unread Emails</p>
              <h4 className="text-[#2D3748]">{unreadEmailsCount || 0}</h4>
            </div>
          </div>

          {/* upcomming meetings */}
          <div className="flex gap-3">
            <Image src={meeting} alt="gmail logo" className="size-11" />
            <div className="flex flex-col">
              <p className="text-[#A0AEC0]">Meetings this week</p>
              <h4 className="text-[#2D3748]">{meetingsCount || 0}</h4>
            </div>
          </div>

          {/* search bar */}
          {/* <div className="hidden md:flex">
          <SearchBar />
        </div> */}
        </div>
      </div>

      {/* mails */}
      <EmailsContainer user={user} />
    </section>
  );
}
