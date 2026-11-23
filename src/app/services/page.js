"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function ServicesPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (category) {
        params.set("category", category);
      }

      if (location.trim()) {
        params.set("location", location.trim());
      }

      if (sort) {
        params.set("sort", sort);
      }

      const res = await fetch(
        `${API_URL}/api/services?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      setServices(data.services || []);
    } catch (error) {
      console.error("Failed to load services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, location, sort]);

  const handleViewDetails = (id) => {
    if (!session?.user) {
      router.push("/sign-in");
      return;
    }

    router.push(`/services/${id}`);
  };

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-[#7a3045]"
          >
            WedPlan
          </Link>

          <div className="flex items-center gap-5 text-sm font-medium">
            <Link href="/">Home</Link>

            {!session?.user ? (
              <>
                <Link href="/sign-in">Sign In</Link>

                <Link
                  href="/sign-up"
                  className="rounded-full bg-[#7a3045] px-5 py-2.5 text-white"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                href={`/dashboard/${session.user.role || "customer"}`}
                className="rounded-full bg-[#7a3045] px-5 py-2.5 text-white"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="bg-[#7a3045] px-6 py-16 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">
          Find Wedding Services
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-white/75">
          Discover trusted wedding professionals and find the perfect services
          for your celebration.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal
              size={20}
              className="text-[#7a3045]"
            />

            <h2 className="font-semibold">
              Search & Filter
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search service..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#7a3045]"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7a3045]"
            >
              <option value="">
                All Categories
              </option>

              {categories.map((item) => (
                <option
                  value={item}
                  key={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location..."
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7a3045]"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7a3045]"
            >
              <option value="">
                Newest First
              </option>

              <option value="price-asc">
                Price: Low to High
              </option>

              <option value="price-desc">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Wedding Services
            </h2>

            {!loading && (
              <p className="mt-1 text-sm text-gray-500">
                {services.length} service
                {services.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#7a3045]" />

              <p className="mt-4 text-sm text-gray-500">
                Loading wedding services...
              </p>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
            <h3 className="text-xl font-bold">
              No services found
            </h3>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={
                    service.images?.[0] ||
                    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80"
                  }
                  alt={service.serviceName}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">
                  <span className="rounded-full bg-[#f6e8ec] px-3 py-1 text-xs font-semibold text-[#7a3045]">
                    {service.category}
                  </span>

                  <h3 className="mt-4 text-xl font-bold">
                    {service.serviceName}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    {service.location}
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    By{" "}
                    <span className="font-medium text-gray-700">
                      {service.vendorBusinessName ||
                        service.vendorName ||
                        "WedPlan Vendor"}
                    </span>
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-xl font-bold text-[#7a3045]">
                      ৳
                      {Number(
                        service.price || 0
                      ).toLocaleString()}
                    </p>

                    <button
                      onClick={() =>
                        handleViewDetails(service._id)
                      }
                      className="rounded-xl border border-[#7a3045] px-4 py-2 text-sm font-semibold text-[#7a3045] transition hover:bg-[#7a3045] hover:text-white"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}