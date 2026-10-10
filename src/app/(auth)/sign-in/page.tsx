"use client";

import { useState } from "react";
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
import { signIn } from "@/lib/auth-client";

// Details page theke ashle login er por oi page e ferot pathabe
const getSafeCallbackURL = () => {
  const url = new URLSearchParams(window.location.search).get("callbackURL");
  // sudhu nijer site er path allow, na hole onno site e pathano jay
  return url && url.startsWith("/") && !url.startsWith("//") ? url : "/";
};

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setLoading(true);

    try {
      const { error } = await signIn.email({ email, password });

      if (error) {
        toast.error(error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে!");
      window.location.href = "/";
    } catch {
      toast.error("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  }; // <-- ei closing ta missing chilo

  const handleSocialSignIn = async (provider: "google" | "github") => {
    const label = provider === "google" ? "Google" : "GitHub";

    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: getSafeCallbackURL(),
      });

      if (error) {
        toast.error(error.message || `${label} দিয়ে লগইন ব্যর্থ হয়েছে`);
      }
    } catch {
      toast.error(`${label} দিয়ে লগইন করা যায়নি`);
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
            <Input autoComplete="email" />
            <FieldError />
          </TextField>

          <TextField isRequired name="password" type="password">
            <Label>পাসওয়ার্ড</Label>
            <Input autoComplete="current-password" />
            <FieldError />
          </TextField>

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
            isDisabled={loading}
            onPress={() => handleSocialSignIn("google")}
          >
            Google দিয়ে চালিয়ে যান
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            isDisabled={loading}
            onPress={() => handleSocialSignIn("github")}
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
