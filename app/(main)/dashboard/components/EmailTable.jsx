// app\(main)\dashboard\components\EmailTable.jsx
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import gmail from "@/public/gmail.png";
import outlook from "@/public/outlook.png";
import { Reply, Trash2, FileText } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { axiosInstance } from "@/lib/axios";
import { Textarea } from "@/components/ui/textarea";

const extractEmail = (fromString) => {
  const match = fromString.match(/<([^>]+)>/);
  return match ? match[1] : fromString;
};

export default function EmailTable({ emails, user, onEmailRead, onRefresh }) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const markAsRead = async (emailId) => {
    try {
      console.log(`Marking email as read: ${emailId}`);
      const response = await axiosInstance.patch(
        `/emails/mark-as-read/${emailId}`
      );
      console.log("Mark as read response:", response.data);
      if (response.data.success) {
        if (onEmailRead) onEmailRead(emailId);
      }
    } catch (error) {
      console.error("Failed to mark email as read:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        request: error.request,
      });
    }
  };

  const handleRowClick = async (email) => {
    setSelectedEmail(email);
    setIsDialogOpen(true);

    // Mark as read if it's unread
    if (!email.isRead) {
      await markAsRead(email.id);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedEmail(null);
    setIsReplying(false);
    setReplyContent("");
    setSummary("");
  };

  const handleAction = async (action) => {
    if (!selectedEmail) return;

    setLoading(true);
    try {
      if (action === "trash") {
        const response = await axiosInstance.delete(
          `/emails/trash/${selectedEmail.id}`
        );
        if (response.data.success) {
          if (onRefresh) onRefresh();
          handleClose();
        }
      } else if (action === "reply") {
        setIsReplying(true);
      }
    } catch (error) {
      console.error(`Failed to ${action} email:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("message", replyContent);
      const response = await axiosInstance.post(
        `/emails/reply/${selectedEmail.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        setIsReplying(false);
        setReplyContent("");
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!selectedEmail) return;
    setIsSummarizing(true);
    try {
      const response = await axiosInstance.get(
        `/emails/summarize/${selectedEmail.id}`
      );
      if (response.data.success) {
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error("Failed to summarize email:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const renderEmailBody = useMemo(() => {
    if (!selectedEmail) return "";

    const rawBody = selectedEmail.body || selectedEmail.snippet || "";
    const isHtml = rawBody.includes("<!DOCTYPE") || rawBody.includes("<html");
    const isMarkdown = /^#{1,6}\s|^\*\s|^\d+\.\s/.test(rawBody);
    const hasBracketedUrls = /\[https?:\/\/[^\]]+\]/.test(rawBody);

    let sanitizedContent = "";

    if (isHtml) {
      sanitizedContent = DOMPurify.sanitize(rawBody);
    } else if (isMarkdown) {
      const htmlContent = marked.parse(rawBody);
      sanitizedContent = DOMPurify.sanitize(htmlContent);
    } else if (hasBracketedUrls) {
      let processedContent = rawBody
        .replace(
          /\[(https?:\/\/[^\]]+)\]/g,
          '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        )
        .replace(/\s\*\s(.*?)(?=\n|$)/g, "<li>$1</li>")
        .replace(/(<li>.*?<\/li>)+/g, "<ul>$&</ul>")
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>");

      if (!processedContent.startsWith("<p>")) {
        processedContent = "<p>" + processedContent + "</p>";
      }

      sanitizedContent = DOMPurify.sanitize(processedContent);
    } else {
      sanitizedContent = DOMPurify.sanitize(
        "<p>" +
          rawBody.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>") +
          "</p>"
      );
    }

    return sanitizedContent;
  }, [selectedEmail]);

  return (
    <div className="hidden xl:block overflow-x-auto z-0 relative">
      <Table className="w-full">
        <TableHeader className="bg-gray-100">
          <TableRow className="font-bold border-b border-gray-300">
            <TableHead className="px-6 py-4 text-gray-700">Provider</TableHead>
            <TableHead className="text-gray-700">From</TableHead>
            <TableHead className="text-gray-700">Subject</TableHead>
            <TableHead className="text-gray-700">Date</TableHead>
            <TableHead className="hidden lg:table-cell text-gray-700">
              Latest Message Preview
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow
              key={email.id}
              className={`border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                !email.isRead ? "font-bold bg-gray-50" : ""
              }`}
              onClick={() => handleRowClick(email)}
            >
              <TableCell className="py-4 pl-5 border-r border-gray-100">
                <div className="flex items-center">
                  <Image
                    src={
                      user?.authProvider === "google"
                        ? gmail
                        : outlook || "/placeholder.svg"
                    }
                    width={24}
                    height={24}
                    alt="Gmail"
                    className="mr-2"
                  />
                  {/* {console.log(user?.authProvider)} */}
                  {user?.authProvider || "Unknown"}
                </div>
              </TableCell>
              <TableCell className="py-4 border-r border-gray-100">
                {extractEmail(email.from).length > 28
                  ? extractEmail(email.from).slice(0, 28) + " ..."
                  : extractEmail(email.from)}
              </TableCell>
              <TableCell className="border-r border-gray-100">
                {email.subject.slice(0, 20)} ...
              </TableCell>
              <TableCell className="border-r border-gray-100">
                {email.date.split(" ").slice(0, 4).join(" ")}
              </TableCell>
              <TableCell className="pr-5 hidden lg:table-cell">
                {email.preview || email.snippet?.slice(0, 35)} ...
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="block xl:hidden p-2">
        <div className="max-h-[40vh] overflow-y-auto space-y-4 messages">
          {emails.map((email) => (
            <div
              key={email.id}
              className={`border rounded-lg p-4 bg-white shadow-sm ${
                !email.isRead ? "font-bold" : ""
              }`}
              onClick={() => handleRowClick(email)}
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
                  {extractEmail(email.from)}
                </p>
                <p>
                  <span className="font-semibold">Subject:</span>{" "}
                  {email.subject}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {email.date}
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

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl flex flex-col max-h-[70vh]">
          <DialogHeader>
            <DialogTitle>{selectedEmail?.subject}</DialogTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                From: {selectedEmail?.from && extractEmail(selectedEmail?.from)}
              </span>
              <span>•</span>
              <span>Provider: {user?.authProvider || "Unknown"}</span>
            </div>
          </DialogHeader>
          <div className="flex gap-2 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("reply")}
              disabled={loading}
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("trash")}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSummarize}
              disabled={loading || isSummarizing}
            >
              <FileText className="h-4 w-4 mr-2" />
              Summarize
            </Button>
          </div>
          {isReplying ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="min-h-[100px]"
              />
              <Button
                variant="blueGradient"
                onClick={handleSendReply}
                disabled={loading}
              >
                Send Reply
              </Button>
            </div>
          ) : (
            <>
              {summary && (
                <div className="bg-gray-100 p-4 rounded-md mb-4">
                  <h3 className="font-semibold">Summary:</h3>
                  <p>{summary}</p>
                </div>
              )}
              <div
                className="prose dark:prose-invert max-w-none flex-1 overflow-auto"
                dangerouslySetInnerHTML={{ __html: renderEmailBody }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
