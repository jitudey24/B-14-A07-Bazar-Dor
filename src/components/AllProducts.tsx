import Link from "next/link";
import { cacheLife } from "next/cache";
import baseUrl from "@/services/baseUrl";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
};

const bn = (n: number) => n.toLocaleString("bn-BD");

const unitBn = (u: string) =>
  (
    ({
      kg: "প্রতি কেজি",
      litre: "প্রতি লিটার",
      piece: "প্রতিটি",
      dozen: "প্রতি ডজন",
    }) as Record<string, string>
  )[u] ?? `প্রতি ${u}`;

async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");

  const res = await fetch(`${baseUrl}/products`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

const BADGE = {
  up: { style: "bg-red-50 text-red-600", arrow: "▲" },
  down: { style: "bg-green-50 text-green-600", arrow: "▼" },
  flat: { style: "bg-gray-100 text-gray-500", arrow: "—" },
} as const;

export default async function AllProducts() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    return (
      <section className="rounded-2xl bg-gray-50 p-4 text-center text-sm text-gray-500 sm:rounded-3xl sm:p-5">
        এই মুহূর্তে তথ্য লোড করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section
      id="সব-পণ্য"
      className="scroll-mt-6 rounded-2xl bg-gray-50/80 p-3 sm:rounded-3xl sm:p-6"
    >
      <div className="mb-3 flex items-start gap-2 sm:mb-4">
        <span className="mt-1.5 text-sm text-green-600">●</span>
        <div className="min-w-0">
          <h2 className="text-base font-bold leading-tight text-gray-900 sm:text-lg">
            সকল পণ্যের দাম
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            মোট {bn(products.length)}টি পণ্য
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 sm:gap-3 lg:grid-cols-3">
        {products.map((p) => {
          const b = BADGE[p.change.dir];
          return (
            <Link
              key={p.slug}
              href={`/product/${p.slug}`}
              className="block min-w-0 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] sm:p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl sm:h-11 sm:w-11 sm:text-2xl">
                  {p.image}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-gray-900">
                    {p.nameBn}
                  </h3>
                  <p className="truncate text-xs text-gray-500">
                    {unitBn(p.unit)}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500 sm:mt-4">আজকের দাম</p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <p className="text-lg font-extrabold text-gray-900 sm:text-xl">
                  {bn(p.today)}{" "}
                  <span className="text-sm font-medium text-gray-700">
                    টাকা
                  </span>
                </p>
                <span
                  className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${b.style}`}
                >
                  {b.arrow} {bn(Math.abs(p.change.pct))}%
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
