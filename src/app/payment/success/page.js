"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={42} />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-[#7a3045]">
          Payment Successful
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Welcome to WedPlan Premium!
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          Your payment was completed successfully.
          Your Premium plan will be activated after the
          verified Stripe webhook confirms the payment.
        </p>

        <div className="mt-8 rounded-2xl bg-[#faf7f2] p-5 text-left">
          <p className="font-semibold text-gray-900">
            Premium benefits
          </p>

          <p className="mt-2 text-sm text-gray-500">
            ✓ Unlimited active wedding services
          </p>

          <p className="mt-2 text-sm text-gray-500">
            ✓ Full vendor booking management
          </p>

          <p className="mt-2 text-sm text-gray-500">
            ✓ Premium vendor plan
          </p>
        </div>

        <Link
          href="/dashboard/vendor/subscription"
          className="mt-8 inline-block w-full rounded-xl bg-[#7a3045] px-6 py-3 font-semibold text-white transition hover:bg-[#64263a]"
        >
          Return to Subscription
        </Link>

        <Link
          href="/dashboard/vendor"
          className="mt-3 inline-block text-sm font-semibold text-[#7a3045]"
        >
          Go to Vendor Dashboard
        </Link>
      </div>
    </main>
  );
}