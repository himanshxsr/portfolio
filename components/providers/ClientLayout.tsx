"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Preloader } from "@/components/layout/Preloader";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Preloader />
      <AnalyticsTracker />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
