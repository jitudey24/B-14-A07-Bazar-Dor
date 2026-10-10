"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

import DateDisplay from "./DateDisplay";
import toast from "react-hot-toast";

// navLinks = layout.tsx (server) theke ashbe, tai ekhane import korte hobe na
const Header = ({ navLinks }: { navLinks: ReactNode }) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = session?.user;

  // sign-up er somoy deya naam dekhabe; naam na thakle email er prothom ongsho
  const displayName =
    user?.name?.trim() || user?.email?.split("@")[0] || "User";

  // বাইরে click করলে বা Escape চাপলে dropdown বন্ধ হবে
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);

    try {
      const { error } = await signOut();

      if (error) {
        toast.error("সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সাইন আউট সফল হয়েছে");
      setIsDropdownOpen(false);
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-600 shadow-sm sm:h-11 sm:w-11">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর logo"
                width={44}
                height={44}
                priority
                className="h-6 w-6 object-contain brightness-0 invert sm:h-7 sm:w-7"
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-black tracking-tight text-gray-900 sm:text-2xl">
                বাজার দর
              </h1>
              <div className="truncate text-xs sm:text-sm">
                <DateDisplay />
              </div>
            </div>
          </Link>

          {/* Authentication */}
          <div
            ref={dropdownRef}
            className="relative flex shrink-0 items-center gap-1.5 sm:gap-3"
          >
            {isPending ? (
              // session load hocche: sign-in button flash kora ekhane bondho
              <div className="h-10 w-24 animate-pulse rounded-xl bg-gray-100 sm:h-11 sm:w-28" />
            ) : user ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-1.5 py-1.5 shadow-sm hover:bg-gray-50 sm:gap-2 sm:px-3 sm:py-2"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={displayName}
                      width={36}
                      height={36}
                      unoptimized
                      className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-bold text-green-700 sm:h-9 sm:w-9">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="max-w-16 truncate text-sm font-semibold text-gray-800 sm:max-w-32 sm:text-base">
                    {displayName}
                  </span>

                  <span className="text-xs text-gray-500">
                    {isDropdownOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-[60] mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
                  >
                    <div className="border-b border-gray-100 px-3 py-3">
                      <p className="truncate font-bold text-gray-900">
                        {displayName}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="mt-2 block rounded-lg px-3 py-2.5 font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
                    >
                      👤 প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="mt-1 w-full rounded-lg px-3 py-2.5 text-left font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSigningOut ? "সাইন আউট হচ্ছে..." : "↩ সাইন আউট"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 sm:px-6 sm:py-2.5 sm:text-base"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="rounded-xl bg-green-500 px-3 py-2 text-sm font-bold text-white hover:bg-green-600 sm:px-6 sm:py-2.5 sm:text-base"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Navigation links */}
        {navLinks}
      </header>
    </>
  );
};

export default Header;
