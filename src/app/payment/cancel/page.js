"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <XCircle size={42} />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-[#7a3045]">
          Payment Cancelled
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Your payment was not completed
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          No payment was processed and your current subscription plan remains unchanged.
        </p>

        <Link
          href="/dashboard/vendor/subscription"
          className="mt-8 inline-block w-full rounded-xl bg-[#7a3045] px-6 py-3 font-semibold text-white transition hover:bg-[#64263a]"
        >
          Try Again
        </Link>

        <Link
          href="/dashboard/vendor"
          className="mt-3 inline-block text-sm font-semibold text-[#7a3045]"
        >
          Back to Vendor Dashboard
        </Link>
      </div>
    </main>
  );
}