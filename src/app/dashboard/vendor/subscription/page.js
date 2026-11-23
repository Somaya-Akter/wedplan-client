"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Crown,
  CreditCard,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SubscriptionPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [subscription, setSubscription] = useState({
    plan: "Free",
    expiresAt: null,
  });

  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }

    if (session.user.role !== "vendor") {
      router.replace(`/dashboard/${session.user.role}`);
      return;
    }

    loadSubscription();
  }, [session, isPending]);

  const loadSubscription = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/vendor/subscription`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubscription(
          data.subscription || {
            plan: "Free",
            expiresAt: null,
          }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subscription.");
    } finally {
      setLoading(false);
    }
  };

  const upgradeToPremium = async () => {
    try {
      setCheckoutLoading(true);

      const response = await fetch(
        `${API_URL}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Unable to start Stripe checkout."
        );
        return;
      }

      if (!data.url) {
        toast.error("Stripe checkout URL was not returned.");
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error("Stripe checkout failed.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#7a3045]" />

          <p className="mt-4 text-gray-500">
            Loading subscription...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "vendor") {
    return null;
  }

  const isPremium = subscription.plan === "Premium";

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <Toaster richColors position="top-right" />

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-[#7a3045]"
          >
            WedPlan
          </Link>

          <span className="rounded-full bg-[#f4e4e9] px-4 py-2 text-sm font-semibold text-[#7a3045]">
            {subscription.plan} Plan
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/dashboard/vendor"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#7a3045]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mt-8 text-center">
          <p className="font-semibold text-[#7a3045]">
            Vendor Subscription
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Grow your wedding business
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-500">
            Start free or upgrade to Premium for unlimited active services.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
              <CreditCard size={22} />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Free
            </h2>

            <p className="mt-2 text-3xl font-bold">
              $0
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Forever
            </p>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <Feature text="Up to 3 active services" />
              <Feature text="Manage booking requests" />
              <Feature text="Vendor dashboard" />
              <Feature text="Service approval system" />
            </div>

            <button
              disabled
              className="mt-8 w-full rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-500"
            >
              {isPremium ? "Previous Plan" : "Current Plan"}
            </button>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-[#281d21] p-7 text-white shadow-xl">
            <span className="absolute right-5 top-5 rounded-full bg-[#f3d7a4] px-3 py-1 text-xs font-bold text-[#281d21]">
              RECOMMENDED
            </span>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Crown size={23} />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Premium
            </h2>

            <div className="mt-2 flex items-end gap-1">
              <p className="text-3xl font-bold">
                $9.99
              </p>

              <span className="mb-1 text-sm text-white/60">
                / month
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm text-white/80">
              <Feature text="Unlimited active services" />
              <Feature text="Everything in Free plan" />
              <Feature text="Premium vendor status" />
              <Feature text="Grow your service catalogue" />
            </div>

            {isPremium ? (
              <div className="mt-8 rounded-xl bg-green-500/15 px-5 py-3 text-center font-semibold text-green-200">
                Premium Active
              </div>
            ) : (
              <button
                onClick={upgradeToPremium}
                disabled={checkoutLoading}
                className="mt-8 w-full rounded-xl bg-white px-5 py-3 font-bold text-[#281d21] transition hover:bg-gray-100 disabled:opacity-50"
              >
                {checkoutLoading
                  ? "Opening Checkout..."
                  : "Upgrade with Stripe"}
              </button>
            )}

            {isPremium && subscription.expiresAt && (
              <p className="mt-3 text-center text-xs text-white/50">
                Current subscription period ends{" "}
                {new Date(
                  subscription.expiresAt
                ).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
        <Check size={13} />
      </div>

      <span>{text}</span>
    </div>
  );
}