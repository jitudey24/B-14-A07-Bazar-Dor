import Image from "next/image";
import DownProducts, { type Dir } from "@/components/PriceMovers";
import AllProducts from "@/components/AllProducts";
import DateDisplay from "@/components/DateDisplay";

const MOVER_DIRS: Dir[] = ["up", "down"];

export default function Home() {
  return (
    <main className="bg-[#f3f8f4] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero */}
        <section className="flex flex-col items-center justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-10 lg:flex-row lg:px-14 lg:py-10">
          {/* Left Content */}
          <div className="w-full max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700">
              <DateDisplay />
            </p>

            <h1 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            {/* CTA */}
            <a
              href="#সব-পণ্য"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg active:scale-95"
            >
              সব পণ্য দেখুন
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          {/* Right Image */}
          <div className="mt-8 flex w-full justify-center lg:mt-0 lg:w-auto lg:justify-end">
            <Image
              src="/bazar-hero.png"
              alt="বাজারের পণ্যের ছবি"
              width={400}
              height={400}
              priority
              className="w-64 object-contain sm:w-72 lg:w-80"
            />
          </div>
        </section>

        {/* Price Movers */}
        {MOVER_DIRS.map((dir) => (
          <DownProducts key={dir} dir={dir} />
        ))}

        {/* All Products */}
        <AllProducts />
      </div>
    </main>
  );
}

