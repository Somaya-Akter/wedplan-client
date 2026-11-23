import Link from "next/link";
import {
  Camera,
  Utensils,
  Music,
  Flower2,
  MapPin,
  Sparkles,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Star,
} from "lucide-react";

const services = [
  {
    title: "Wedding Photography",
    category: "Photography",
    location: "Dhaka",
    price: "৳25,000",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Royal Wedding Venue",
    category: "Venue",
    location: "Dhaka",
    price: "৳80,000",
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Premium Catering",
    category: "Catering",
    location: "Chattogram",
    price: "৳45,000",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Floral Decoration",
    category: "Decoration",
    location: "Dhaka",
    price: "৳30,000",
    image:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Wedding DJ & Music",
    category: "Entertainment",
    location: "Sylhet",
    price: "৳20,000",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Bridal Makeup",
    category: "Beauty",
    location: "Dhaka",
    price: "৳18,000",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
  },
];

const categories = [
  { name: "Photography", icon: Camera },
  { name: "Catering", icon: Utensils },
  { name: "Entertainment", icon: Music },
  { name: "Decoration", icon: Flower2 },
  { name: "Venues", icon: MapPin },
  { name: "Beauty", icon: Sparkles },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf7f2] text-gray-900">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-2xl font-bold text-[#7a3045]">
            WedPlan
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link href="/" className="text-sm font-medium hover:text-[#7a3045]">
              Home
            </Link>

            <Link
              href="/services"
              className="text-sm font-medium hover:text-[#7a3045]"
            >
              Browse Services
            </Link>

            <Link
              href="/sign-in"
              className="text-sm font-medium hover:text-[#7a3045]"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-full bg-[#7a3045] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#64263a]"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative min-h-[620px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=85"
          alt="Elegant wedding celebration"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-6">
          <div className="max-w-3xl text-white">
            <p className="mb-4 font-medium uppercase tracking-[0.25em] text-[#f4d7df]">
              Your Dream Wedding Starts Here
            </p>

            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              Plan every beautiful moment with confidence.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              Discover trusted wedding professionals, compare services and
              manage your bookings from one elegant platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="rounded-full bg-[#8c3650] px-7 py-3.5 font-semibold text-white transition hover:bg-[#702b40]"
              >
                Explore Services
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full border border-white/60 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Become a Vendor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="font-semibold text-[#8c3650]">Wedding Categories</p>

          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Everything you need for the big day
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ name, icon: Icon }) => (
            <Link
              href={`/services?category=${name}`}
              key={name}
              className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f6e8ec] text-[#8c3650]">
                <Icon size={22} />
              </div>

              <p className="mt-4 font-semibold">{name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-semibold text-[#8c3650]">
                Featured Services
              </p>

              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Services couples love
              </h2>

              <p className="mt-3 max-w-xl text-gray-500">
                Explore trusted wedding professionals ready to bring your
                celebration to life.
              </p>
            </div>

            <Link
              href="/services"
              className="font-semibold text-[#8c3650] hover:underline"
            >
              Browse all services →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#f6e8ec] px-3 py-1 text-xs font-semibold text-[#8c3650]">
                      {service.category}
                    </span>

                    <div className="flex items-center gap-1 text-sm">
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      4.9
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold">{service.title}</h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    {service.location}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <p>
                      <span className="text-xl font-bold text-[#7a3045]">
                        {service.price}
                      </span>
                      <span className="text-sm text-gray-400"> / package</span>
                    </p>

                    <Link
                      href="/services"
                      className="rounded-lg border border-[#7a3045] px-4 py-2 text-sm font-semibold text-[#7a3045] transition hover:bg-[#7a3045] hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-semibold text-[#8c3650]">Why WedPlan?</p>

            <h2 className="mt-2 text-4xl font-bold leading-tight">
              Less stress. Better planning. Beautiful memories.
            </h2>

            <p className="mt-5 leading-7 text-gray-500">
              WedPlan connects couples with reliable wedding professionals
              while keeping bookings and planning simple.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 text-[#8c3650]" />
                <div>
                  <h3 className="font-bold">Trusted professionals</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Browse approved and active wedding services.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <ShieldCheck className="mt-1 text-[#8c3650]" />
                <div>
                  <h3 className="font-bold">Secure booking experience</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage booking requests through your personal dashboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Heart className="mt-1 text-[#8c3650]" />
                <div>
                  <h3 className="font-bold">Made for your celebration</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Find everything from venues to photographers in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80"
            alt="Wedding couple celebration"
            className="h-[480px] w-full rounded-[2rem] object-cover shadow-xl"
          />
        </div>
      </section>

      <section className="bg-[#7a3045] py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Sparkles className="mx-auto mb-5" />

          <h2 className="text-4xl font-bold">
            Ready to start planning your dream wedding?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/75">
            Join WedPlan and connect with wedding professionals who can make
            every detail unforgettable.
          </p>

          <Link
            href="/sign-up"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 font-semibold text-[#7a3045]"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="bg-[#22191c] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
          <div>
            <h3 className="text-2xl font-bold">WedPlan</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
              A modern wedding planning platform connecting couples with
              trusted wedding professionals.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>

            <div className="mt-4 space-y-2 text-sm text-white/60">
              <p>
                <Link href="/services">Browse Services</Link>
              </p>
              <p>
                <Link href="/sign-in">Sign In</Link>
              </p>
              <p>
                <Link href="/sign-up">Create Account</Link>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Wedding Planning</h4>

            <p className="mt-4 text-sm leading-6 text-white/60">
              Photography · Venues · Catering · Decoration · Entertainment ·
              Beauty
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
          © 2026 WedPlan. All rights reserved.
        </div>
      </footer>
    </main>
  );
}