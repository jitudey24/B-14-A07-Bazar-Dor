
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

async function getProduct(id: string): Promise<ProductDetail> {
  const url = `${baseUrl}/products/${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error(`Product API error: ${res.status} (${url})`);
  }

  return res.json();
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={<ProductDetailsSkeleton /> }
    >
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}

async function ProductDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

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
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4">
        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
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
          <span className="text-gray-800">{product.nameBn}</span>
        </nav>

        {/* Header Card */}
        <section className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-4xl">
              {product.image}
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                {product.nameBn}
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                প্রতি {unit} · {product.categoryNameBn}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                গতকালের তুলনায় আজ দাম{" "}
                <span className={`font-bold ${changeColor}`}>
                  {changeText}
                </span>
                {product.change.dir !== "flat" && (
                  <> · {bn(diff)} টাকা</>
                )}
              </p>
            </div>
          </div>

          {/* Today's Price */}
          <div className="rounded-xl bg-gray-50 px-6 py-4 text-center">
            <p className="text-xs text-gray-500">আজকের দাম</p>
            <p className="mt-1 text-4xl font-extrabold text-gray-900">
              {bn(product.today)}
            </p>
            <p className="text-xs text-gray-500">টাকা / {unit}</p>
            <p className={`mt-1 text-xs font-bold ${changeColor}`}>
              {arrow} {bn(product.change.pct)}%
            </p>
          </div>
        </section>

        {/* Price Summary */}
        <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Lowest */}
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>
              <p className="mt-1 text-2xl font-extrabold text-green-600">
                {lowest ? bn(lowest.min) : "—"}{" "}
                <span className="text-sm font-semibold">টাকা</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {lowest
                  ? `সবচেয়ে কম দামের বাজার: ${lowest.market}`
                  : "তথ্য নেই"}
              </p>
            </div>

            {/* Highest */}
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-500">সর্বোচ্চ দাম</p>
              <p className="mt-1 text-2xl font-extrabold text-red-600">
                {highest ? bn(highest.max) : "—"}{" "}
                <span className="text-sm font-semibold">টাকা</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {highest
                  ? `সবচেয়ে বেশি দামের বাজার: ${highest.market}`
                  : "তথ্য নেই"}
              </p>
            </div>

            {/* Average */}
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-500">গড় দাম</p>
              <p className="mt-1 text-2xl font-extrabold text-blue-600">
                {bn(product.today)}{" "}
                <span className="text-sm font-semibold">টাকা</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                প্রতি {unit}-এর হিসাবে
              </p>
            </div>
          </div>

          {/* Price History */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "গতকাল", value: product.yesterday },
              { label: "গত সপ্তাহ", value: product.lastWeek },
              { label: "গত মাস", value: product.lastMonth },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-gray-50 p-3 text-center"
              >
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="mt-1 text-base font-bold text-gray-900">
                  {bn(item.value)} টাকা
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Market Table */}
        <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {markets.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              বাজারভিত্তিক কোনো তথ্য পাওয়া যায়নি।
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[600px] text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">
                      বাজার
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      বিভাগ
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      সর্বনিম্ন
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      সর্বোচ্চ
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((m, i) => {
                    const avg = (m.min + m.max) / 2;

                    return (
                      <tr
                        key={`${m.market}-${i}`}
                        className="border-t border-gray-100 odd:bg-white even:bg-gray-50/60"
                      >
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {m.market}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {m.division}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {bn(m.min)} টাকা
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {bn(m.max)} টাকা
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">
                          {bn(avg)} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

