"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Preloader } from "@/components/layout/Preloader";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
