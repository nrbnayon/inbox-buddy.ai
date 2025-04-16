// app\(main)\dashboard\components\EmailsContainer.jsx
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
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [selectedDate, setSelectedDate] = useState(null); // Changed to null initially
  const [pageTokens, setPageTokens] = useState({ 1: null });
  const [pageCache, setPageCache] = useState({});
  const EMAILS_PER_PAGE = 7;

  // Function to compute the full Gmail search query
  const computeQuery = useCallback(() => {
    let qParts = [];

    // Add search term if present
    if (searchQuery) {
      qParts.push(searchQuery);
    }

    // Add keywords with OR logic, wrapped in quotes if they contain spaces
    if (selectedKeywords.length > 0) {
      const keywordsPart = selectedKeywords
        .map((k) => (k.includes(" ") ? `"${k}"` : k)) // Quote keywords with spaces
        .join(" OR "); // Use OR instead of AND
      qParts.push(`(${keywordsPart})`); // e.g., "(subscriptions)"
    }

    // Add date or time period filters
    if (selectedDate) {
      const dateStr = selectedDate
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/"); // Format as YYYY/MM/DD
      qParts.push(`after:${dateStr}`);
    }
    if (timePeriod) {
      const today = new Date();
      let afterDate;
      if (timePeriod === "daily") {
        afterDate = new Date(today.setDate(today.getDate() - 1)); // Last 24 hours
      } else if (timePeriod === "weekly") {
        afterDate = new Date(today.setDate(today.getDate() - 7)); // Last week
      } else if (timePeriod === "monthly") {
        afterDate = new Date(today.setMonth(today.getMonth() - 1)); // Last month
      }
      if (afterDate) {
        const afterStr = afterDate
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "/");
        qParts.push(`after:${afterStr}`);
      }
    }

    return qParts.join(" ") || undefined;
  }, [searchQuery, selectedKeywords, timePeriod, selectedDate]);

  const fetchEmails = async (
    pageToken = null,
    targetPage = 1,
    isPreFetch = false
  ) => {
    if (!isPreFetch) {
      setIsPageLoading(true);
    }
    try {
      const q = computeQuery();
      const res = await axiosInstance.get("/emails", {
        params: {
          maxResults: EMAILS_PER_PAGE,
          pageToken,
          provider: user?.authProvider,
          q,
          _t: Date.now(),
        },
      });

      if (res?.data?.success) {
        const fetchedEmails = (res.data.emails || []).slice(0, EMAILS_PER_PAGE);
        if (isPreFetch) {
          return {
            emails: fetchedEmails,
            nextPageToken: res.data.nextPageToken || null,
            prevPageToken: res.data.prevPageToken || null,
          };
        } else {
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
            const nextData = await fetchEmails(
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
            const prevData = await fetchEmails(
              res.data.prevPageToken,
              targetPage - 1,
              true
            );
            setPreFetchedPrev({
              emails: prevData.emails,
              token: prevData.prevPageToken,
            });
          }
        }
        return {
          emails: fetchedEmails,
          nextPageToken: res.data.nextPageToken,
          prevPageToken: res.data.prevPageToken,
        };
      } else {
        if (!isPreFetch) {
          setEmails([]);
          setEmailResponse({});
        }
        return { emails: [], nextPageToken: null, prevPageToken: null };
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
      if (!isPreFetch) {
        setEmails([]);
        setEmailResponse({});
      }
      return { emails: [], nextPageToken: null, prevPageToken: null };
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
    setPreFetchedNext({ emails: [], token: null });
    setPreFetchedPrev({ emails: [], token: null });
    fetchEmails(null, 1);
  }, [searchQuery, selectedKeywords, timePeriod, selectedDate]);

  const handlePageChange = useCallback(
    async (page) => {
      if (page === currentPage) return;

      if (pageCache[page]) {
        setEmails(pageCache[page]);
        setCurrentPage(page);
        const storedNextToken = pageTokens[page + 1] || null;
        const storedPrevToken = pageTokens[page - 1] || null;
        setNextPageToken(storedNextToken);
        setPrevPageToken(storedPrevToken);
        if (storedNextToken && !pageCache[page + 1]) {
          const nextData = await fetchEmails(storedNextToken, page + 1, true);
          setPreFetchedNext({
            emails: nextData.emails,
            token: nextData.nextPageToken,
          });
          setPageCache((prev) => ({ ...prev, [page + 1]: nextData.emails }));
        }
        if (storedPrevToken && !pageCache[page - 1] && page > 1) {
          const prevData = await fetchEmails(storedPrevToken, page - 1, true);
          setPreFetchedPrev({
            emails: prevData.emails,
            token: prevData.prevPageToken,
          });
          setPageCache((prev) => ({ ...prev, [page - 1]: prevData.emails }));
        }
        return;
      }

      if (page === currentPage + 1 && preFetchedNext.emails.length) {
        setEmails(preFetchedNext.emails);
        setNextPageToken(preFetchedNext.token);
        setPrevPageToken(nextPageToken);
        setEmailResponse((prev) => ({
          ...prev,
          emails: preFetchedNext.emails,
          nextPageToken: preFetchedNext.token,
          prevPageToken: nextPageToken,
        }));
        setPageTokens((prev) => ({
          ...prev,
          [page]: nextPageToken,
          [page + 1]: preFetchedNext.token || null,
        }));
        setPageCache((prev) => ({ ...prev, [page]: preFetchedNext.emails }));
        setPreFetchedNext({ emails: [], token: null });
        setCurrentPage(page);
        if (preFetchedNext.token) {
          const nextData = await fetchEmails(
            preFetchedNext.token,
            page + 1,
            true
          );
          setPreFetchedNext({
            emails: nextData.emails,
            token: nextData.nextPageToken,
          });
          setPageCache((prev) => ({ ...prev, [page + 1]: nextData.emails }));
        }
        if (nextPageToken && page > 1) {
          const prevData = await fetchEmails(nextPageToken, page - 1, true);
          setPreFetchedPrev({
            emails: prevData.emails,
            token: prevData.prevPageToken,
          });
          setPageCache((prev) => ({ ...prev, [page - 1]: prevData.emails }));
        }
        return;
      }

      if (page === currentPage - 1 && preFetchedPrev.emails.length) {
        setEmails(preFetchedPrev.emails);
        setNextPageToken(prevPageToken);
        setPrevPageToken(preFetchedPrev.token);
        setEmailResponse((prev) => ({
          ...prev,
          emails: preFetchedPrev.emails,
          nextPageToken: prevPageToken,
          prevPageToken: preFetchedPrev.token,
        }));
        setPageTokens((prev) => ({
          ...prev,
          [page]: prevPageToken,
          [page - 1]: preFetchedPrev.token || null,
        }));
        setPageCache((prev) => ({ ...prev, [page]: preFetchedPrev.emails }));
        setPreFetchedPrev({ emails: [], token: null });
        setCurrentPage(page);
        if (prevPageToken) {
          const nextData = await fetchEmails(prevPageToken, page + 1, true);
          setPreFetchedNext({
            emails: nextData.emails,
            token: nextData.nextPageToken,
          });
          setPageCache((prev) => ({ ...prev, [page + 1]: nextData.emails }));
        }
        if (preFetchedPrev.token && page > 1) {
          const prevData = await fetchEmails(
            preFetchedPrev.token,
            page - 1,
            true
          );
          setPreFetchedPrev({
            emails: prevData.emails,
            token: prevData.prevPageToken,
          });
          setPageCache((prev) => ({ ...prev, [page - 1]: prevData.emails }));
        }
        return;
      }

      if (pageTokens[page] !== undefined) {
        await fetchEmails(pageTokens[page], page);
        setCurrentPage(page);
        return;
      }

      console.warn(
        `No direct token for page ${page}, attempting sequential fetch`
      );
      const closestPage = Object.keys(pageTokens)
        .map(Number)
        .reduce((prev, curr) =>
          Math.abs(curr - page) < Math.abs(prev - page) ? curr : prev
        );
      let currentToken = pageTokens[closestPage];
      let currentFetchPage = closestPage;

      while (currentFetchPage < page && currentToken) {
        const res = await axiosInstance.get("/emails", {
          params: {
            maxResults: EMAILS_PER_PAGE,
            pageToken: currentToken,
            provider: user?.authProvider,
            q: computeQuery(),
            _t: Date.now(),
          },
        });
        if (res?.data?.success) {
          currentFetchPage++;
          currentToken = res.data.nextPageToken || null;
          setPageTokens((prev) => ({
            ...prev,
            [currentFetchPage]: currentToken,
          }));
          setPageCache((prev) => ({
            ...prev,
            [currentFetchPage]: (res.data.emails || []).slice(
              0,
              EMAILS_PER_PAGE
            ),
          }));
        } else {
          console.error("Failed to fetch intermediate page");
          setIsPageLoading(false);
          return;
        }
      }

      if (currentFetchPage === page) {
        await fetchEmails(currentToken, page);
        setCurrentPage(page);
      } else {
        console.error(`Could not reach page ${page}`);
        setIsPageLoading(false);
      }
    },
    [
      currentPage,
      nextPageToken,
      prevPageToken,
      preFetchedNext,
      preFetchedPrev,
      emailResponse,
      pageTokens,
      pageCache,
      user?.authProvider,
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

  const handleTimePeriodChange = useCallback((period) => {
    setTimePeriod(period);
    setSelectedDate(null); // Reset date when changing time period
    setCurrentPage(1);
    setPreFetchedNext({ emails: [], token: null });
    setPreFetchedPrev({ emails: [], token: null });
    setNextPageToken(null);
    setPrevPageToken(null);
    setPageTokens({ 1: null });
    setPageCache({});
  }, []);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    setTimePeriod(null); // Reset time period when selecting a date
    setCurrentPage(1);
    setPreFetchedNext({ emails: [], token: null });
    setPreFetchedPrev({ emails: [], token: null });
    setNextPageToken(null);
    setPrevPageToken(null);
    setPageTokens({ 1: null });
    setPageCache({});
  }, []);

  // In EmailsContainer.jsx

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

  const fetchImportantEmails = async () => {
    setIsLoading(true); // Start loading indicator
    try {
      const res = await axiosInstance.get("/emails/important", {
        params: {
          q: computeQuery(),
          keywords: selectedKeywords.join(","),
          timeRange: timePeriod,
          date: selectedDate
            ? selectedDate.toISOString().split("T")[0]
            : undefined, // e.g., "2025-03-16"
        },
      });

      console.log(`Important emails response: ${res.data}`); // Log the response
      if (res?.data?.success) {
        setEmails(res.data.emails); // Update email list
      } else {
        setEmails([]); // Clear emails if no success
      }
    } catch (error) {
      console.error("Error fetching important emails:", error);
      setEmails([]); // Clear emails on error
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  const handleRefresh = useCallback(() => {
    setPreFetchedNext({ emails: [], token: null });
    setPreFetchedPrev({ emails: [], token: null });
    setNextPageToken(null);
    setPrevPageToken(null);
    setPageTokens({ 1: null });
    setPageCache({});
    fetchEmails(null, 1);
    fetchImportantEmails();
  }, []);

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-[#2D3748] text-2xl font-semibold mb-5">
          Your Top Recipients
        </h2>
        <FilterMails
          onSearch={handleSearch}
          onKeywordChange={handleKeywordChange}
          onTimePeriodChange={handleTimePeriodChange}
          onDateChange={handleDateChange}
        />
      </div>

      {isLoading ? (
        <EmailTableSkeleton />
      ) : emails.length === 0 ? (
        <div className="text-center py-4">
          <p>No emails found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border relative">
            {isPageLoading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
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
