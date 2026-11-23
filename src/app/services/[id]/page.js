"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Tag,
  User,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ServiceDetailsPage() {
  const router = useRouter();

  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [serviceId, setServiceId] = useState("");
  const [service, setService] = useState(null);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [bookingData, setBookingData] = useState({
    eventDate: "",
    eventLocation: "",
    message: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/");
      const id = parts[parts.length - 1];

      if (id) {
        setServiceId(id);
      }
    }
  }, []);

  useEffect(() => {
    if (!serviceId) return;

    async function loadService() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/services/${serviceId}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load service."
          );
        }

        setService(data?.service || data);
      } catch (err) {
        setError(
          err?.message || "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [serviceId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setBookingData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleBooking(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!session?.user) {
      router.push("/sign-in");
      return;
    }

    const role = (
      session.user.role ||
      session.user.requestedRole ||
      "customer"
    ).toLowerCase();

    if (role === "admin") {
      setError("Admin cannot book a service.");
      return;
    }

    if (role === "vendor") {
      setError("Vendors cannot book their own services.");
      return;
    }

    if (
      !bookingData.eventDate ||
      !bookingData.eventLocation.trim()
    ) {
      setError(
        "Event date and event location are required."
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
            serviceId,
            eventDate: bookingData.eventDate,
            eventLocation:
              bookingData.eventLocation.trim(),
            message: bookingData.message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to submit booking."
        );
      }

      setMessage(
        data?.message ||
          "Booking request submitted successfully."
      );

      setBookingData({
        eventDate: "",
        eventLocation: "",
        message: "",
      });
    } catch (err) {
      setError(
        err?.message ||
          "Failed to submit booking."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#7a3045]" />

          <p className="mt-3 font-medium text-gray-600">
            Loading service...
          </p>
        </div>
      </main>
    );
  }

  if (error && !service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Service unavailable
          </h1>

          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>

          <Link
            href="/services"
            className="mt-6 inline-block rounded-xl bg-[#7a3045] px-6 py-3 font-semibold text-white"
          >
            Browse Services
          </Link>
        </div>
      </main>
    );
  }

  const image =
    service?.images?.[0] ||
    service?.image ||
    service?.imageUrl ||
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80";

  const vendorName =
    service?.businessName ||
    service?.vendorName ||
    "Wedding Service Vendor";

  const role = (
    session?.user?.role ||
    session?.user?.requestedRole ||
    ""
  ).toLowerCase();

  const isCustomer =
    Boolean(session?.user) &&
    (!role || role === "customer");

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link
            href="/"
            className="text-2xl font-bold text-[#7a3045]"
          >
            WedPlan
          </Link>

          <Link
            href="/services"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#7a3045]"
          >
            <ArrowLeft size={17} />
            Browse Services
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          <div>
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <img
                src={image}
                alt={
                  service?.serviceName ||
                  "Wedding service"
                }
                className="h-[300px] w-full object-cover md:h-[430px]"
              />

              <div className="p-6 md:p-8">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#f6e7ec] px-4 py-1.5 text-sm font-semibold text-[#7a3045]">
                    {service?.category ||
                      "Wedding Service"}
                  </span>

                  <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
                    {service?.status || "Approved"}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  {service?.serviceName ||
                    service?.name ||
                    "Wedding Service"}
                </h1>

                <div className="mt-5 flex flex-wrap gap-5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={17}
                      className="text-[#7a3045]"
                    />
                    {service?.location ||
                      "Bangladesh"}
                  </div>

                  <div className="flex items-center gap-2">
                    <User
                      size={17}
                      className="text-[#7a3045]"
                    />
                    {vendorName}
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag
                      size={17}
                      className="text-[#7a3045]"
                    />
                    {service?.category ||
                      "Wedding"}
                  </div>
                </div>

                <div className="mt-8 border-t pt-7">
                  <p className="text-sm font-medium text-gray-500">
                    Starting from
                  </p>

                  <p className="mt-1 text-3xl font-bold text-[#7a3045]">
                    ৳
                    {Number(
                      service?.price || 0
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900">
                    About this service
                  </h2>

                  <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
                    {service?.description ||
                      "Professional wedding service designed to make your celebration memorable and stress-free."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-6 rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">
                Book this service
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Send a booking request to the vendor
                for your wedding event.
              </p>

              {message && (
                <div className="mt-5 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
                  {message}
                </div>
              )}

              {error && service && (
                <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {sessionLoading ? (
                <div className="mt-7 flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking account...
                </div>
              ) : !session?.user ? (
                <div className="mt-7">
                  <p className="text-sm text-gray-600">
                    Please sign in as a customer to
                    request a booking.
                  </p>

                  <Link
                    href="/sign-in"
                    className="mt-4 block rounded-xl bg-[#7a3045] px-5 py-3 text-center font-semibold text-white"
                  >
                    Sign In to Book
                  </Link>
                </div>
              ) : isCustomer ? (
                <form
                  onSubmit={handleBooking}
                  className="mt-7 space-y-5"
                >
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <CalendarDays size={16} />
                      Event Date
                    </label>

                    <input
                      type="date"
                      name="eventDate"
                      value={
                        bookingData.eventDate
                      }
                      onChange={handleChange}
                      required
                      min={new Date()
                        .toISOString()
                        .split("T")[0]}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#7a3045]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin size={16} />
                      Event Location
                    </label>

                    <input
                      type="text"
                      name="eventLocation"
                      value={
                        bookingData.eventLocation
                      }
                      onChange={handleChange}
                      required
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#7a3045]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Message
                    </label>

                    <textarea
                      name="message"
                      value={bookingData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell the vendor about your wedding..."
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#7a3045]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7a3045] px-5 py-3 font-semibold text-white transition hover:bg-[#65263a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {bookingLoading && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}

                    {bookingLoading
                      ? "Submitting..."
                      : "Request Booking"}
                  </button>
                </form>
              ) : (
                <div className="mt-7 rounded-xl bg-amber-50 p-4 text-sm font-medium text-amber-700">
                  Only customers can book wedding
                  services.
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}