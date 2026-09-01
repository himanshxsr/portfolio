/**
 * Portfolio contact auto-reply — paste into script.google.com
 *
 * Sign in with the Gmail that should send confirmations (himanshuaashish4@gmail.com).
 *
 * 1. Deploy → Manage deployments → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 2. Copy the /exec URL into GOOGLE_APPS_SCRIPT_URL on Vercel
 */

const CONFIG = {
  fromName: "Himanshu Aashish",
  replySubject: "Thanks for reaching out! — Himanshu Aashish",
  github: "https://github.com/himanshxsr",
  linkedin: "https://linkedin.com/in/himanshu-aashish-0a5554243",
  portfolio: "https://www.himansh.co.in",
};

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const name = String(payload.name || "there").trim().slice(0, 100);
    const email = String(payload.email || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ success: false, error: "Invalid email" });
    }

    const html = buildHtml(name);
    GmailApp.sendEmail(email, CONFIG.replySubject, plainText(name), {
      htmlBody: html,
      name: CONFIG.fromName,
      charset: "UTF-8",
    });

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function buildHtml(name) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,Helvetica,sans-serif;color:#e8e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0a0a0f;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#12121a;border:1px solid #2a2a3a;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,#0a0a0f 0%,#12121a 100%);border-bottom:1px solid #2a2a3a;">
              <p style="margin:0;font-family:Consolas,Monaco,monospace;font-size:20px;color:#00f0ff;">&lt;dev_himansh /&gt;</p>
              <p style="margin:8px 0 0;font-family:Consolas,Monaco,monospace;font-size:12px;color:#888;">// message received</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:18px;color:#ffffff;">Hey ${escapeHtml(name)}!</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#b8b8c8;">
                Thank you for reaching out through my portfolio. I've received your message and I'm excited to connect with you.
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#b8b8c8;">
                I'll review your message and get back to you within <strong style="color:#00f0ff;">24-48 hours</strong>.
                If it's urgent, feel free to reach me directly on LinkedIn.
              </p>
              <p style="margin:0 0 12px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.08em;">In the meantime, check out my work:</p>
              <p style="margin:0;font-size:14px;line-height:2;">
                <a href="${CONFIG.github}" style="color:#00f0ff;text-decoration:none;">GitHub</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href="${CONFIG.linkedin}" style="color:#00f0ff;text-decoration:none;">LinkedIn</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <a href="${CONFIG.portfolio}" style="color:#00f0ff;text-decoration:none;">Portfolio</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #2a2a3a;background:#0d0d14;">
              <p style="margin:0;font-size:12px;color:#666;">Sent from the portfolio contact form at himansh.co.in</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function plainText(name) {
  return `Hey ${name}!

Thank you for reaching out through my portfolio. I've received your message and I'll get back to you within 24-48 hours.

GitHub: ${CONFIG.github}
LinkedIn: ${CONFIG.linkedin}
Portfolio: ${CONFIG.portfolio}`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  );
}
