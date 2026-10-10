"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    setLoading(true);
    try {
      const { error } = await signIn.email({ email, password });

      if (error) {
        setServerError(error.message ?? "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
        return;
      }

      // সফল হলে home page এ যাবে, আর Header নতুন session দেখবে
      window.location.href = "/";
    } catch {
      setServerError("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-10">
      <h1 className="text-2xl font-bold">সাইন ইন করুন</h1>
      <p className="mt-1 mb-6 text-sm text-gray-500">
        আপনার অ্যাকাউন্টে প্রবেশ করুন।
      </p>

      <div className="w-full max-w-96 rounded-2xl border p-5">
        <Form className="flex flex-col gap-4" onSubmit={handleSignIn}>
          <TextField isRequired name="email" type="email">
            <Label>ইমেইল</Label>
            <Input />
            <FieldError />
          </TextField>

          <TextField isRequired name="password" type="password">
            <Label>পাসওয়ার্ড</Label>
            <Input />
            <FieldError />
          </TextField>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <Button type="submit" isDisabled={loading} className="w-full">
            {loading ? "অপেক্ষা করুন..." : "সাইন ইন করুন"}
          </Button>
        </Form>

        <div className="my-4 flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          অথবা
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onPress={() => signIn.social({ provider: "google", callbackURL: "/" })}
          >
            Google দিয়ে চালিয়ে যান
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onPress={() => signIn.social({ provider: "github", callbackURL: "/" })}
          >
            GitHub দিয়ে চালিয়ে যান
          </Button>
        </div>

        <p className="mt-4 text-center text-sm">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/sign-up" className="text-green-700">
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <Link href="/" className="mt-6 text-sm text-gray-500">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
};

export default SignInPage;
