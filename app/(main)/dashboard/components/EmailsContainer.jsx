"use client";

import React, { useEffect, useState } from "react";
import FilterMails from "./FilterMails";
import EmailTable from "./EmailTable";
import Image from "next/image";
import Link from "next/link";
import { RiSparkling2Line } from "react-icons/ri";
import { EmailPagination } from "./EmailPagination";
import gmail from "@/public/gmail.png";
import { axiosInstance } from "@/lib/axios";
import LoadingPing from "@/components/LoadingPing";

export default function EmailsContainer({ user }) {
  const [emails, setEmails] = useState([]);
  const [emailResponse, setEmailResponse] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      const res = await axiosInstance.get("/emails?maxResults=6");

      if (res?.data?.success) {
        setLoading(false);
        setEmailResponse(res?.data);
        setEmails(res?.data?.emails);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-[#2D3748] text-2xl font-semibold mb-5">
          Your Top Recipients
        </h2>
        {/* <div className="block md:hidden">
            <SearchBar />
          </div> */}
        <FilterMails />
      </div>

      {loading ? (
        <LoadingPing />
      ) : (
        <>
          {/* emails table */}
          <div className="rounded-2xl border">
            {/* Table for larger screens */}
            <EmailTable emails={emails} user={user} />

            {/* Card layout with scrollbar for smaller screens */}
            <div className="block xl:hidden p-2">
              <div className="max-h-[40vh] overflow-y-auto space-y-4 messages">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                  >
                    <div className="flex items-center mb-2">
                      <Image
                        src={gmail}
                        width={24}
                        height={24}
                        alt="Gmail"
                        className="mr-2"
                      />
                      <span className="font-medium">{email.provider}</span>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {email.name}
                      </p>
                      <p>
                        <span className="font-semibold">Subject:</span>{" "}
                        {email.subject}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {email.date}
                      </p>
                      <p>
                        <span className="font-semibold">Preview:</span>{" "}
                        {email.preview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* paginations */}
          <div className="flex flex-col md:flex-row items-end justify-between mt-8 md:items-center">
            <Link
              href="/chat"
              className="link-btn w-[230px] px-6 py-2 rounded-full hidden xl:flex items-center gap-2"
            >
              <RiSparkling2Line />
              <span>Ask Ai For Help</span>
            </Link>

            <EmailPagination
              totalEmails={emailResponse?.totalEmails}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
