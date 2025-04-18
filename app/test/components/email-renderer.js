"use client";

import { useState, useEffect } from "react";

const EmailRenderer = ({ htmlContent, rawHtml }) => {
  const [content, setContent] = useState(htmlContent || "");

  // If you're passing in raw email HTML that needs parsing
  useEffect(() => {
    if (rawHtml) {
      // Simple parsing of the raw email content
      // In a real app, you might need more sophisticated parsing
      const parsedContent = parseRawEmail(rawHtml);
      setContent(parsedContent);
    }
  }, [rawHtml]);

  // Simple function to clean up raw email content
  const parseRawEmail = (raw) => {
    // This is a very basic implementation
    // For production, you might want to use a library like email-parser
    return raw
      .replace(/\r\n/g, "<br>")
      .replace(/\n/g, "<br>")
      .replace(/\s{2,}/g, " ")
      .replace(/($$\s*https?:\/\/[^\s)]+\s*$$)/g, (match) => {
        const url = match.slice(1, -1).trim();
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      });
  };

  return (
    <div className="email-container">
      <div
        className="email-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style jsx>{`
        .email-container {
          max-width: 100%;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .email-content {
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
        }

        .email-content :global(a) {
          color: #8b3dff;
          text-decoration: none;
        }

        .email-content :global(a:hover) {
          text-decoration: underline;
        }

        .email-content :global(h1),
        .email-content :global(h2),
        .email-content :global(h3) {
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.25;
        }

        .email-content :global(h1) {
          font-size: 24px;
        }

        .email-content :global(h2) {
          font-size: 20px;
        }

        .email-content :global(h3) {
          font-size: 18px;
        }

        .email-content :global(p) {
          margin-top: 0;
          margin-bottom: 16px;
        }

        .email-content :global(ul),
        .email-content :global(ol) {
          margin-top: 0;
          margin-bottom: 16px;
          padding-left: 24px;
        }

        .email-content :global(li) {
          margin-bottom: 8px;
        }

        .email-content :global(img) {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default EmailRenderer;
