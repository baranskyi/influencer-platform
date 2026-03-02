"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1a0533 0%, #2d1b4e 50%, #3d1f0a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          color: "#f5f5f5",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "1rem",
            padding: "2rem",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "3rem", fontWeight: 700, color: "#F5A623", margin: "0 0 0.5rem" }}>
            Error
          </p>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.75rem" }}>
            Critical error
          </h1>
          <p style={{ color: "rgba(245,245,245,0.6)", fontSize: "0.875rem", margin: "0 0 1.5rem" }}>
            The application encountered a fatal error. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#F5A623",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.625rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
