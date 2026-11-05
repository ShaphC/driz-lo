"use client";

import NextError from "next/error";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    trackEvent("application_error", {
      error_name: error.name || "Error",
      has_digest: Boolean(error.digest),
    });
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
