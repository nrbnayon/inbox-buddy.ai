"use client";

import React, { useEffect, useState, useCallback } from "react";
import FilterMails from "./FilterMails";
import EmailTable from "./EmailTable";
import Image from "next/image";
import Link from "next/link";
import { RiSparkling2Line } from "react-icons/ri";
import { EmailPagination } from "./EmailPagination";
import gmail from "@/public/gmail.png";
import { axiosInstance } from "@/lib/axios";
import { Loader2 } from "lucide-react";
import EmailTableSkeleton from "./EmailTableSkeleton";
import LoadingPing from "@/components/LoadingPing";

export default function EmailsContainer({ user }) {
  const [emails, setEmails] = useState([]);
  const [emailResponse, setEmailResponse] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [preFetchedNext, setPreFetchedNext] = useState({
    emails: [],
    token: null,
  });
  const [preFetchedPrev, setPreFetchedPrev] = useState({
    emails: [],
    token: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [timePeriod, setTimePeriod] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [pageTokens, setPageTokens] = useState({ 1: null });
  const [pageCache, setPageCache] = useState({});
  const EMAILS_PER_PAGE = 7;

  const computeQuery = useCallback(() => {
    let qParts = [];
    if (searchQuery) {
      qParts.push(searchQuery);
    }
    if (selectedKeywords.length > 0) {
      const keywordsPart = selectedKeywords
        .map((k) => (k.includes(" ") ? `"${k}"` : k))
        .join(" OR ");
      qParts.push(`(${keywordsPart})`);
    }
    return qParts.join(" ") || undefined;
  }, [searchQuery, selectedKeywords]);

  const formatTimeFilter = useCallback(() => {
    if (selectedDate) {
      return selectedDate.toISOString().split("T")[0].replace(/-/g, "/");
    }
    switch (timePeriod) {
      case "daily":
      case "weekly":
      case "monthly":
        return timePeriod;
      case "yesterday": {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split("T")[0].replace(/-/g, "/");
      }
      case "last week": {
        const today = new Date();
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - 7);
        return lastWeekEnd.toISOString().split("T")[0].replace(/-/g, "/");
      }
      case "last month": {
        const today = new Date();
        const lastMonthEnd = new Date(today);
        lastMonthEnd.setMonth(today.getMonth() - 1);
        return lastMonthEnd.toISOString().split("T")[0].replace(/-/g, "/");
      }
      case "all":
      default:
        return undefined;
    }
  }, [selectedDate, timePeriod]);

  const fetchEmails = async (pageToken = null, targetPage = 1) => {
    setIsPageLoading(true);
    try {
      const q = computeQuery();
      const timeFilter = formatTimeFilter();
      const res = await axiosInstance.get("/emails", {
        params: {
          maxResults: EMAILS_PER_PAGE,
          pageToken,
          provider: user?.authProvider,
          q,
          timeFilter,
          _t: Date.now(),
        },
      });

      if (res?.data?.success) {
        // console.log(res?.data);
        const fetchedEmails = (res.data.emails || []).slice(0, EMAILS_PER_PAGE);
        setEmailResponse({ ...res.data, emails: fetchedEmails });
        setEmails(fetchedEmails);
        setNextPageToken(res.data.nextPageToken || null);
        setPrevPageToken(res.data.prevPageToken || null);
        setPageTokens((prev) => ({
          ...prev,
          [targetPage]: pageToken,
          [targetPage + 1]: res.data.nextPageToken || null,
          [targetPage - 1]: res.data.prevPageToken || null,
        }));
        setPageCache((prev) => ({ ...prev, [targetPage]: fetchedEmails }));
      } else {
        setEmails([]);
        setEmailResponse({});
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
      setEmails([]);
      setEmailResponse({});
    } finally {
      setIsPageLoading(false);
      setIsLoading(false);
    }
  };

  const fetchImportantEmails = async (
    pageToken = null,
    targetPage = 1,
    isPreFetch = false
  ) => {
    if (!isPreFetch) setIsPageLoading(true);
    try {
      const timeFilter = formatTimeFilter();
      console.log("Sending timeFilter for important emails:", timeFilter);
      const res = await axiosInstance.get("/emails/important", {
        params: {
          maxResults: 500,
          pageToken,
          keywords: selectedKeywords.join(","),
          timeFilter,
        },
      });
      if (res?.data?.success) {
        const fetchedEmails = (res.data.messages || []).slice(
          0,
          EMAILS_PER_PAGE
        );
        if (isPreFetch) {
          return {
            emails: fetchedEmails,
            nextPageToken: res.data.nextPageToken || null,
            prevPageToken: res.data.prevPageToken || null,
          };
        }
        setEmailResponse({
          ...res.data,
          emails: fetchedEmails,
        });
        setEmails(fetchedEmails);
        setNextPageToken(res.data.nextPageToken || null);
        setPrevPageToken(res.data.prevPageToken || null);
        setPageTokens((prev) => ({
          ...prev,
          [targetPage]: pageToken,
          [targetPage + 1]: res.data.nextPageToken || null,
          [targetPage - 1]: res.data.prevPageToken || null,
        }));
        setPageCache((prev) => ({
          ...prev,
          [targetPage]: fetchedEmails,
        }));
        if (res.data.nextPageToken) {
          const nextData = await fetchImportantEmails(
            res.data.nextPageToken,
            targetPage + 1,
            true
          );
          setPreFetchedNext({
            emails: nextData.emails,
            token: nextData.nextPageToken,
          });
        }
        if (res.data.prevPageToken && targetPage > 1) {
          const prevData = await fetchImportantEmails(
            res.data.prevPageToken,
            targetPage - 1,
            true
          );
          setPreFetchedPrev({
            emails: prevData.emails,
            token: prevData.prevPageToken,
          });
        }
      } else {
        console.warn(
          "Important emails fetch failed, falling back to /emails with q=meeting"
        );
        return await fetchEmails(pageToken, targetPage, isPreFetch, "meeting");
      }
    } catch (error) {
      console.error("Error fetching important emails:", error);
      console.warn("Falling back to /emails with q=meeting");
      return await fetchEmails(pageToken, targetPage, isPreFetch, "meeting");
    } finally {
      if (!isPreFetch) {
        setIsPageLoading(false);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setPageTokens({ 1: null });
    setPageCache({});
    fetchEmails(null, 1);
  }, [searchQuery, selectedKeywords, timePeriod, selectedDate]);

  const handlePageChange = useCallback(
    async (page) => {
      if (page === currentPage || pageCache[page]) {
        if (pageCache[page]) {
          setEmails(pageCache[page]);
          setCurrentPage(page);
          setNextPageToken(pageTokens[page + 1] || null);
          setPrevPageToken(pageTokens[page - 1] || null);
        }
        return;
      }
      await fetchEmails(pageTokens[page] || null, page);
      setCurrentPage(page);
    },
    [
      currentPage,
      pageTokens,
      pageCache,
      user?.authProvider,
      selectedKeywords,
      timePeriod,
      selectedDate,
    ]
  );

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setPreFetchedNext({ emails: [], token: null });
    setPreFetchedPrev({ emails: [], token: null });
    setNextPageToken(null);
    setPrevPageToken(null);
    setPageTokens({ 1: null });
    setPageCache({});
  }, []);

  const handleKeywordChange = useCallback((keywords) => {
    setSelectedKeywords(keywords);
    setCurrentPage(1);
    setPreFetchedNext({ emails: [], token: null });
    setPreFetchedPrev({ emails: [], token: null });
    setNextPageToken(null);
    setPrevPageToken(null);
    setPageTokens({ 1: null });
    setPageCache({});
  }, []);

  const handleTimePeriodChange = useCallback(
    (period) => {
      console.log("Time period changed to:", period);
      setTimePeriod(period);
      if (selectedDate) {
        setSelectedDate(null);
      }
      setCurrentPage(1);
      setPreFetchedNext({ emails: [], token: null });
      setPreFetchedPrev({ emails: [], token: null });
      setNextPageToken(null);
      setPrevPageToken(null);
      setPageTokens({ 1: null });
      setPageCache({});
    },
    [selectedDate]
  );

  const handleDateChange = useCallback((date) => {
    console.log("Date changed to:", date);
    setSelectedDate(date);
    setTimePeriod("all");
    setCurrentPage(1);
    setPreFetchedNext({ emails: [], token: null });
    setPreFetchedPrev({ emails: [], token: null });
    setNextPageToken(null);
    setPrevPageToken(null);
    setPageTokens({ 1: null });
    setPageCache({});
  }, []);

  const handleEmailRead = useCallback(
    (emailId) => {
      setEmails((prev) =>
        prev.map((email) =>
          email.id === emailId ? { ...email, isRead: true } : email
        )
      );
      setPageCache((prev) => ({
        ...prev,
        [currentPage]: prev[currentPage].map((email) =>
          email.id === emailId ? { ...email, isRead: true } : email
        ),
      }));
    },
    [currentPage]
  );

  const handleRefresh = useCallback(() => {
    setPreFetchedNext({ emails: [], token: null });
    setPreFetchedPrev({ emails: [], token: null });
    setNextPageToken(null);
    setPrevPageToken(null);
    setPageTokens({ 1: null });
    setPageCache({});
    if (selectedKeywords.length > 0) {
      fetchImportantEmails();
    } else {
      fetchEmails(null, 1);
    }
  }, [selectedKeywords]);

  // console.log(emailResponse);

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-[#2D3748] text-2xl font-semibold mb-5">
          Here is your last {EMAILS_PER_PAGE} emails:
        </h2>
        {/* <FilterMails
          onSearch={handleSearch}
          onKeywordChange={handleKeywordChange}
          onTimePeriodChange={handleTimePeriodChange}
          onDateChange={handleDateChange}
        /> */}
      </div>

      {isLoading ? (
        <EmailTableSkeleton />
      ) : isPageLoading ? (
        <div className="text-center py-4">
          {/* <Loader2 className="animate-spin mx-auto" /> */}
          <EmailTableSkeleton />
          {/* <button
            onClick={() => fetchEmails(pageTokens[currentPage], currentPage)}
            className="mt-2 text-blue-500"
          >
            Retry
          </button> */}
        </div>
      ) : emails.length === 0 ? (
        <div className="text-center py-4">
          <p>No emails found matching your criteria.</p>
        </div>
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

            {/* <EmailPagination
              totalEmails={emailResponse?.totalEmails || 0}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              emailsPerPage={EMAILS_PER_PAGE}
              hasNextPage={!!nextPageToken}
              hasPrevPage={currentPage > 1}
            /> */}
          </div>
        </>
      )}
    </div>
  );
}
