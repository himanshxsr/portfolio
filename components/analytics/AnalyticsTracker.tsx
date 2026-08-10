"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getDeviceClass() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/bot|crawler|spider|crawling/.test(userAgent)) return "bot";
  if (/ipad|tablet/.test(userAgent)) return "tablet";
  if (/mobile|iphone|android/.test(userAgent)) return "mobile";
  return "desktop";
}

function getSessionHash() {
  const key = "portfolio-analytics-session";
  let value = sessionStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    sessionStorage.setItem(key, value);
  }
  return value;
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    let referrerHost: string | undefined;
    try {
      referrerHost = document.referrer
        ? new URL(document.referrer).hostname
        : undefined;
    } catch {
      referrerHost = undefined;
    }

    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrerHost,
        deviceClass: getDeviceClass(),
        sessionHash: getSessionHash(),
      }),
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
