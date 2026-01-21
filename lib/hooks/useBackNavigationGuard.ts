"use client";

import { useEffect } from "react";

type Options = {
  message?: string;
  onConfirmExit: () => void;
};

export function useBackNavigationGuard({
  message = "You have an ongoing or completed process.\n\nDo you want to exit?",
  onConfirmExit,
}: Options) {
  useEffect(() => {
    const handlePopState = () => {
      const shouldExit = window.confirm(message);

      if (shouldExit) {
        onConfirmExit();
      } else {
        // Prevent navigation
        window.history.pushState(null, "", window.location.href);
      }
    };

    // Push state so back button triggers popstate
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [message, onConfirmExit]);
}
