import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import baseUrl from "@/services/baseUrl";
import { ProductDetailsSkeleton } from "@/components/Skeleton";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type ProductDetail = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: Market[];
};

type Product = {
  id: number;
  slug: string;
};

const bn = (n: number) =>
  n.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });

const unitBn = (u: string) =>
  (
    {
      kg: "কেজি",
      litre: "লিটার",
      piece: "পিস",
      dozen: "ডজন",
    } as Record<string, string>
  )[u] ?? u;

// Step 1: Fetch products list
async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${baseUrl}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Products API error: ${res.status}`);
  }

  const data = await res.json();

  // API যদি সরাসরি array দেয়
  if (Array.isArray(data)) {
    return data;
  }

  // API যদি { products: [...] } দেয়
  if (Array.isArray(data.products)) {
    return data.products;
  }

  // API যদি { data: [...] } দেয়
  if (Array.isArray(data.data)) {
    return data.data;
  }

  throw new Error("Products API response format is unexpected");
}

// Step 2: Find product by slug, then fetch details using ID
async function getProduct(slug: string): Promise<ProductDetail> {
  const products = await getProducts();

  const matchedProduct = products.find((product) => product.slug === slug);

  if (!matchedProduct) {
    notFound();
  }

  const res = await fetch(`${baseUrl}/products/${matchedProduct.id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error(`Product details API error: ${res.status}`);
  }

  return res.json();
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}

async function ProductDetailsContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  const markets = product.markets ?? [];
  const unit = unitBn(product.unit);

  const lowest = markets.length
    ? markets.reduce((a, b) => (b.min < a.min ? b : a))
    : null;

  const highest = markets.length
    ? markets.reduce((a, b) => (b.max > a.max ? b : a))
    : null;

  const diff = Math.abs(product.today - product.yesterday);

  const changeText =
    product.change.dir === "up"
      ? "বেড়েছে"
      : product.change.dir === "down"
        ? "কমেছে"
        : "অপরিবর্তিত";

  const changeColor =
    product.change.dir === "up"
      ? "text-red-600"
      : product.change.dir === "down"
        ? "text-green-600"
        : "text-gray-500";

  const arrow =
    product.change.dir === "up"
      ? "▲"
      : product.change.dir === "down"
        ? "▼"
        : "—";

  return (
    <main className="min-h-screen bg-gray-50 py-5 sm:py-8">
      <div className="mx-auto max-w-5xl px-3 sm:px-4 lg:px-6">
        {/* Breadcrumb */}
        <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-gray-500 sm:mb-4 sm:gap-2">
          <Link href="/" className="hover:text-green-600">
            হোম
          </Link>

          <span>›</span>

          <Link
            href={`/category/${product.category}`}
            className="hover:text-green-600"
          >
            {product.categoryNameBn}
          </Link>

          <span>›</span>

          <span className="break-words text-gray-800">{product.nameBn}</span>
        </nav>

        {/* Product Header */}
        <section className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-3xl sm:h-16 sm:w-16 sm:text-4xl">
              {product.image}
            </div>

            <div className="min-w-0">
              <h1 className="break-words text-xl font-extrabold text-gray-900 sm:text-2xl lg:text-3xl">
                {product.nameBn}
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                প্রতি {unit} · {product.categoryNameBn}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                গতকালের তুলনায় আজ দাম{" "}
                <span className={`font-bold ${changeColor}`}>{changeText}</span>

                {product.change.dir !== "flat" && <> · {bn(diff)} টাকা</>}
              </p>
            </div>
          </div>

          {/* Today's Price */}
          <div className="w-full shrink-0 rounded-xl bg-gray-50 px-5 py-3 text-center sm:w-auto sm:px-6 sm:py-4">
            <p className="text-xs text-gray-500">আজকের দাম</p>

            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {bn(product.today)}
            </p>

            <p className="text-xs text-gray-500">টাকা / {unit}</p>

            <p className={`mt-1 text-xs font-bold ${changeColor}`}>
              {arrow} {bn(product.change.pct)}%
            </p>
          </div>
        </section>

        {/* Price Summary */}
        <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 sm:mt-5 sm:p-5">
          <h2 className="mb-3 text-base font-bold text-gray-900 sm:mb-4 sm:text-lg">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-100 p-3.5 sm:p-4">
              <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>

              <p className="mt-1 text-xl font-extrabold text-green-600 sm:text-2xl">
                {lowest ? bn(lowest.min) : "—"}{" "}
                <span className="text-sm font-semibold">টাকা</span>
              </p>

              <p className="mt-1 break-words text-xs text-gray-500">
                {lowest
                  ? `সবচেয়ে কম দামের বাজার: ${lowest.market}`
                  : "তথ্য নেই"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-3.5 sm:p-4">
              <p className="text-xs text-gray-500">সর্বোচ্চ দাম</p>

              <p className="mt-1 text-xl font-extrabold text-red-600 sm:text-2xl">
                {highest ? bn(highest.max) : "—"}{" "}
                <span className="text-sm font-semibold">টাকা</span>
              </p>

              <p className="mt-1 break-words text-xs text-gray-500">
                {highest
                  ? `সবচেয়ে বেশি দামের বাজার: ${highest.market}`
                  : "তথ্য নেই"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-3.5 sm:p-4">
              <p className="text-xs text-gray-500">গড় দাম</p>

              <p className="mt-1 text-xl font-extrabold text-blue-600 sm:text-2xl">
                {bn(product.today)}{" "}
                <span className="text-sm font-semibold">টাকা</span>
              </p>

              <p className="mt-1 text-xs text-gray-500">
                প্রতি {unit}-এর হিসাবে
              </p>
            </div>
          </div>

          {/* Price History */}
          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
            {[
              { label: "গতকাল", value: product.yesterday },
              { label: "গত সপ্তাহ", value: product.lastWeek },
              { label: "গত মাস", value: product.lastMonth },
            ].map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-xl bg-gray-50 p-2.5 text-center sm:p-3"
              >
                <p className="text-xs text-gray-500">{item.label}</p>

                <p className="mt-1 break-words text-sm font-bold text-gray-900 sm:text-base">
                  {bn(item.value)}{" "}
                  <span className="block text-[11px] font-medium text-gray-500 sm:inline sm:text-base sm:font-bold sm:text-gray-900">
                    টাকা
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Market Prices */}
        <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 sm:mt-5 sm:p-5">
          <h2 className="mb-3 text-base font-bold text-gray-900 sm:mb-4 sm:text-lg">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {markets.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              বাজারভিত্তিক কোনো তথ্য পাওয়া যায়নি।
            </p>
          ) : (
            <>
              {/* Mobile: card layout (table er bodole, jate dane-bame scroll na lage) */}
              <div className="space-y-3 md:hidden">
                {markets.map((market, index) => {
                  const average = (market.min + market.max) / 2;

                  return (
                    <div
                      key={`${market.market}-${index}`}
                      className="rounded-xl border border-gray-200 p-3.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 break-words font-semibold text-gray-900">
                          {market.market}
                        </p>
                        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                          {market.division}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-gray-50 p-2">
                          <p className="text-[11px] text-gray-500">সর্বনিম্ন</p>
                          <p className="mt-0.5 text-sm font-semibold text-gray-700">
                            {bn(market.min)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2">
                          <p className="text-[11px] text-gray-500">সর্বোচ্চ</p>
                          <p className="mt-0.5 text-sm font-semibold text-gray-700">
                            {bn(market.max)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-green-50 p-2">
                          <p className="text-[11px] text-gray-500">গড়</p>
                          <p className="mt-0.5 text-sm font-bold text-gray-900">
                            {bn(average)}
                          </p>
                        </div>
                      </div>

                      <p className="mt-2 text-right text-[11px] text-gray-400">
                        দাম টাকায়
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Tablet / Desktop: table */}
              <div className="hidden overflow-x-auto rounded-xl border border-gray-200 md:block">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">বাজার</th>
                      <th className="px-4 py-3 text-left font-medium">বিভাগ</th>
                      <th className="px-4 py-3 text-right font-medium">
                        সর্বনিম্ন
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        সর্বোচ্চ
                      </th>
                      <th className="px-4 py-3 text-right font-medium">গড়</th>
                    </tr>
                  </thead>

                  <tbody>
                    {markets.map((market, index) => {
                      const average = (market.min + market.max) / 2;

                      return (
                        <tr
                          key={`${market.market}-${index}`}
                          className="border-t border-gray-100 odd:bg-white even:bg-gray-50/60"
                        >
                          <td className="px-4 py-3 font-semibold text-gray-900">
                            {market.market}
                          </td>

                          <td className="px-4 py-3 text-gray-600">
                            {market.division}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                            {bn(market.min)} টাকা
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                            {bn(market.max)} টাকা
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-gray-900">
                            {bn(average)} টাকা
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
