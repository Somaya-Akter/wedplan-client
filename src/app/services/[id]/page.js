"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, CalendarDays, ArrowLeft } from "lucide-react";
import { Toaster, toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [form, setForm] = useState({
    eventDate: "",
    eventLocation: "",
    message: "",
  });

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }

    loadService();
  }, [session, isPending, params.id]);

  const loadService = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/services/${params.id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Service not found.");
        setService(null);
        return;
      }

      setService(data.service);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load service.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (session?.user?.role !== "customer") {
      toast.error("Only customers can book services.");
      return;
    }

    if (
      !form.eventDate ||
      !form.eventLocation.trim()
    ) {
      toast.error(
        "Event date and location are required."
      );
      return;
    }

    try {
      setBookingLoading(true);

      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceId: params.id,
            eventDate: form.eventDate,
            eventLocation: form.eventLocation,
            message: form.message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Booking failed."
        );
        return;
      }

      toast.success(
        "Booking request submitted successfully."
      );

      setForm({
        eventDate: "",
        eventLocation: "",
        message: "",
      });

      setTimeout(() => {
        router.push(
          "/dashboard/customer/bookings"
        );
      }, 700);
    } catch (error) {
      console.error(error);
      toast.error("Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#7a3045]" />

          <p className="mt-4 text-gray-500">
            Loading service...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  if (!service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Service unavailable
          </h1>

          <Link
            href="/services"
            className="mt-5 inline-block text-[#7a3045]"
          >
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  const cannotBook =
    session.user.role !== "customer" ||
    session.user.id === service.vendorId;

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

          <Link
            href={`/dashboard/${session.user.role}`}
            className="rounded-full bg-[#7a3045] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#7a3045]"
        >
          <ArrowLeft size={17} />
          Back to Services
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <section>
            <img
              src={
                service.images?.[0] ||
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
              }
              alt={service.serviceName}
              className="h-[460px] w-full rounded-3xl object-cover shadow-sm"
            />

            <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm">
              <span className="rounded-full bg-[#f5e4e9] px-3 py-1 text-xs font-semibold text-[#7a3045]">
                {service.category}
              </span>

              <h1 className="mt-4 text-3xl font-bold">
                {service.serviceName}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-gray-500">
                <MapPin size={18} />
                {service.location}
              </div>

              <p className="mt-5 text-2xl font-bold text-[#7a3045]">
                ৳
                {Number(
                  service.price
                ).toLocaleString()}
              </p>

              <div className="mt-7 border-t pt-6">
                <h2 className="text-xl font-bold">
                  About this service
                </h2>

                <p className="mt-3 leading-7 text-gray-600">
                  {service.description}
                </p>
              </div>

              <div className="mt-7 border-t pt-6">
                <h2 className="font-bold">
                  Vendor
                </h2>

                <p className="mt-2 text-gray-600">
                  {service.vendorBusinessName ||
                    service.vendorName ||
                    "WedPlan Vendor"}
                </p>
              </div>
            </div>
          </section>

          <aside>
            <div className="sticky top-6 rounded-3xl bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5e4e9] text-[#7a3045]">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Book this service
                  </h2>

                  <p className="text-xs text-gray-500">
                    Send a request to the vendor
                  </p>
                </div>
              </div>

              {cannotBook ? (
                <div className="mt-6 rounded-2xl bg-orange-50 p-5 text-sm text-orange-700">
                  {session.user.role === "vendor"
                    ? "Vendors cannot book services."
                    : session.user.role === "admin"
                      ? "Admins cannot book services."
                      : "You cannot book your own service."}
                </div>
              ) : (
                <form
                  onSubmit={handleBooking}
                  className="mt-6 space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Event Date
                    </label>

                    <input
                      type="date"
                      name="eventDate"
                      value={form.eventDate}
                      onChange={handleChange}
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7a3045]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Event Location
                    </label>

                    <input
                      type="text"
                      name="eventLocation"
                      value={form.eventLocation}
                      onChange={handleChange}
                      required
                      placeholder="Dhaka, Bangladesh"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7a3045]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Message
                    </label>

                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell the vendor about your wedding..."
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7a3045]"
                    />
                  </div>

                  <button
                    disabled={bookingLoading}
                    className="w-full rounded-xl bg-[#7a3045] px-5 py-3 font-semibold text-white transition hover:bg-[#64263a] disabled:opacity-50"
                  >
                    {bookingLoading
                      ? "Submitting..."
                      : "Request Booking"}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}