"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type RegisterResponse = {
  accessToken: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const result = await api<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      localStorage.setItem("festyvibe_token", result.accessToken);

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f9f7f2] px-6 py-10">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm text-[#777c78] transition hover:text-[#193c32]"
        >
          <ArrowLeft size={16} />
          Back to Festyvibe
        </Link>

        <div className="rounded-[2rem] border border-[#ebe8e1] bg-white p-7 shadow-sm md:p-9">
          <div className="text-center">
            <p className="serif text-4xl text-[#193c32]">Festyvibe</p>

            <h1 className="mt-8 text-2xl font-semibold text-[#202522]">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-[#777c78]">
              Start planning your special day.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-[#202522]"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-[#dedbd4] px-4 py-3.5 outline-none transition focus:border-[#193c32]"
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#202522]"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-[#dedbd4] px-4 py-3.5 outline-none transition focus:border-[#193c32]"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#202522]"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#dedbd4] px-4 py-3.5 outline-none transition focus:border-[#193c32]"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#193c32] py-3.5 font-medium text-white transition hover:bg-[#244c40] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#777c78]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#193c32] transition hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}