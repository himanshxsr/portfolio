import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Himanshu Aashish <onboarding@resend.dev>",
      to: email,
      subject: "Thanks for reaching out! — Himanshu Aashish",
      html: getEmailTemplate(name),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auto-reply error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

function getEmailTemplate(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#0a0a0f; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#12121a; border-radius:16px; border:1px solid rgba(255,255,255,0.04); overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, rgba(0,240,255,0.1), rgba(123,47,247,0.1)); padding:40px 40px 30px; text-align:center;">
              <div style="font-size:28px; font-weight:bold; font-family:monospace; color:#00f0ff; margin-bottom:8px;">
                &lt;HA /&gt;
              </div>
              <div style="font-size:13px; color:#a0a0b0; font-family:monospace;">
                // message received
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="color:#ffffff; font-size:24px; margin:0 0 20px; font-weight:600;">
                Hey ${name}! 👋
              </h1>
              
              <p style="color:#a0a0b0; font-size:16px; line-height:1.7; margin:0 0 20px;">
                Thank you for reaching out through my portfolio. I've received your message and I'm excited to connect with you.
              </p>

              <p style="color:#a0a0b0; font-size:16px; line-height:1.7; margin:0 0 30px;">
                I'll review your message and get back to you within <span style="color:#00f0ff; font-weight:600;">24-48 hours</span>. If it's urgent, feel free to reach me directly on LinkedIn.
              </p>

              <!-- Divider -->
              <div style="height:1px; background: linear-gradient(90deg, transparent, rgba(0,240,255,0.3), transparent); margin:30px 0;"></div>

              <!-- Links Section -->
              <p style="color:#ffffff; font-size:14px; font-weight:600; margin:0 0 15px;">
                In the meantime, check out my work:
              </p>

              <table cellpadding="0" cellspacing="0" style="margin-bottom:30px;">
                <tr>
                  <td style="padding:8px 0;">
                    <a href="https://github.com/himanshxsr" style="color:#00f0ff; text-decoration:none; font-size:14px; font-family:monospace;">
                      → GitHub
                    </a>
                    <span style="color:#a0a0b0; font-size:13px;"> — My open source work</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <a href="https://linkedin.com/in/himanshu-aashish-0a5554243" style="color:#00f0ff; text-decoration:none; font-size:14px; font-family:monospace;">
                      → LinkedIn
                    </a>
                    <span style="color:#a0a0b0; font-size:13px;"> — Let's connect professionally</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <a href="https://himanshuaashish.dev" style="color:#00f0ff; text-decoration:none; font-size:14px; font-family:monospace;">
                      → Portfolio
                    </a>
                    <span style="color:#a0a0b0; font-size:13px;"> — Explore my projects</span>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px; background: linear-gradient(90deg, transparent, rgba(0,240,255,0.3), transparent); margin:30px 0;"></div>

              <!-- Signature -->
              <p style="color:#a0a0b0; font-size:14px; line-height:1.6; margin:0;">
                Best regards,
              </p>
              <p style="color:#ffffff; font-size:16px; font-weight:600; margin:5px 0 0;">
                Himanshu Aashish
              </p>
              <p style="color:#a0a0b0; font-size:13px; margin:4px 0 0; font-family:monospace;">
                Full-Stack &amp; Generative AI Developer
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0a0a0f; padding:25px 40px; text-align:center; border-top:1px solid rgba(255,255,255,0.04);">
              <p style="color:#a0a0b0; font-size:12px; margin:0; font-family:monospace;">
                <span style="color:#00f0ff;">&lt;</span>
                Built with passion
                <span style="color:#00f0ff;">/&gt;</span>
              </p>
              <p style="color:#a0a0b050; font-size:11px; margin:8px 0 0;">
                This is an automated response from himanshuaashish.dev
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
