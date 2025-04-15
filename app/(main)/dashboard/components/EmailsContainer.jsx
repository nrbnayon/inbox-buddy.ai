// app\(main)\dashboard\components\EmailsContainer.jsx
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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [pageTokens, setPageTokens] = useState([]); // Store tokens for each page
  const EMAILS_PER_PAGE = 5;

  const fetchEmails = async (pageToken = null, targetPage) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/emails", {
        params: {
          maxResults: EMAILS_PER_PAGE,
          pageToken,
          provider: user?.authProvider,
          _t: Date.now(),
        },
      });

      if (res?.data?.success) {
        console.log(
          "Received emails:",
          res.data.emails.map((e) => e.id)
        );
        setEmailResponse(res?.data);
        setEmails(res?.data?.emails);
        setNextPageToken(res?.data?.nextPageToken);
        setPrevPageToken(res?.data?.prevPageToken);

        if (pageToken && targetPage > 1) {
          setPageTokens((prev) => {
            const newTokens = [...prev];
            newTokens[targetPage - 2] = pageToken;
            return newTokens;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails(null, 1); // Initial fetch for page 1
  }, []);

  const handlePageChange = async (page) => {
    if (page === currentPage) return;

    let tokenToUse = null;

    if (page === 1) {
      // Go to first page, no token needed
      tokenToUse = null;
    } else if (page > currentPage) {
      // Moving forward
      tokenToUse = nextPageToken;
    } else {
      // Moving backward
      tokenToUse = pageTokens[page - 2] || prevPageToken; // Use token for the previous page
    }

    await fetchEmails(tokenToUse, page);
    setCurrentPage(page);
  };

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-[#2D3748] text-2xl font-semibold mb-5">
          Your Top Recipients
        </h2>
        <FilterMails />
      </div>

      {loading ? (
        <LoadingPing />
      ) : (
        <>
          <div className="rounded-2xl border">
            <EmailTable key={currentPage} emails={emails} user={user} />

            <div className="block xl:hidden p-2">
              <div className="max-h-[40vh] overflow-y-auto space-y-4 messages">
                {emails.map((email) => (
                  <div
                    key={email.id}
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
                      <span className="font-medium">{user?.authProvider}</span>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <span className="font-semibold">From:</span>{" "}
                        {email.from}
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
                        {email.preview || email.snippet}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-end justify-between mt-8 md:items-center">
            <Link
              href="/chat"
              className="link-btn w-[230px] px-6 py-2 rounded-full hidden xl:flex items-center gap-2"
            >
              <RiSparkling2Line />
              <span>Ask AI For Help</span>
            </Link>

            <EmailPagination
              totalEmails={emailResponse?.totalEmails || 0}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              emailsPerPage={EMAILS_PER_PAGE}
              hasNextPage={!!nextPageToken}
              hasPrevPage={!!prevPageToken || currentPage > 1}
            />
          </div>
        </>
      )}
    </div>
  );
}