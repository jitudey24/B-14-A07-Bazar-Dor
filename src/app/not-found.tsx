import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#f3f8f4] px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-green-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl" />

      {/* Floating emojis */}
      <span className="pointer-events-none absolute left-[8%] top-[18%] text-4xl opacity-60 sm:text-5xl">
        🥦
      </span>
      <span className="pointer-events-none absolute right-[10%] top-[22%] text-4xl opacity-60 sm:text-5xl">
        🍅
      </span>
      <span className="pointer-events-none absolute bottom-[16%] left-[12%] text-4xl opacity-60 sm:text-5xl">
        🥕
      </span>
      <span className="pointer-events-none absolute bottom-[20%] right-[8%] text-4xl opacity-60 sm:text-5xl">
        🧅
      </span>

      <div className="relative w-full max-w-lg text-center">
        {/* 404 number */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <span className="text-8xl font-black leading-none text-green-600 sm:text-9xl">
            ৪
          </span>
          <span className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-green-600 bg-white text-5xl shadow-lg sm:h-32 sm:w-32 sm:text-6xl">
            🛒
          </span>
          <span className="text-8xl font-black leading-none text-green-600 sm:text-9xl">
            ৪
          </span>
        </div>

        <h1 className="mt-8 text-2xl font-extrabold text-gray-900 sm:text-3xl">
          এই পেজটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
          আপনি যে পণ্য বা ক্যাটাগরি খুঁজছেন সেটি হয়তো সরানো হয়েছে, নাম বদলে গেছে
          অথবা লিংকটি ভুল।
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="w-full rounded-xl bg-green-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700 sm:w-auto"
          >
            🏠 হোম পেজে ফিরে যান
          </Link>

          <Link
            href="/#products"
            className="w-full rounded-xl border border-gray-200 bg-white px-7 py-3 text-sm font-bold text-gray-800 transition hover:-translate-y-0.5 hover:border-green-500 hover:text-green-600 sm:w-auto"
          >
            🔍 সব পণ্য দেখুন
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          সমস্যা চলতে থাকলে কিছুক্ষণ পরে আবার চেষ্টা করুন।
        </p>
      </div>
    </main>
  );
}
