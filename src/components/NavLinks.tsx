import baseUrl from "@/services/baseUrl";
import Link from "next/link";

const NavLinks = async () => {
  const res = await fetch(`${baseUrl}/categories`, {
    next: {
      revalidate: 60,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch categories: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();

  return (
    <nav className="w-full border-y border-gray-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-start px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {data.map(
            (
              n: {
                slug: string;
                nameBn: string;
                icon: string;
              },
              i: number
            ) => (
              <Link
                key={n.slug || i}
                href={`/category/${n.slug}`}
                className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-green-50 hover:text-green-600 active:scale-95 sm:px-5 sm:text-base"
              >
                <span>{n.icon}</span>
                <span> {n.nameBn}</span>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavLinks;
