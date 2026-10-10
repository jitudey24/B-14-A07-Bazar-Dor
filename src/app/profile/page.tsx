"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { signOut, updateUser, useSession } from "@/lib/auth-client";

type ProfileUser = {
  name?: string | null;
  email: string;
  image?: string | null;
};

/* ---------- Name update form ---------- */
const NameForm = ({ user }: { user: ProfileUser }) => {
  const router = useRouter();
  const [name, setName] = useState(user.name ?? "");
  const [saving, setSaving] = useState(false);

  const trimmed = name.trim();
  const unchanged = trimmed === (user.name ?? "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;

    if (trimmed.length < 3) {
      toast.error("নাম কমপক্ষে ৩ অক্ষরের হতে হবে");
      return;
    }

    setSaving(true);

    try {
      const { error } = await updateUser({ name: trimmed });

      if (error) {
        toast.error(error.message || "নাম আপডেট করা যায়নি");
        return;
      }

      toast.success("নাম আপডেট হয়েছে!");
      router.refresh();
    } catch {
      toast.error("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        isRequired
        name="name"
        value={name}
        onChange={setName}
        validate={(value) =>
          value.trim().length < 3 ? "নাম কমপক্ষে ৩ অক্ষরের হতে হবে" : null
        }
        className="w-full"
      >
        <Label>নাম</Label>
        <Input placeholder="আপনার নাম" autoComplete="name" />
        <FieldError />
      </TextField>

      <Button
        type="submit"
        isDisabled={saving || unchanged}
        className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-60"
      >
        {saving ? "আপডেট হচ্ছে..." : "আপডেট"}
      </Button>
    </Form>
  );
};

/* ---------- Page ---------- */
const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;

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
    router.replace("/");
    router.refresh();
  } catch {
    toast.error("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
  } finally {
    setIsSigningOut(false);
  }
};

  if (isPending) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-100" />
        <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-56 animate-pulse rounded-2xl bg-gray-100" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-gray-600">প্রোফাইল দেখতে সাইন ইন করুন।</p>
        <Link
          href="/sign-in?callbackURL=/profile"
          className="mt-4 inline-block rounded-xl bg-green-600 px-6 py-2.5 font-bold text-white hover:bg-green-700"
        >
          সাইন ইন
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">আমার প্রোফাইল</h1>
        <p className="mt-1 text-sm text-gray-500">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      {/* Profile card */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex min-w-0 items-center gap-4">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User profile"}
              width={64}
              height={64}
              unoptimized
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl font-bold text-green-700">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-gray-900">
              {user.name || "User"}
            </p>
            <p className="truncate text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <Button
          type="button"
          onPress={handleSignOut}
          isDisabled={isSigningOut}
          className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          {isSigningOut ? "অপেক্ষা করুন..." : "↪ সাইন আউট"}
        </Button>
      </section>

      {/* Info card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">তথ্য</h2>
        {/* key দিলে নাম বদলালে form নতুন value নেয় */}
        <NameForm key={user.name ?? ""} user={user} />
      </section>
    </main>
  );
};

export default ProfilePage;
