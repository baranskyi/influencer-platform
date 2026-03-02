"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

export function DownloadPdfButton({ invoiceId }: { invoiceId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Extract filename from Content-Disposition header if available
      const disposition = response.headers.get("Content-Disposition");
      let filename = "invoice.pdf";
      if (disposition) {
        const match = disposition.match(/filename="([^"]+)"/);
        if (match) filename = match[1];
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleDownload}
      disabled={isLoading}
      className="bg-orange/20 text-orange border border-orange/30 hover:bg-orange/30 hover:text-orange font-semibold"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isLoading ? "Generating..." : "Download PDF"}
    </Button>
  );
}
