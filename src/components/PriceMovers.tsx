import Link from "next/link";
import { cacheLife } from "next/cache";
import baseUrl from "@/services/baseUrl";

export type Dir = "up" | "down";

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

// ২.১ / ০.০ — সবসময় এক দশমিক ঘর
const pctBn = (n: number) =>
  Math.abs(n).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const unitBn = (u: string) =>
  (
    ({
      kg: "প্রতি কেজি",
      litre: "প্রতি লিটার",
      piece: "প্রতিটি",
      dozen: "প্রতি ডজন",
    }) as Record<string, string>
  )[u] ?? `প্রতি ${u}`;

// baseUrl-এ আগে থেকেই /api/bazardor আছে, তাই এখানে আর যোগ করা হয়নি
async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours"); // বারবার API hit না করে 429 এড়াতে

  const res = await fetch(`${baseUrl}/products`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

const THEME = {
  up: {
    title: "আজ দাম বেড়েছে",
    arrow: "▲",
    titleArrow: "text-green-600",
    badge: "bg-green-50 text-green-600",
  },
  down: {
    title: "আজ দাম কমেছে",
    arrow: "▼",
    titleArrow: "text-red-500",
    badge: "bg-red-50 text-red-600",
  },
} as const;

export default async function PriceMovers({
  dir = "up",
  limit = 6,
}: {
  dir?: Dir;
  limit?: number;
}) {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    return (
      <section className="rounded-3xl bg-gray-50 p-5 text-center text-sm text-gray-500">
        এই মুহূর্তে তথ্য লোড করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।
      </section>
    );
  }

  const theme = THEME[dir];

  const items = products
    .filter((p) => p.change.dir === dir)
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, limit);

  if (items.length === 0) return null;

  return (
    <section className="rounded-3xl bg-gray-50/80 p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className={`text-sm ${theme.titleArrow}`}>{theme.arrow}</span>
        <h2 className="text-lg font-bold text-gray-900">{theme.title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                {p.image}
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-bold text-gray-900">
                  {p.nameBn}
                </h3>
                <p className="text-xs text-gray-500">{unitBn(p.unit)}</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">আজকের দাম</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xl font-extrabold text-gray-900">
                {bn(p.today)}{" "}
                <span className="text-sm font-medium text-gray-700">টাকা</span>
              </p>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${theme.badge}`}
              >
                {theme.arrow} {pctBn(p.change.pct)}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
