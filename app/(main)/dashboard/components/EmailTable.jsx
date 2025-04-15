// app\(main)\dashboard\components\EmailTable.jsx
"use client";

import { useState, useMemo } from "react";
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
import { Reply, Trash2 } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const extractEmail = (fromString) => {
  const match = fromString.match(/<([^>]+)>/);
  return match ? match[1] : fromString; // Return email or original string if no match
};

export default function EmailTable({ emails, user }) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRowClick = (email) => {
    setSelectedEmail(email);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedEmail(null);
  };

  const handleAction = async (action) => {
    if (!selectedEmail) return;

    setLoading(true);
    try {
      // Simulated API call - replace with your actual endpoint
      // console.log(`Performing ${action} on email ID: ${selectedEmail.id}`);

      // Simulate success
      setTimeout(() => {
        // console.log(`Email ${action}ed successfully`);
        handleClose();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(`Failed to ${action} email:`, error);
      setLoading(false);
    }
  };

  const renderEmailBody = useMemo(() => {
    if (!selectedEmail) return "";

    // Extract body content
    const rawBody = selectedEmail.body || selectedEmail.snippet || "";

    // Try to detect content type
    const isHtml = rawBody.includes("<!DOCTYPE") || rawBody.includes("<html");
    const isMarkdown = /^#{1,6}\s|^\*\s|^\d+\.\s/.test(rawBody);
    const hasBracketedUrls = /\[https?:\/\/[^\]]+\]/.test(rawBody);

    let sanitizedContent = "";

    if (isHtml) {
      // For HTML content, sanitize and use as-is
      sanitizedContent = DOMPurify.sanitize(rawBody);
    } else if (isMarkdown) {
      // Convert markdown to HTML and sanitize
      const htmlContent = marked.parse(rawBody);
      sanitizedContent = DOMPurify.sanitize(htmlContent);
    } else if (hasBracketedUrls) {
      // Handle plain text emails with URLs in square brackets
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
      // Plain text - convert to HTML and escape
      sanitizedContent = DOMPurify.sanitize(
        "<p>" +
          rawBody.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>") +
          "</p>"
      );
    }

    return sanitizedContent;
  }, [selectedEmail]);

  return (
    <div className="hidden xl:block overflow-x-auto">
      <Table className="w-full">
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead className="font-medium px-6 py-4">Provider</TableHead>
            <TableHead className="font-medium">From</TableHead>
            <TableHead className="font-medium">Subject</TableHead>
            <TableHead className="font-medium">Date</TableHead>
            <TableHead className="font-medium hidden lg:table-cell">
              Latest Message Preview
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow
              key={email.id} // Changed from key={index} to key={email.id}
              className="border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => handleRowClick(email)}
            >
              {/* provider */}
              <TableCell className="py-3 pl-5">
                <div className="flex items-center">
                  <Image
                    src={gmail || "/placeholder.svg"}
                    width={24}
                    height={24}
                    alt="Gmail"
                    className="mr-2"
                  />
                  {user?.authProvider || "Unknown"}
                </div>
              </TableCell>

              {/* from */}
              <TableCell className="py-3">
                {extractEmail(email.from).length > 28
                  ? extractEmail(email.from).slice(0, 28) + " ..."
                  : extractEmail(email.from)}
              </TableCell>

              {/* subject */}
              <TableCell>{email.subject.slice(0, 20)} ...</TableCell>

              {/* email date */}
              <TableCell>
                {email.date.split(" ").slice(0, 4).join(" ")}
              </TableCell>

              {/* email preview */}
              <TableCell className="pr-5 hidden lg:table-cell">
                {email.preview || email.snippet?.slice(0, 35)} ...
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile View */}
      <div className="block xl:hidden p-2">
        <div className="max-h-[40vh] overflow-y-auto space-y-4 messages">
          {emails.map((email) => (
            <div
              key={email.id} // Changed from key={index} to key={email.id}
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

      {/* Email Details Dialog */}
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
          </div>
          <div
            className="prose dark:prose-invert max-w-none flex-1 overflow-auto"
            dangerouslySetInnerHTML={{ __html: renderEmailBody }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}