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
import { Archive, Reply, Trash2 } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const extractEmail = (fromString) => {
  const match = fromString.match(/<([^>]+)>/);
  return match ? match[1] : fromString; // Return email or original string if no match
};

export default function EmailTable({ emails }) {
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
      console.log(`Performing ${action} on email ID: ${selectedEmail.id}`);

      // Simulate success
      setTimeout(() => {
        console.log(`Email ${action}ed successfully`);
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

    let sanitizedContent = "";

    if (isHtml) {
      // For HTML content, sanitize and use as-is
      sanitizedContent = DOMPurify.sanitize(rawBody);
    } else if (isMarkdown) {
      // Convert markdown to HTML and sanitize
      const htmlContent = marked.parse(rawBody);
      sanitizedContent = DOMPurify.sanitize(htmlContent);
    } else {
      // Plain text - convert to HTML and escape
      sanitizedContent = DOMPurify.sanitize(rawBody.replace(/\n/g, "<br>"));
    }

    return sanitizedContent;
  }, [selectedEmail]);

  return (
    <div className="hidden md:block overflow-x-auto">
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
          {emails.map((email, index) => (
            <TableRow
              key={index}
              className="border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => handleRowClick(email)}
            >
              {/* provider */}
              <TableCell className="py-3 pl-5">
                <div
                  className={`flex items-center ${
                    index === emails?.length - 1 ? "" : "border-b pb-3"
                  }`}
                >
                  <Image
                    src={gmail}
                    width={24}
                    height={24}
                    alt="Gmail"
                    className="mr-2"
                  />
                  {email.provider || "Unknown"}
                </div>
              </TableCell>

              {/* from */}
              <TableCell className="py-3">
                <div
                  className={`${
                    index === emails?.length - 1 ? "" : "border-b pb-4"
                  }`}
                >
                  {extractEmail(email.from).length > 28
                    ? extractEmail(email.from).slice(0, 28) + " ..."
                    : extractEmail(email.from)}
                </div>
              </TableCell>

              {/* subject */}
              <TableCell>
                <div
                  className={`${
                    index === emails?.length - 1 ? "" : "border-b pb-4"
                  }`}
                >
                  {email.subject.slice(0, 20)} ...
                </div>
              </TableCell>

              {/* email date */}
              <TableCell>
                <div
                  className={`${
                    index === emails?.length - 1 ? "" : "border-b pb-4"
                  }`}
                >
                  {email.date.split(" ").slice(0, 4).join(" ")}
                </div>
              </TableCell>

              {/* email preview */}
              <TableCell className="pr-5 hidden lg:table-cell">
                <div
                  className={`${
                    index === emails?.length - 1 ? "" : "border-b pb-4"
                  }`}
                >
                  {email.preview || email.snippet?.slice(0, 35)} ...
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Email Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedEmail?.subject}</DialogTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                From: {selectedEmail?.from && extractEmail(selectedEmail?.from)}
              </span>
              <span>•</span>
              <span>Provider: {selectedEmail?.provider || "Unknown"}</span>
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
            dangerouslySetInnerHTML={{
              __html: renderEmailBody,
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
