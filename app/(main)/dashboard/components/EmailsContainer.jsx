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
import { Loader2 } from "lucide-react"; // Assuming you have lucide-react for spinner

export default function EmailsContainer({ user }) {
  const [emails, setEmails] = useState([]);
  const [emailResponse, setEmailResponse] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // For initial or major loads
  const [isPageLoading, setIsPageLoading] = useState(false); // For page transitions
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pageTokens, setPageTokens] = useState({ 1: null }); // Map page numbers to tokens
  const [pageCache, setPageCache] = useState({}); // Cache emails for pages
  const EMAILS_PER_PAGE = 7;

  const fetchEmails = async (
    pageToken = null,
    targetPage = 1,
    isPreFetch = false
  ) => {
    if (!isPreFetch) {
      setIsPageLoading(true);
    }
    try {
      const res = await axiosInstance.get("/emails", {
        params: {
          maxResults: EMAILS_PER_PAGE,
          pageToken,
          provider: user?.authProvider,
          q: searchQuery || undefined,
          _t: Date.now(),
        },
      });

      if (res?.data?.success) {
        console.log(
          "Fetched email IDs:",
          res.data.emails.map((e) => e.id)
        );
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
          // Pre-fetch next and previous pages
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
        console.warn("API response unsuccessful:", res.data);
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

      // Check cache first
      if (pageCache[page]) {
        setEmails(pageCache[page]);
        setCurrentPage(page);
        // Update tokens from stored data or fetch new ones
        const storedNextToken = pageTokens[page + 1] || null;
        const storedPrevToken = pageTokens[page - 1] || null;
        setNextPageToken(storedNextToken);
        setPrevPageToken(storedPrevToken);
        // Pre-fetch next and previous if not already cached
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

      // Check pre-fetched data
      if (page === currentPage + 1 && preFetchedNext.emails.length) {
        setEmails(preFetchedNext.emails);
        setNextPageToken(preFetchedNext.token);
        setPrevPageToken(nextPageToken); // Current page becomes previous
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
        // Pre-fetch next and previous
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
        setNextPageToken(prevPageToken); // Current page becomes next
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
        // Pre-fetch next and previous
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

      // Check stored tokens for direct access
      if (pageTokens[page] !== undefined) {
        await fetchEmails(pageTokens[page], page);
        setCurrentPage(page);
        return;
      }

      // Fallback: Sequential fetch for direct jumps
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
            q: searchQuery || undefined,
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
      searchQuery,
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
    fetchEmails(null, 1);
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
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : emails.length === 0 ? (
        <p className="text-center text-gray-500">No emails found.</p>
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
