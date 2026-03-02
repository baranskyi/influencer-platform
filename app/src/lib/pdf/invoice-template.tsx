import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

export type InvoicePDFProps = {
  invoice: {
    invoice_number: string;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    irpf_rate: number;
    irpf_amount: number;
    total: number;
    currency: string;
    status: string;
    issue_date: string;
    due_date: string | null;
    notes: string | null;
  };
  profile: {
    full_name: string;
    email: string;
    legal_name: string | null;
    tax_id: string | null;
    address: {
      street?: string;
      city?: string;
      postal_code?: string;
      country?: string;
    } | null;
  };
  client: {
    name: string;
    contact_email: string | null;
  } | null;
};

const colors = {
  orange: "#F5A623",
  dark: "#1a1225",
  darkMid: "#251838",
  darkLight: "#2d1f42",
  white: "#ffffff",
  offWhite: "#f0ebf8",
  muted: "#9d8fb5",
  mutedLight: "#c5b8d8",
  border: "#3d2d54",
  green: "#4ade80",
  red: "#f87171",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.dark,
    color: colors.white,
    fontFamily: "Helvetica",
    padding: 48,
    fontSize: 10,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: "column",
    gap: 4,
  },
  invoiceLabel: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: colors.orange,
    letterSpacing: 3,
  },
  headerTagline: {
    fontSize: 9,
    color: colors.muted,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
  },
  invoiceNumber: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // From / To
  partiesRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 32,
  },
  partyCard: {
    flex: 1,
    backgroundColor: colors.darkMid,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  partyLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.orange,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  partyName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
    marginBottom: 4,
  },
  partyDetail: {
    fontSize: 9,
    color: colors.mutedLight,
    marginBottom: 2,
  },
  // Dates row
  datesRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 32,
  },
  dateCard: {
    flex: 1,
    backgroundColor: colors.darkMid,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
  },
  // Financial table
  tableSection: {
    marginBottom: 32,
  },
  tableSectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.orange,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.darkLight,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowAlt: {
    backgroundColor: "#1e1530",
  },
  colDescription: {
    flex: 1,
    fontSize: 10,
    color: colors.white,
  },
  colAmount: {
    width: 100,
    textAlign: "right",
    fontSize: 10,
    color: colors.white,
    fontFamily: "Helvetica",
  },
  colAmountPositive: {
    color: colors.green,
  },
  colAmountNegative: {
    color: colors.red,
  },
  dividerRow: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.darkLight,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.orange,
    marginTop: 4,
  },
  totalLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
  },
  totalAmount: {
    width: 100,
    textAlign: "right",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: colors.orange,
  },
  // Notes
  notesSection: {
    backgroundColor: colors.darkMid,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 32,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  notesText: {
    fontSize: 10,
    color: colors.mutedLight,
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    marginTop: "auto",
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: colors.muted,
  },
  footerBrand: {
    fontSize: 9,
    color: colors.orange,
    fontFamily: "Helvetica-Bold",
  },
});

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case "paid":
      return "#16a34a";
    case "sent":
    case "viewed":
      return "#2563eb";
    case "overdue":
      return "#dc2626";
    case "cancelled":
      return "#6b7280";
    default:
      return "#9333ea";
  }
}

export function InvoicePDF({ invoice, profile, client }: InvoicePDFProps) {
  const currency = invoice.currency || "EUR";
  const statusColor = getStatusColor(invoice.status);

  const addressParts = profile.address
    ? [
        profile.address.street,
        profile.address.city,
        profile.address.postal_code,
        profile.address.country,
      ].filter(Boolean)
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.headerTagline}>DealFlow — Creator Finance</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColor + "33" },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColor }]}>
                {invoice.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* From / To */}
        <View style={styles.partiesRow}>
          {/* From */}
          <View style={styles.partyCard}>
            <Text style={styles.partyLabel}>FROM</Text>
            <Text style={styles.partyName}>
              {profile.legal_name || profile.full_name}
            </Text>
            {profile.legal_name && profile.legal_name !== profile.full_name && (
              <Text style={styles.partyDetail}>{profile.full_name}</Text>
            )}
            <Text style={styles.partyDetail}>{profile.email}</Text>
            {profile.tax_id && (
              <Text style={styles.partyDetail}>Tax ID: {profile.tax_id}</Text>
            )}
            {addressParts.map((part, i) => (
              <Text key={i} style={styles.partyDetail}>
                {part}
              </Text>
            ))}
          </View>

          {/* To */}
          <View style={styles.partyCard}>
            <Text style={styles.partyLabel}>BILL TO</Text>
            {client ? (
              <>
                <Text style={styles.partyName}>{client.name}</Text>
                {client.contact_email && (
                  <Text style={styles.partyDetail}>{client.contact_email}</Text>
                )}
              </>
            ) : (
              <Text style={styles.partyDetail}>No client assigned</Text>
            )}
          </View>
        </View>

        {/* Dates */}
        <View style={styles.datesRow}>
          <View style={styles.dateCard}>
            <Text style={styles.dateLabel}>Issue Date</Text>
            <Text style={styles.dateValue}>
              {formatDate(invoice.issue_date)}
            </Text>
          </View>
          {invoice.due_date && (
            <View style={styles.dateCard}>
              <Text style={styles.dateLabel}>Due Date</Text>
              <Text style={styles.dateValue}>
                {formatDate(invoice.due_date)}
              </Text>
            </View>
          )}
          <View style={styles.dateCard}>
            <Text style={styles.dateLabel}>Currency</Text>
            <Text style={styles.dateValue}>{currency}</Text>
          </View>
        </View>

        {/* Financial Table */}
        <View style={styles.tableSection}>
          <Text style={styles.tableSectionTitle}>Financial Summary</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderText, { width: 100, textAlign: "right" }]}>
              Amount
            </Text>
          </View>

          {/* Subtotal Row */}
          <View style={styles.tableRow}>
            <Text style={styles.colDescription}>Services / Subtotal</Text>
            <Text style={styles.colAmount}>
              {formatCurrency(invoice.subtotal, currency)}
            </Text>
          </View>

          {/* IVA Row */}
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={styles.colDescription}>
              IVA / VAT ({invoice.tax_rate}%)
            </Text>
            <Text style={[styles.colAmount, styles.colAmountPositive]}>
              +{formatCurrency(invoice.tax_amount, currency)}
            </Text>
          </View>

          {/* IRPF Row (only if > 0) */}
          {invoice.irpf_rate > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.colDescription}>
                IRPF Withholding ({invoice.irpf_rate}%)
              </Text>
              <Text style={[styles.colAmount, styles.colAmountNegative]}>
                -{formatCurrency(invoice.irpf_amount, currency)}
              </Text>
            </View>
          )}

          {/* Divider */}
          <View style={styles.dividerRow} />

          {/* Total Row */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Due</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(invoice.total, currency)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your business.</Text>
          <Text style={styles.footerBrand}>DealFlow</Text>
        </View>
      </Page>
    </Document>
  );
}
