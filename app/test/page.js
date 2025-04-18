import EmailRenderer from "./components/email-renderer";

export default function Home() {
  // Example email content - in a real app, this would come from your API or state
  const emailContent = `
    <div>
      <h2>Resources to hone your design skills</h2>
      <div style="margin-bottom: 20px;">
        <a href="https://l.engage.canva.com/ss/c/u001.Note3it1gaozj0PIggVG9tplar3juom3GwdJknmjC21di9DGyBTImplV1SSjUE-6/4fo/T7oYeL-xShCAsOzJkAmDPw/t0/h001.CgewCAp9DcIRAqNfKoSWGiMO4RaalgLQw-b2zkYoF14">Canva</a>
        <a href="https://l.engage.canva.com/ss/c/u001.Note3it1gaozj0PIggVG9tplar3juom3GwdJknmjC22hhHM7RdhcZTsw1iov9EiD/4fo/T7oYeL-xShCAsOzJkAmDPw/t1/h001.afjokvKyB4yUAhy4qxARDmK7ZJh4X3wj3M-ti94wUJk">Pro Canva</a>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>Welcome to Canva! Ready to hone your design skills? Start by learning how to customize templates, add elements, use fonts and colors, and more.</p>
        <a href="https://l.engage.canva.com/ss/c/u001.Note3it1gaozj0PIggVG9tZCzu9JMGAxYUjnJaK1fL_6FSYVizfTtoGiWBBlt9P27jivEtSNnQTZkB9Y-LfBOIufd_4dMf6F0wQfgDl3hZc1Tz-xc520Q0_0oVroSN2l/4fo/T7oYeL-xShCAsOzJkAmDPw/t5/h001.aEAi7IiwtguhYqXtzoDY5GC621oF_ynI25LRUGMEPJs">Start with a tutorial</a>
      </div>
      
      <h3>Canva starter pack: Resources for beginners</h3>
      <p>Unlock your creative potential and bring your ideas to life. These resources will help you get started.</p>
      
      <ul style="list-style-type: none; padding-left: 0;">
        <li><a href="https://l.engage.canva.com/ss/c/u001.Note3it1gaozj0PIggVG9tZCzu9JMGAxYUjnJaK1fL_6FSYVizfTtoGiWBBlt9P27jivEtSNnQTZkB9Y-LfBOIufd_4dMf6F0wQfgDl3hZc-tOOJ1dyxrSRUFj7MBx5J/4fo/T7oYeL-xShCAsOzJkAmDPw/t6/h001.Bue2ZY_xrzbS8eu6UZ3FpgF9CMLfW2kZeY2BkB_WvE8">Learn the basics</a></li>
        <li><a href="https://l.engage.canva.com/ss/c/u001.Note3it1gaozj0PIggVG9tZCzu9JMGAxYUjnJaK1fL91YM7s3WXHUU3x3SrVuaq9IyApBGEK2CZYgUfTUtIIbntZZtuGZXaNxM92D5Yzs6STq9eJGBl9biTHMKgb8D85/4fo/T7oYeL-xShCAsOzJkAmDPw/t7/h001.am0btff2c51Y7kH80xuZmV3Hn05w4R9fO16NWp8D9t4">Craft presentations</a></li>
        <li><a href="https://l.engage.canva.com/ss/c/u001.Note3it1gaozj0PIggVG9tZCzu9JMGAxYUjnJaK1fL9CVNHyf3g_jvnG98_jO6YiBFQo4hRXFuTneGghyZlmVQDLanzCJJCzIVkxeGnrSSLViZfMQvBSyehu3ySGq4nF/4fo/T7oYeL-xShCAsOzJkAmDPw/t8/h001.xeiK6gn4iMgiIfGpoxplPo6EeFFpYYGs7HMlkihBF9g">Brush up on social media</a></li>
        <li><a href="https://l.engage.canva.com/ss/c/u001.Note3it1gaozj0PIggVG9tZCzu9JMGAxYUjnJaK1fL-1KAgUlagrRpL2MLNpmx6q5nBYbtJu3CvKyd7DRt93qTfUaywSN9otUmtnMSjhJ2N8Qg-tHZTPjEE3noT59irF/4fo/T7oYeL-xShCAsOzJkAmDPw/t9/h001.K05crgB-q9INzPs7Mscde1VUehfMJ3ScixFkOGZfT0c">Meet our AI-powered tools</a></li>
      </ul>
      
      <div style="margin-top: 30px;">
        <p>Talk to you soon</p>
        <p>Want more tips to help you do your best work? Manage your <a href='https://l.engage.canva.com/ss/c/u001.Note3it1gaozj0PIggVG9t1o6OOPWBTK2sz3h-0nOIbQyLvBmKKHsNPdhh_PATD24eIRgEgMQBXEXPkrzLOGtw/4fo/T7oYeL-xShCAsOzJkAmDPw/t10/h001.o5NuhSLg0caA3cm0nwSIQiutNL_9djuDw_FgCJLF2qs' style='color: #8B3DFF; text-decoration: underline;'>message preferences</a> to make sure you hear about what matters most to you.</p>
      </div>
      
      <div style="margin-top: 30px; text-align: center;">
        <p>Canva Pty Ltd, 110 Kippax St, NSW 2010, Australia. ABN 80 158 929 938</p>
      </div>
    </div>
  `;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full">
        <h1 className="text-2xl font-bold mb-6">Email Viewer</h1>
        <EmailRenderer htmlContent={emailContent} />
      </div>
    </main>
  );
}
