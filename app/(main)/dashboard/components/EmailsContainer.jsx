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
  const [preFetchedEmails, setPreFetchedEmails] = useState([]);
  const [preFetchedNextToken, setPreFetchedNextToken] = useState(null);
  const [preFetchedPrevToken, setPreFetchedPrevToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const EMAILS_PER_PAGE = 7;

  const fetchEmails = async (pageToken = null, isPreFetch = false) => {
    if (!isPreFetch) {
      setLoading(true);
    }
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
          "Fetched email IDs:",
          res.data.emails.map((e) => e.id)
        );
        if (isPreFetch) {
          setPreFetchedEmails(res?.data?.emails);
          setPreFetchedNextToken(res?.data?.nextPageToken);
          setPreFetchedPrevToken(res?.data?.prevPageToken);
        } else {
          setEmailResponse(res?.data);
          setEmails(res?.data?.emails);
          setNextPageToken(res?.data?.nextPageToken);
          setPrevPageToken(res?.data?.prevPageToken);
        }
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      if (!isPreFetch) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEmails(null);
  }, []);

  useEffect(() => {
    if (nextPageToken) {
      fetchEmails(nextPageToken, true);
    }
  }, [nextPageToken]);

  const handlePageChange = async (page) => {
    if (page === currentPage) return;

    let tokenToUse = null;
    if (page === 1) {
      tokenToUse = null;
    } else if (page > currentPage && nextPageToken) {
      if (preFetchedEmails.length > 0) {
        setEmails(preFetchedEmails);
        setNextPageToken(preFetchedNextToken);
        setPrevPageToken(preFetchedPrevToken);
        setEmailResponse({
          ...emailResponse,
          emails: preFetchedEmails,
          nextPageToken: preFetchedNextToken,
          prevPageToken: preFetchedPrevToken,
        });
        setPreFetchedEmails([]);
        setPreFetchedNextToken(null);
        setPreFetchedPrevToken(null);
        setCurrentPage(page);
        return;
      }
      tokenToUse = nextPageToken;
    } else if (page < currentPage && prevPageToken) {
      tokenToUse = prevPageToken;
    } else {
      console.warn("Direct page access not supported without token");
      return;
    }

    await fetchEmails(tokenToUse);
    setCurrentPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleKeywordChange = (keywords) => {
    setSelectedKeywords(keywords);
    setCurrentPage(1);
  };

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    setCurrentPage(1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const handleEmailRead = (emailId) => {
    setEmails(
      emails.map((email) =>
        email.id === emailId ? { ...email, isRead: true } : email
      )
    );
  };

  const handleRefresh = () => {
    fetchEmails(null);
  };

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-[#2D3748] text-2xl font-semibold mb-5">
          Your Top Recipients
        </h2>
        <FilterMails
          onSearch={handleSearch}
          // onKeywordChange={handleKeywordChange} // the issue is here
          onTimePeriodChange={handleTimePeriodChange}
          onDateChange={handleDateChange}
        />
      </div>

      {loading ? (
        <LoadingPing />
      ) : (
        <>
          <div className="rounded-2xl border">
            <EmailTable
              key={currentPage}
              emails={emails}
              user={user}
              onEmailRead={handleEmailRead}
              onRefresh={handleRefresh}
            />

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
              hasPrevPage={currentPage > 1}
            />
          </div>
        </>
      )}
    </div>
  );
}