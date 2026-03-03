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
    bank_details?: {
      iban?: string;
      swift?: string;
      bank_name?: string;
    } | null;
  };
  client: {
    name: string;
    contact_email: string | null;
  } | null;
};

const colors = {
  black: "#000000",
  darkGray: "#333333",
  midGray: "#555555",
  lightGray: "#666666",
  border: "#e5e5e5",
  headerBg: "#f5f5f5",
  white: "#ffffff",
  totalBg: "#f0f0f0",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    color: colors.darkGray,
    fontFamily: "Helvetica",
    padding: 56,
    fontSize: 10,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: colors.black,
  },
  headerLeft: {
    flexDirection: "column",
  },
  invoiceLabel: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
    letterSpacing: 4,
  },
  headerTagline: {
    fontSize: 9,
    color: colors.lightGray,
    marginTop: 4,
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  invoiceNumber: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.midGray,
  },
  statusText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.midGray,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  // From / To parties
  partiesRow: {
    flexDirection: "row",
    gap: 32,
    marginBottom: 28,
  },
  partyBlock: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.lightGray,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  partyName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
    marginBottom: 4,
  },
  partyDetail: {
    fontSize: 9,
    color: colors.lightGray,
    marginBottom: 2,
  },
  // Dates row
  datesRow: {
    flexDirection: "row",
    gap: 0,
    marginBottom: 32,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
  },
  dateBlock: {
    flex: 1,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  dateBlockLast: {
    flex: 1,
    paddingHorizontal: 12,
  },
  dateLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.lightGray,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  dateValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
  },
  // Financial table
  tableSection: {
    marginBottom: 32,
  },
  tableSectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.lightGray,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.headerBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.midGray,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  colDescription: {
    flex: 1,
    fontSize: 10,
    color: colors.darkGray,
  },
  colAmount: {
    width: 110,
    textAlign: "right",
    fontSize: 10,
    color: colors.darkGray,
  },
  colAmountMuted: {
    color: colors.lightGray,
  },
  dividerRow: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 8,
    marginBottom: 0,
  },
  totalRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: colors.totalBg,
    borderWidth: 1,
    borderTopWidth: 2,
    borderTopColor: colors.black,
    borderColor: colors.border,
    marginTop: 0,
  },
  totalLabel: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
  },
  totalAmount: {
    width: 110,
    textAlign: "right",
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
  },
  // Payment Details
  paymentSection: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 20,
  },
  paymentLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.lightGray,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  paymentKey: {
    width: 80,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.midGray,
  },
  paymentValue: {
    flex: 1,
    fontSize: 9,
    color: colors.darkGray,
  },
  // Notes
  notesSection: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 32,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.lightGray,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  notesText: {
    fontSize: 10,
    color: colors.darkGray,
    lineHeight: 1.6,
  },
  // Footer
  footer: {
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: colors.lightGray,
  },
  footerBrand: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.black,
    letterSpacing: 1,
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

export function InvoicePDF({ invoice, profile, client }: InvoicePDFProps) {
  const currency = invoice.currency || "EUR";

  const addressParts = profile.address
    ? [
        profile.address.street,
        profile.address.city,
        profile.address.postal_code,
        profile.address.country,
      ].filter(Boolean)
    : [];

  const hasDueDate = Boolean(invoice.due_date);

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
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {invoice.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* From / To */}
        <View style={styles.partiesRow}>
          {/* From */}
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>From</Text>
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

          {/* Bill To */}
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>Bill To</Text>
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
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Issue Date</Text>
            <Text style={styles.dateValue}>
              {formatDate(invoice.issue_date)}
            </Text>
          </View>
          {hasDueDate && (
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>Due Date</Text>
              <Text style={styles.dateValue}>
                {formatDate(invoice.due_date!)}
              </Text>
            </View>
          )}
          <View style={hasDueDate ? styles.dateBlockLast : styles.dateBlock}>
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
            <Text
              style={[
                styles.tableHeaderText,
                { width: 110, textAlign: "right" },
              ]}
            >
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
          <View style={styles.tableRow}>
            <Text style={styles.colDescription}>
              IVA / VAT ({invoice.tax_rate}%)
            </Text>
            <Text style={[styles.colAmount, styles.colAmountMuted]}>
              +{formatCurrency(invoice.tax_amount, currency)}
            </Text>
          </View>

          {/* IRPF Row (only if > 0) */}
          {invoice.irpf_rate > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.colDescription}>
                IRPF Withholding ({invoice.irpf_rate}%)
              </Text>
              <Text style={[styles.colAmount, styles.colAmountMuted]}>
                -{formatCurrency(invoice.irpf_amount, currency)}
              </Text>
            </View>
          )}

          {/* Total Row */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Due</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(invoice.total, currency)}
            </Text>
          </View>
        </View>

        {/* Payment Details */}
        {profile.bank_details && (profile.bank_details.iban || profile.bank_details.swift || profile.bank_details.bank_name) && (
          <View style={styles.paymentSection}>
            <Text style={styles.paymentLabel}>Payment Details</Text>
            {profile.bank_details.bank_name && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentKey}>Bank</Text>
                <Text style={styles.paymentValue}>{profile.bank_details.bank_name}</Text>
              </View>
            )}
            {profile.bank_details.iban && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentKey}>IBAN</Text>
                <Text style={styles.paymentValue}>{profile.bank_details.iban}</Text>
              </View>
            )}
            {profile.bank_details.swift && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentKey}>SWIFT/BIC</Text>
                <Text style={styles.paymentValue}>{profile.bank_details.swift}</Text>
              </View>
            )}
            <View style={styles.paymentRow}>
              <Text style={styles.paymentKey}>Beneficiary</Text>
              <Text style={styles.paymentValue}>{profile.legal_name || profile.full_name}</Text>
            </View>
          </View>
        )}

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
