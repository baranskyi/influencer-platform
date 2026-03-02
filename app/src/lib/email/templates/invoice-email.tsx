export interface InvoiceEmailData {
  invoiceNumber: string;
  creatorName: string;
  creatorEmail: string;
  clientName: string;
  total: number;
  currency: string;
  issueDate: string;
  dueDate: string | null;
  notes: string | null;
  appUrl: string;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateInvoiceEmail(data: InvoiceEmailData): {
  subject: string;
  html: string;
} {
  const subject = `Invoice ${data.invoiceNumber} from ${data.creatorName}`;

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

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">You've received an invoice</h1>
              <p style="margin:0 0 32px;font-size:15px;color:#555555;">
                Hi ${data.clientName}, <strong>${data.creatorName}</strong> has sent you an invoice for your review.
              </p>

              <!-- Invoice Summary Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;margin-bottom:32px;">
                <tr style="background-color:#fafafa;">
                  <td style="padding:16px 20px;font-size:12px;font-weight:600;color:#888888;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e5e5;">Invoice Details</td>
                  <td style="padding:16px 20px;font-size:12px;font-weight:600;color:#888888;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e5e5;text-align:right;"></td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;font-size:14px;color:#555555;border-bottom:1px solid #f0f0f0;">Invoice Number</td>
                  <td style="padding:14px 20px;font-size:14px;font-weight:600;color:#111111;text-align:right;border-bottom:1px solid #f0f0f0;">${data.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;font-size:14px;color:#555555;border-bottom:1px solid #f0f0f0;">Issue Date</td>
                  <td style="padding:14px 20px;font-size:14px;color:#111111;text-align:right;border-bottom:1px solid #f0f0f0;">${formatDate(data.issueDate)}</td>
                </tr>
                ${
                  data.dueDate
                    ? `<tr>
                  <td style="padding:14px 20px;font-size:14px;color:#555555;border-bottom:1px solid #f0f0f0;">Due Date</td>
                  <td style="padding:14px 20px;font-size:14px;color:#111111;text-align:right;border-bottom:1px solid #f0f0f0;">${formatDate(data.dueDate)}</td>
                </tr>`
                    : ""
                }
                <tr style="background-color:#fff8f5;">
                  <td style="padding:18px 20px;font-size:16px;font-weight:700;color:#111111;">Total Amount</td>
                  <td style="padding:18px 20px;font-size:20px;font-weight:700;color:#ff6b2b;text-align:right;">${formatCurrency(data.total, data.currency)}</td>
                </tr>
              </table>

              ${
                data.notes
                  ? `<!-- Notes -->
              <div style="background-color:#f9f9f9;border-radius:8px;padding:16px 20px;margin-bottom:32px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#888888;text-transform:uppercase;letter-spacing:0.5px;">Notes</p>
                <p style="margin:0;font-size:14px;color:#555555;line-height:1.6;">${data.notes}</p>
              </div>`
                  : ""
              }

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${data.appUrl}" style="display:inline-block;background-color:#ff6b2b;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;">View Invoice</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;border-top:1px solid #e5e5e5;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;color:#888888;">Sent by <strong style="color:#555555;">${data.creatorName}</strong></p>
              <p style="margin:0;font-size:12px;color:#aaaaaa;">${data.creatorEmail}</p>
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
