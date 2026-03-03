import { escapeHtml } from "../html-escape";

export interface ContentDeadlineData {
  creatorName: string;
  eventTitle: string;
  dealTitle: string;
  brandName: string;
  platform: string;
  scheduledAt: string;
  description: string | null;
  appUrl: string;
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalizePlatform(platform: string): string {
  const platforms: Record<string, string> = {
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
    multi: "Multi-platform",
  };
  return platforms[platform] ?? platform;
}

export function generateContentDeadlineEmail(data: ContentDeadlineData): {
  subject: string;
  html: string;
} {
  const safeCreatorName = escapeHtml(data.creatorName);
  const safeEventTitle = escapeHtml(data.eventTitle);
  const safeDealTitle = escapeHtml(data.dealTitle);
  const safeBrandName = escapeHtml(data.brandName);
  const safeDescription = data.description ? escapeHtml(data.description) : null;

  const subject = `Content deadline tomorrow: ${data.eventTitle}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#0f0f0f;padding:32px 40px;text-align:center;">
              <span style="font-size:24px;font-weight:700;color:#ff6b2b;letter-spacing:-0.5px;">DealFlow</span>
              <p style="margin:8px 0 0;font-size:13px;color:#888888;">Creator Business Management</p>
            </td>
          </tr>

          <!-- Urgency Banner -->
          <tr>
            <td style="background-color:#fffbeb;border-bottom:3px solid #f59e0b;padding:16px 40px;">
              <p style="margin:0;font-size:14px;color:#92400e;text-align:center;font-weight:600;">
                Deadline tomorrow — content due in less than 24 hours
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Content Deadline Reminder</h1>
              <p style="margin:0 0 32px;font-size:15px;color:#555555;line-height:1.6;">
                Hi ${safeCreatorName}, you have content due tomorrow. Here are the details:
              </p>

              <!-- Event Details Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;margin-bottom:32px;">
                <tr style="background-color:#fafafa;">
                  <td style="padding:16px 20px;font-size:12px;font-weight:600;color:#888888;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e5e5;" colspan="2">Event Details</td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;font-size:14px;color:#555555;border-bottom:1px solid #f0f0f0;">Event</td>
                  <td style="padding:14px 20px;font-size:14px;font-weight:600;color:#111111;text-align:right;border-bottom:1px solid #f0f0f0;">${safeEventTitle}</td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;font-size:14px;color:#555555;border-bottom:1px solid #f0f0f0;">Deal</td>
                  <td style="padding:14px 20px;font-size:14px;color:#111111;text-align:right;border-bottom:1px solid #f0f0f0;">${safeDealTitle}</td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;font-size:14px;color:#555555;border-bottom:1px solid #f0f0f0;">Brand</td>
                  <td style="padding:14px 20px;font-size:14px;color:#111111;text-align:right;border-bottom:1px solid #f0f0f0;">${safeBrandName}</td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;font-size:14px;color:#555555;border-bottom:1px solid #f0f0f0;">Platform</td>
                  <td style="padding:14px 20px;font-size:14px;color:#111111;text-align:right;border-bottom:1px solid #f0f0f0;">${capitalizePlatform(data.platform)}</td>
                </tr>
                <tr style="background-color:#fffbeb;">
                  <td style="padding:18px 20px;font-size:15px;font-weight:700;color:#111111;">Due</td>
                  <td style="padding:18px 20px;font-size:15px;font-weight:700;color:#f59e0b;text-align:right;">${formatDateTime(data.scheduledAt)}</td>
                </tr>
              </table>

              ${
                data.description
                  ? `<!-- Description -->
              <div style="background-color:#f9f9f9;border-radius:8px;padding:16px 20px;margin-bottom:32px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#888888;text-transform:uppercase;letter-spacing:0.5px;">Description</p>
                <p style="margin:0;font-size:14px;color:#555555;line-height:1.6;">${safeDescription}</p>
              </div>`
                  : ""
              }

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${data.appUrl}" style="display:inline-block;background-color:#ff6b2b;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;">View Deal in DealFlow</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;border-top:1px solid #e5e5e5;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;color:#888888;">This reminder was sent automatically by <strong style="color:#ff6b2b;">DealFlow</strong></p>
              <p style="margin:16px 0 0;font-size:11px;color:#cccccc;">Powered by DealFlow · Creator Business Management</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
