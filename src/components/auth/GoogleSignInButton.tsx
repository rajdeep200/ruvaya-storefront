"use client";

import { useCallback, useRef, useState } from "react";
import Script from "next/script";
import { env } from "@/config/env";
import { loginWithGoogle } from "@/lib/api/auth";

type GoogleCredentialResponse = { credential: string };
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; width?: number; text?: string },
          ) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (message: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  // Re-runs on every mount (even if the script is already cached from a prior
  // page), since /login and /signup can both mount this button.
  const handleReady = useCallback(() => {
    if (!window.google || !containerRef.current) return;
    window.google.accounts.id.initialize({
      client_id: env.googleClientId,
      callback: async (response) => {
        setBusy(true);
        try {
          await loginWithGoogle(response.credential);
          onSuccess();
        } catch (error) {
          onError(error instanceof Error ? error.message : "Google sign-in failed. Please try again.");
        } finally {
          setBusy(false);
        }
      },
    });
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      width: Math.min(containerRef.current.offsetWidth || 320, 400),
      text: "continue_with",
    });
  }, [onSuccess, onError]);

  if (!env.googleClientId) return null;

  return (
    <div>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={handleReady} />
      <div ref={containerRef} className={busy ? "pointer-events-none opacity-60" : "flex justify-center"} />
    </div>
  );
}
