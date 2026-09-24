import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f9f7f2] px-6 py-10">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm text-[#777c78]">
          <ArrowLeft size={16} /> Back to Festiva
        </Link>
        <div className="rounded-[2rem] border border-[#ebe8e1] bg-white p-7 shadow-sm md:p-9">
          <div className="text-center">
            <p className="serif text-4xl text-[#193c32]">Festiva</p>
            <h1 className="mt-8 text-2xl font-semibold text-[#202522]">Welcome back</h1>
            <p className="mt-2 text-sm text-[#777c78]">Sign in to continue planning your celebration.</p>
          </div>
          <form className="mt-8 space-y-4">
            <input className="w-full rounded-2xl border border-[#dedbd4] px-4 py-3.5 outline-none focus:border-[#193c32]" type="email" placeholder="Email address" />
            <input className="w-full rounded-2xl border border-[#dedbd4] px-4 py-3.5 outline-none focus:border-[#193c32]" type="password" placeholder="Password" />
            <button className="w-full rounded-2xl bg-[#193c32] py-3.5 font-medium text-white">Sign in</button>
          </form>
          <p className="mt-6 text-center text-sm text-[#777c78]">
            Don&apos;t have an account? <Link href="/register" className="font-medium text-[#193c32]">Create one</Link>
          </p>
        </div>
      </div>
    </main>
  );
}