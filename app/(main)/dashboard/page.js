import { RiSparkling2Line } from "react-icons/ri";
import { EmailPagination } from "./components/EmailPagination";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import gmail from "@/public/gmail.png";
import mail from "@/public/mail.png";
import meeting from "@/public/meeting.png";

import FilterMails from "./components/FilterMails";
import Link from "next/link";
import EmailTable from "./components/EmailTable";

export default async function HomePage() {
  const emails = [
    {
      provider: "Gmail",
      from: "Jone Doe",
      subject: "Meeting Update",
      date: "Mon, 24 Mar 2025",
      body: "Let's reschedule our meeting to 3 PM.",
      snippet: "Let's reschedule our meeting to 3 PM.",
    },
    {
      provider: "Gmail",
      from: "Jone Doe",
      subject: "Meeting Update",
      date: "Mon, 24 Mar 2025",
      body: "Let's reschedule our meeting to 3 PM.",
      snippet: "Let's reschedule our meeting to 3 PM.",
    },
    {
      provider: "Gmail",
      from: "Jone Doe",
      subject: "Meeting Update",
      date: "Mon, 24 Mar 2025",
      body: "Let's reschedule our meeting to 3 PM.",
      snippet: "Let's reschedule our meeting to 3 PM.",
    },
    {
      provider: "Gmail",
      id: "195c6d237466ec71",
      threadId: "195c6d237466ec71",
      subject: "Security alert",
      from: "Google <no-reply@accounts.google.com>",
      to: "alphabytes.gpt@gmail.com",
      date: "Mon, 24 Mar 2025 06:23:39 GMT",
      snippet:
        "Email-Ai-Assistant was granted access to your Google Account alphabytes.gpt@gmail.com If you did not grant access, you should check this activity and secure your account. Check activity You can also",
      body: "[image: Google]\r\nEmail-Ai-Assistant was granted access to your Google account\r\n\r\n\r\nalphabytes.gpt@gmail.com\r\n\r\nIf you did not grant access, you should check this activity and secure your\r\naccount.\r\nCheck activity\r\n<https://accounts.google.com/AccountChooser?Email=alphabytes.gpt@gmail.com&continue=https://myaccount.google.com/alert/nt/1742797419000?rfn%3D127%26rfnc%3D1%26eid%3D-2233602989110173696%26et%3D0>\r\nYou can also see security activity at\r\nhttps://myaccount.google.com/notifications\r\nYou received this email to let you know about important changes to your\r\nGoogle Account and services.\r\n© 2025 Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA\r\n",
      isRead: false,
      importanceScore: 90,
      isImportant: true,
    },

    {
      provider: "Gmail",
      id: "195c8e18778c3ee2",
      threadId: "195c8e18778c3ee2",
      subject: "You have been added to John Tempesta' s waitlist",
      from: "hello@intro.live",
      to: "alphabytes.gpt@gmail.com",
      date: "Mon, 24 Mar 2025",
      snippet:
        "Hello! You have been added to John Tempesta&#39;s waitlist. We will send you an email as soon as slots open up! In the meantime, you can browse other mentors here. intro",
      body: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\r\n<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">\r\n <head>\r\n <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" /><!--[if !mso]><!-->\r\n <meta http-equiv="X-UA-Compatible" content="IE=Edge" /><!--<![endif]-->\r\n <!--[if (gte mso 9)|(IE)]>\r\n <xml>\r\n <o:OfficeDocumentSettings>\r\n <o:AllowPNG/>\r\n <o:PixelsPerInch>96</o:PixelsPerInch>\r\n </o:OfficeDocumentSettings>\r\n </xml>\r\n <![endif]-->\r\n <!--[if (gte mso 9)|(IE)]>\r\n <style type="text/css">\r\n body {width: 600px;margin: 0 auto;}\r\n table {border-collapse: collapse;}\r\n table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}\r\n img {-ms-interpolation-mode: bicubic;}\r\n </style>\r\n <![endif]-->\r\n\r\n <style type="text/css">\r\n body, p, div {\r\n font-family: helvetica,arial,sans-serif;\r\n font-size: 14px;\r\n }\r\n body {\r\n color: #000000;\r\n }\r\n body a {\r\n color: #1188E6;\r\n text-decoration: none;\r\n }\r\n p { margin: 0; padding: 0; }\r\n table.wrapper {\r\n width:100% !important;\r\n table-layout: fixed;\r\n -webkit-font-smoothing: antialiased;\r\n -webkit-text-size-adjust: 100%;\r\n -moz-text-size-adjust: 100%;\r\n -ms-text-size-adjust: 100%;\r\n }\r\n img.max-width {\r\n max-width: 100% !important;\r\n }\r\n .column.of-2 {\r\n width: 50%;\r\n }\r\n .column.of-3 {\r\n width: 33.333%;\r\n }\r\n .column.of-4 {\r\n width: 25%;\r\n }\r\n @media screen and (max-width:480px) {\r\n .preheader .rightColumnContent,\r\n .footer .rightColumnContent {\r\n text-align: left !important;\r\n }\r\n .preheader .rightColumnContent div,\r\n .preheader .rightColumnContent span,\r\n .footer .rightColumnContent div,\r\n .footer .rightColumnContent span {\r\n text-align: left !important;\r\n }\r\n .preheader .rightColumnContent,\r\n .preheader .leftColumnContent {\r\n font-size: 80% !important;\r\n padding: 5px 0;\r\n }\r\n table.wrapper-mobile {\r\n width: 100% !important;\r\n table-layout: fixed;\r\n }\r\n img.max-width {\r\n height: auto !important;\r\n max-width: 480px !important;\r\n }\r\n a.bulletproof-button {\r\n display: block !important;\r\n width: auto !important;\r\n font-size: 80%;\r\n padding-left: 0 !important;\r\n padding-right: 0 !important;\r\n }\r\n .columns {\r\n width: 100% !important;\r\n }\r\n .column {\r\n display: block !important;\r\n width: 100% !important;\r\n padding-left: 0 !important;\r\n padding-right: 0 !important;\r\n margin-left: 0 !important;\r\n margin-right: 0 !important;\r\n }\r\n }\r\n </style>\r\n <!--user entered Head Start-->\r\n \r\n <!--End Head user entered-->\r\n </head>\r\n <body>\r\n <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: helvetica,arial,sans-serif; color: #000000; background-color: #ffffff;">\r\n <div class="webkit">\r\n <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ffffff">\r\n <tr>\r\n <td valign="top" bgcolor="#ffffff" width="100%">\r\n <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">\r\n <tr>\r\n <td width="100%">\r\n <table width="100%" cellpadding="0" cellspacing="0" border="0">\r\n <tr>\r\n <td>\r\n <!--[if mso]>\r\n <center>\r\n <table><tr><td width="600">\r\n <![endif]-->\r\n <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center">\r\n <tr>\r\n <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#ffffff" width="100%" align="left">\r\n \r\n <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%"\r\n style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">\r\n <tr>\r\n <td role="module-content">\r\n <p></p>\r\n </td>\r\n </tr>\r\n </table>\r\n \r\n <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">\r\n <tr>\r\n <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center">\r\n <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:35% !important;width:35%;height:auto !important;" src="https://d375w6nzl58bw0.cloudfront.net/uploads/96a92a57c3a761ef1bc1f2e6f51e5c52ab067fdd58851a50f63a6190a4b12941.jpg" alt="" width="210">\r\n </td>\r\n </tr>\r\n </table>\r\n \r\n <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">\r\n <tr>\r\n <td style="padding:0px 0px 0px 0px;"\r\n height="100%"\r\n valign="top"\r\n bgcolor="">\r\n Hello!<div></div>\r\n<br />You have been added to John Tempesta\'s waitlist. We will send you an email as soon as slots open up! In the meantime, you can browse other mentors <a href="http://url4422.intro.live/ls/click?upn=u001.Y3VGYJt4K0F9N7yxe9NF2tWxsWdu2nmRxdMi4D-2BC17Wi-2FfTGUGmj1MiravHIwf0fqLqt_VORVMy4XXHTMEvX6hBKyAsMKKBZoEzkSLRKzZGfJCu-2F89bEi5M9b-2B-2F5QqG5u6R17GeJvY4JA2Fg4c71XJMT6baHYuHDUpc5K4aCfO85jM0pwrGr1UGfIuKJrjCy1c5CrRqTaAH9bI0EWPSVJ19Hk-2BQCxb1y-2FjVnpUZutRuO42iKd6iSjNCb74uu1ELMrsNF47ZRLFdqgeqmWILdnAA3wI9TB9GpfLx0-2FsRiQthiFJUwRVUeVly0QlJzhZzvkEAx6xe8hIcf2RCYFinHJ2HT5T4f0ZlPEOMKRtENxR5D22DFZLbW3qYlcOTOSvK2Tv1m1" target=_blank>here</a>.<br /><br /><br />intro<br /><br />\r\n </td>\r\n </tr>\r\n </table>\r\n \r\n <table class="module"\r\n role="module"\r\n data-type="spacer"\r\n border="0"\r\n cellpadding="0"\r\n cellspacing="0"\r\n width="100%"\r\n style="table-layout: fixed;">\r\n <tr>\r\n <td style="padding:0px 0px 30px 0px;"\r\n role="module-content"\r\n bgcolor="">\r\n </td>\r\n </tr>\r\n </table>\r\n \r\n <table class="module"\r\n role="module"\r\n data-type="divider"\r\n border="0"\r\n cellpadding="0"\r\n cellspacing="0"\r\n width="100%"\r\n style="table-layout: fixed;">\r\n <tr>\r\n <td style="padding:0px 0px 0px 0px;"\r\n role="module-content"\r\n height="100%"\r\n valign="top"\r\n bgcolor="">\r\n <table border="0"\r\n cellpadding="0"\r\n cellspacing="0"\r\n align="center"\r\n width="100%"\r\n height="5px"\r\n style="line-height:5px; font-size:5px;">\r\n <tr>\r\n <td\r\n style="padding: 0px 0px 5px 0px;"\r\n bgcolor="#db001b"></td>\r\n </tr>\r\n </table>\r\n </td>\r\n </tr>\r\n </table>\r\n \r\n <table class="module"\r\n role="module"\r\n data-type="spacer"\r\n border="0"\r\n cellpadding="0"\r\n cellspacing="0"\r\n width="100%"\r\n style="table-layout: fixed;">\r\n <tr>\r\n <td style="padding:0px 0px 10px 0px;"\r\n role="module-content"\r\n bgcolor="">\r\n </td>\r\n </tr>\r\n </table>\r\n \r\n <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">\r\n <tr>\r\n <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center">\r\n <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:100% !important;width:100%;height:auto !important;" src="https://d375w6nzl58bw0.cloudfront.net/uploads/0987e1e1b069c09965f2703d11021479cbf8aaaf6ed59634a3e825da4bd9150e.png" alt="" width="600">\r\n </td>\r\n </tr>\r\n </table>\r\n \r\n </td>\r\n </tr>\r\n </table>\r\n <!--[if mso]>\r\n </td></tr></table>\r\n </center>\r\n <![endif]-->\r\n </td>\r\n </tr>\r\n </table>\r\n </td>\r\n </tr>\r\n </table>\r\n </td>\r\n </tr>\r\n </table>\r\n </div>\r\n </center>\r\n <img src="http://url4422.intro.live/wf/open?upn=u001.UR4dw9sNCYGG67gvQFoN9Ebf-2FPQQufSHLHzYhIY-2Fmo5b2VY7VFj3LexcVdzjPP8ZKR-2F3LfczbL-2FRqjF02krrmfYnvE4SP489NYcjD8JoSjp-2FSMcqdOUhKkX8ilNw9-2FzS9OjapEC0zL7Slg8Xuorlp6VHYLDpbfF-2F-2BFhOdHpFS69iu62aRoQfmVx5pF9zEKCs7DWtasVFRjPef9vwk98omKpsUJAScHBaoAI8OIm18-2FB4dZuTLk2-2BKTZrxHuAfqkAIkHsXXih5cD3WPQpKifmSLvcwtTtf04qAR0nDqBemNCYRpAGot2tcxy9Wn8SaO4z" alt="" width="1" height="1" border="0" style="height:1px !important;width:1px !important;border-width:0 !important;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;padding-top:0 !important;padding-bottom:0 !important;padding-right:0 !important;padding-left:0 !important;"/></body>\r\n</html>\r\n',
      isRead: false,
    },
  ];
  return (
    <section className="flex flex-col w-full p-2 md:p-0">
      {/* welcome messages */}
      <h1 className="text-3xl font-bold mb-3">Hi John,</h1>
      <p className="inline-flex items-center gap-2">
        <FaCheckCircle color="#68D391" />
        Here&apos;s the latest. Let me know how I can help!
      </p>

      {/* statics */}
      <div className="flex mt-6 gap-4 md:gap-16 w-full">
        {/* unread mails */}
        <div className="flex gap-3">
          <Image src={mail} alt="gmail logo" className="size-11" />
          <div className="flex flex-col">
            <p className="text-[#A0AEC0]">Unread Emails</p>
            <h4 className="text-[#2D3748]">100</h4>
          </div>
        </div>

        {/* upcomming meetings */}
        <div className="flex gap-3">
          <Image src={meeting} alt="gmail logo" className="size-11" />
          <div className="flex flex-col">
            <p className="text-[#A0AEC0]">Meetings this week</p>
            <h4 className="text-[#2D3748]">10</h4>
          </div>
        </div>

        {/* search bar */}
        {/* <div className="hidden md:flex">
          <SearchBar />
        </div> */}
      </div>

      {/* mails */}
      <div className="mt-10">
        <div className="flex flex-col md:flex-row justify-between">
          <h2 className="text-[#2D3748] text-2xl font-semibold mb-5">
            Your Top Recipients
          </h2>
          {/* <div className="block md:hidden">
            <SearchBar />
          </div> */}
          <FilterMails />
        </div>

        {/* emails table */}
        <div className="rounded-2xl border">
          {/* Table for larger screens */}
          <EmailTable emails={emails} />

          {/* Card layout with scrollbar for smaller screens */}
          <div className="block md:hidden p-2">
            <div className="max-h-[40vh] overflow-y-auto space-y-4 messages">
              {emails.map((email, index) => (
                <div
                  key={index}
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
                    <span className="font-medium">{email.provider}</span>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Name:</span> {email.name}
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
                      {email.preview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* paginations */}
        <div className="flex flex-col md:flex-row items-end justify-between mt-8 md:items-center">
          <Link
            href="/chat"
            className="link-btn px-6 py-2 rounded-full hidden md:flex items-center gap-2"
          >
            <RiSparkling2Line />
            <span>Ask Ai For Help</span>
          </Link>
          <EmailPagination />
        </div>
      </div>
    </section>
  );
}
