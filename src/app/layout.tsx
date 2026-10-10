import type { Metadata } from "next";
import { Noto_Serif_Bengali} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PriceTicker from "@/components/PriceTicker";
import { Toaster } from "react-hot-toast";
import NavLinks from "@/components/NavLinks";
import { Suspense } from "react";


const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["latin", 'bengali'],
});

export const metadata: Metadata = {
  title: {
    default: "বাজার দর | BazarDor",
    template: "%s | বাজার দর", // onno page e title dile "পণ্যের নাম | বাজার দর" hobe
  },
  description: "আজকের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক জায়গায়",
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      className={`${notoSerifBengali.className} h-full antialiased`}

    >
      <body suppressHydrationWarning={true} className="flex min-h-full flex-col bg-[#f3f8f4]">
       <Header
          navLinks={
            <Suspense
              fallback={
                <div className="mx-auto h-10 max-w-5xl px-4 sm:px-6 lg:px-8" />
              }
            >
              <NavLinks />
            </Suspense>
          }
        />
        <PriceTicker />
        <main className="w-full max-w-6xl mx-auto flex-1 px-4 sm:px-6 pb-24 md:pb-16">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
