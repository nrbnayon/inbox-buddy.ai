import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip } from "lucide-react";
import { emailApi } from "@/lib/api/emails";

export function EmailReplyDialog({ isOpen, onClose, email, onReplySuccess }) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await emailApi.sendReply(email.id, {
        content,
        attachments,
      });

      if (response.success) {
        onReplySuccess();
        onClose();
        setContent("");
        setAttachments([]);
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
      // Handle error (show toast notification, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reply to: {email?.subject}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your reply..."
              className="min-h-[200px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="attachments"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="attachments"
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800"
            >
              <Paperclip className="h-4 w-4" />
              {attachments.length
                ? `${attachments.length} files selected`
                : "Attach files"}
            </label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? "Sending..." : "Send Reply"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
