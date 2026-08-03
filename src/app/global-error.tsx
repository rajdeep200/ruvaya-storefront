"use client";

import { useEffect } from "react";

/** Only catches errors thrown by the root layout itself — must render its own <html>/<body>. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[ruvaya] root layout error", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: "#fbf6ef", color: "#3e2c20", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "6rem 1.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem" }}>Ruvaya is briefly unavailable</h1>
          <p style={{ marginTop: 12, fontSize: "0.875rem", color: "#6b5847" }}>
            Something went wrong loading the site. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              minHeight: 44,
              padding: "0 24px",
              borderRadius: 999,
              background: "#6b4530",
              color: "white",
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
