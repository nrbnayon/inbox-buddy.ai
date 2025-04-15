"use client";

import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

const AdvancedEmailRenderer = ({ htmlContent, rawHtml }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (htmlContent) {
      // If pre-formatted HTML is provided
      setContent(DOMPurify.sanitize(htmlContent));
      setLoading(false);
    } else if (rawHtml) {
      // If raw email content is provided
      const parsedContent = parseRawEmail(rawHtml);
      setContent(DOMPurify.sanitize(parsedContent));
      setLoading(false);
    }
  }, [htmlContent, rawHtml]);

  // More advanced parsing of raw email content
  const parseRawEmail = (raw) => {
    // Convert line breaks to HTML breaks
    let parsed = raw.replace(/\r\n/g, "<br>").replace(/\n/g, "<br>");

    // Convert URLs in parentheses to actual links
    parsed = parsed.replace(/$$\s*(https?:\/\/[^\s)]+)\s*$$/g, (match, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // Convert plain text URLs to links
    parsed = parsed.replace(
      /(^|\s)(https?:\/\/[^\s<]+)/g,
      (match, space, url) => {
        return `${space}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      }
    );

    // Handle sections and formatting
    parsed = parsed
      .replace(/^([A-Z][A-Za-z\s]+):$/gm, "<h3>$1</h3>") // Convert title-like lines to headers
      .replace(/(^|\s)(\*\*|__)([^*_]+)(\*\*|__)/g, "$1<strong>$3</strong>") // Bold text
      .replace(/(^|\s)(\*|_)([^*_]+)(\*|_)/g, "$1<em>$3</em>"); // Italic text

    return parsed;
  };

  if (loading) {
    return <div className="email-loading">Loading email content...</div>;
  }

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

        .email-loading {
          padding: 24px;
          text-align: center;
          color: #6b7280;
        }

        .email-content {
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
          overflow-wrap: break-word;
          word-break: break-word;
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

        .email-content :global(br) {
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default AdvancedEmailRenderer;
