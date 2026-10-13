"use client";

import Link from "next/link";

import { useRef, useState } from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import Calculator from "../components/calculator";

import { AnimatedNumber, EASE, Reveal, Spotlight } from "../components/motion";

import { BRAND } from "../lib/brand";

import { DESTINATIONS, METHODS } from "../lib/quote";

/* ------------------------------------------------------------------ */

/* Content                                                             */

/* ------------------------------------------------------------------ */

const FAQS = [
  [
    "Is the app available yet?",

    `Not yet. ${BRAND} is coming soon to iOS and Android, starting with the UK to Jamaica.`,
  ],

  [
    `Is ${BRAND} a bank?`,

    "No. We are building a money transfer app. Regulated payment services will be provided by an authorised partner, and we will name that partner clearly before you send anything.",
  ],

  [
    "Where can I send money?",

    "We are starting with the UK to Jamaica (JMD). We then plan to add the Eastern Caribbean dollar (XCD) countries: Antigua and Barbuda, Dominica, Grenada, St Kitts and Nevis, St Lucia, and St Vincent and the Grenadines. Timing depends on our licensed partners in each country.",
  ],

  [
    "How will my family receive it?",

    "We are planning bank deposits, mobile wallets and cash pickup through licensed partners.",
  ],

  [
    "What will it cost?",

    "A flat fee per transfer plus the exchange rate, both shown before you confirm. The numbers on this website are examples.",
  ],

  [
    "What if something goes wrong?",

    "You will be able to reach a real person by chat, email or WhatsApp, and every transfer will have a status you can check.",
  ],
];

const STEPS = [
  [
    "Download the app",

    "Sign up with your UK phone number and a few basic details.",
  ],

  [
    "Verify your identity",

    "A quick one-time check keeps you and your family protected.",
  ],

  [
    "Add who you are sending to",

    "Save their bank account, mobile wallet or pickup details so next time is one tap.",
  ],

  [
    "Send and track",

    "Check the rate, fee and total, pay by bank transfer, then follow it until it lands.",
  ],
];

/* ------------------------------------------------------------------ */

/* Shared bits                                                         */

/* ------------------------------------------------------------------ */

const btnPrimary =
  "inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#8B5CF6] to-[#6D3FD9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/40 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function StoreButtons({ center = false }: { center?: boolean }) {
  const reduce = useReducedMotion();

  const stores = [
    {
      name: "App Store",
      subtitle: "Download on the",
      href: "https://www.apple.com/app-store/",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-9 w-9 shrink-0 fill-white"
          aria-hidden="true"
        >
          <path d="M16.37 12.98c.02 2.13 1.87 2.84 1.89 2.85-.02.05-.3 1.04-.98 2.06-.59.88-1.2 1.75-2.16 1.77-.94.02-1.25-.57-2.33-.57-1.08 0-1.42.55-2.31.59-.93.04-1.64-.95-2.23-1.82-1.21-1.76-2.14-4.97-.9-7.14.62-1.08 1.72-1.76 2.91-1.78.91-.02 1.77.62 2.33.62.56 0 1.61-.77 2.72-.66.47.02 1.79.19 2.64 1.43-.07.04-1.58.92-1.58 2.65ZM14.58 6.99c.49-.59.82-1.41.73-2.23-.71.03-1.57.47-2.08 1.06-.46.53-.86 1.36-.75 2.16.79.06 1.61-.4 2.1-.99Z" />
        </svg>
      ),
    },
    {
      name: "Google Play",
      subtitle: "GET IT ON",
      href: "https://play.google.com/store",
      icon: (
        <svg
          viewBox="0 0 32 36"
          className="h-9 w-8 shrink-0"
          aria-hidden="true"
        >
          <path
            d="M2 1.8C1.4 2.4 1 3.3 1 4.5v27c0 1.2.4 2.1 1 2.7l.3.3L17.4 19v-1L2.3 1.5 2 1.8Z"
            fill="#00D7FE"
          />
          <path
            d="m22.5 24.1-5.1-5.1v-1l5.1-5.1.1.1 6 3.4c1.7 1 1.7 2.7 0 3.7l-6 3.4-.1.6Z"
            fill="#FFCE00"
          />
          <path
            d="M22.5 24.1 17.4 19 2 34.2c.6.7 1.7.8 2.9.1l17.6-10.2Z"
            fill="#00F076"
          />
          <path
            d="M22.5 12.9 4.9 2.7C3.7 2 2.6 2.1 2 2.8L17.4 19l5.1-6.1Z"
            fill="#FF3A44"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${
        center ? "justify-center" : ""
      }`}
    >
      {stores.map((store) => (
        <motion.a
          key={store.name}
          href={store.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${store.name}. App coming soon.`}
          whileHover={reduce ? undefined : { y: -3, scale: 1.025 }}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 22,
          }}
          className="inline-flex min-h-[62px] w-full max-w-[225px] items-center gap-3 rounded-xl border border-white/70 bg-black px-3.5 py-2.5 text-left text-white shadow-sm transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300 sm:w-[215px]"
        >
          {store.icon}

          <span className="min-w-0">
            <span className="block text-[9px] font-medium leading-tight tracking-wide text-white/90">
              {store.subtitle}
            </span>

            <span className="mt-0.5 block whitespace-nowrap font-sans text-[19px] font-semibold leading-tight tracking-tight sm:text-[20px]">
              {store.name}
            </span>
          </span>
        </motion.a>
      ))}
    </div>
  );
}

function Logo() {
  return (
    <Link
      href="/"

      className="flex min-w-0 items-center gap-2 font-display text-base font-semibold sm:gap-2.5 sm:text-lg"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#A78BFA] to-[#6D3FD9]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"

            stroke="#fff"

            strokeWidth="1.8"

            strokeLinecap="round"

            strokeLinejoin="round"
          />
        </svg>
      </span>

      {BRAND}
    </Link>
  );
}

function SectionHead({
  label,

  title,

  sub,
}: {
  label: string;

  title: string;

  sub?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center" blur>
      <p className="text-sm font-semibold text-violet-300">{label}</p>

      <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {sub && <p className="mt-4 text-lg text-white/60">{sub}</p>}
    </Reveal>
  );
}

function Tick() {
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500 text-white">
      <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M2.8 7.3 5.7 10l5.5-6"

          stroke="currentColor"

          strokeWidth="2"

          strokeLinecap="round"

          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */

/* Nav                                                                 */

/* ------------------------------------------------------------------ */

function Navbar() {
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const products = [
    {
      label: "Money Transfers",
      description: "Send money home with confidence.",
      href: "#features",
    },
    {
      label: "Exchange Rates & Fees",
      description: "See exactly what your family receives.",
      href: "#pricing",
    },
    {
      label: "Transfer Tracking",
      description: "Follow every transfer from start to finish.",
      href: "#features",
    },
    {
      label: "Saved Recipients",
      description: "Keep your regular recipients in one place.",
      href: "#features",
    },
  ];

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setProductsOpen(false);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-5 sm:px-4">
      <motion.nav
        aria-label="Main navigation"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        onKeyDown={(event) => {
          if (event.key === "Escape") closeMobileMenu();
        }}
        className="pointer-events-auto relative flex w-full max-w-6xl min-w-0 items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/80 py-2.5 pl-3 pr-2 backdrop-blur-xl sm:gap-6 sm:rounded-full sm:py-3 sm:pl-5 sm:pr-3"
      >
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              type="button"
              aria-expanded={productsOpen}
              aria-haspopup="true"
              onClick={() => setProductsOpen((open) => !open)}
              className="inline-flex items-center gap-2 py-2 text-sm font-medium text-white/75 transition hover:text-white focus-visible:outline-2 focus-visible:outline-violet-400"
            >
              Products
              <motion.svg
                animate={{ rotate: productsOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </button>
            <AnimatePresence>
              {productsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full w-80 pt-3"
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#100B20] p-2 shadow-2xl shadow-black/50">
                    <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                      Explore our products
                    </p>
                    {products.map((product) => (
                      <a
                        key={product.label}
                        href={product.href}
                        onClick={() => setProductsOpen(false)}
                        className="block rounded-xl px-3 py-3 transition hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-violet-400"
                      >
                        <span className="block text-sm font-semibold text-white">
                          {product.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-white/50">
                          {product.description}
                        </span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a
            href="#how"
            className="text-sm font-medium text-white/75 transition hover:text-white"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-white/75 transition hover:text-white"
          >
            Pricing
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-white/75 transition hover:text-white"
          >
            About
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#download"
            onClick={closeMobileMenu}
            className="rounded-full bg-gradient-to-b from-[#8B5CF6] to-[#6D3FD9] px-3 py-2.5 text-[11px] font-bold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 sm:px-5 sm:text-sm"
          >
            Get the app
          </a>
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-violet-400 md:hidden"
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile navigation panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-[calc(100%+0.5rem)] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#0B0716]/[0.98] p-3 shadow-2xl shadow-black/50 backdrop-blur-xl md:hidden"
            >
              <button
                type="button"
                aria-expanded={productsOpen}
                onClick={() => setProductsOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-white hover:bg-white/[0.06]"
              >
                Products
                <motion.svg
                  animate={{ rotate: productsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </button>
              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-l border-white/10 ml-3 pl-2"
                  >
                    {products.map((product) => (
                      <a
                        key={product.label}
                        href={product.href}
                        onClick={closeMobileMenu}
                        className="block rounded-lg px-3 py-2.5 hover:bg-white/[0.06]"
                      >
                        <span className="block text-sm font-medium text-white">
                          {product.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-white/50">
                          {product.description}
                        </span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <a
                href="#how"
                onClick={closeMobileMenu}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-white/80 hover:bg-white/[0.06]"
              >
                How it works
              </a>
              <a
                href="#pricing"
                onClick={closeMobileMenu}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-white/80 hover:bg-white/[0.06]"
              >
                Pricing
              </a>
              <a
                href="#about"
                onClick={closeMobileMenu}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-white/80 hover:bg-white/[0.06]"
              >
                About
              </a>
              <a
                href="#download"
                onClick={closeMobileMenu}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#8B5CF6] to-[#6D3FD9] px-4 py-3 text-sm font-bold text-white"
              >
                Get the app
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/* Hero                                                                */

/* ------------------------------------------------------------------ */

function Hero() {
  const reduce = useReducedMotion();

  const { scrollY } = useScroll();

  const orbY = useTransform(scrollY, [0, 600], [0, -80]);

  return (
    <section className="p-2 sm:p-3">
      <div className="relative isolate overflow-hidden rounded-[24px] border border-white/10 bg-[#0B0716] sm:rounded-[32px]">
        <motion.div
          aria-hidden

          style={{ y: orbY }}

          className="absolute inset-0 -z-10"
        >
          <div
            className="absolute inset-0"

            style={{
              background:
                "radial-gradient(90% 75% at 100% 100%, #a78bfa 0%, #7c3aed 20%, #3b1a8a 45%, transparent 75%)",
            }}
          />

          <motion.div
            animate={reduce ? undefined : { x: [0, 50, 0], y: [0, -30, 0] }}

            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}

            className="absolute -left-28 -top-28 h-[520px] w-[520px] rounded-full bg-[#6D3FD9]/45 blur-[130px]"
          />

          <motion.div
            animate={reduce ? undefined : { x: [0, -40, 0], y: [0, 40, 0] }}

            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}

            className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-[#4C1D95]/50 blur-[120px]"
          />
        </motion.div>

        <div className="mx-auto grid w-full max-w-6xl min-w-0 items-center gap-8 px-3 pb-10 pt-28 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-36 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16 lg:px-10 lg:pt-40">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}

              className="inline-flex items-center gap-2.5 text-sm text-white/75"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Built in the UK · App coming soon
            </motion.p>

            <h1 className="mt-5 break-words font-display text-3xl font-semibold leading-[1.08] tracking-tight min-[380px]:text-4xl sm:text-5xl lg:text-6xl">
              {["Send money home.", "Nothing hidden."].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-2">
                  <motion.span
                    className={`block ${i === 1 ? "text-gradient" : ""}`}

                    initial={{ y: "115%", rotate: 2 }}

                    animate={{ y: 0, rotate: 0 }}

                    transition={{
                      duration: 0.9,

                      delay: 0.2 + i * 0.14,

                      ease: EASE,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}

              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}

              transition={{ duration: 0.8, delay: 0.55, ease: EASE }}

              className="mt-5 max-w-md text-base leading-7 text-white/65 sm:text-lg sm:leading-8"
            >
              A UK money transfer app for the Caribbean. See the exchange rate,
              the fee and exactly what your family receives before you pay.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.7, delay: 0.7, ease: EASE }}

              className="mt-8"
            >
              <StoreButtons />
            </motion.div>

            <motion.ul
              initial="hidden"

              animate="show"

              variants={{
                show: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.9 },
                },
              }}

              className="mt-7 space-y-2.5 text-sm text-white/70"
            >
              {[
                "Rate and fee shown before you pay",

                "Track every transfer to the end",

                "UK-based support from real people",
              ].map((t) => (
                <motion.li
                  key={t}

                  variants={{
                    hidden: { opacity: 0, x: -12 },

                    show: { opacity: 1, x: 0 },
                  }}

                  className="flex items-center gap-3"
                >
                  <Tick /> {t}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}

            animate={{ opacity: 1, y: 0, scale: 1 }}

            transition={{ duration: 1, delay: 0.4, ease: EASE }}

            className="flex justify-center lg:justify-end"
          >
            <Calculator />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/* Countries marquee (flags + currency moving)                         */

/* ------------------------------------------------------------------ */

function Countries() {
  const reduce = useReducedMotion();

  const row = [...DESTINATIONS, ...DESTINATIONS];

  return (
    <section id="countries" aria-label="Where we are sending" className="py-12">
      <p className="mb-6 text-center text-sm text-white/45">
        Starting with Jamaica, then the Eastern Caribbean. Indicative rates,
        example only.
      </p>

      <div className="mask-fade-x overflow-hidden">
        <motion.ul
          className="flex w-max gap-3 pr-3"

          animate={reduce ? undefined : { x: ["0%", "-50%"] }}

          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          {row.map((d, i) => (
            <li
              key={d.code + i}

              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3"
            >
              <span className="text-2xl leading-none" aria-hidden>
                {d.flag}
              </span>

              <span className="text-sm font-semibold">{d.country}</span>

              <span className="text-sm text-white/45">GBP → {d.currency}</span>

              <span className="font-display text-sm font-semibold text-violet-300">
                {d.rate.toFixed(2)}
              </span>

              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${d.live ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/55"}`}
              >
                {d.live ? "Launching first" : "Planned"}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/* Statement + audience cards                                          */

/* ------------------------------------------------------------------ */

function Intro() {
  return (
    <section
      id="about"
      className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-28"
    >
      <Reveal blur>
        <h2 className="font-display text-3xl font-semibold leading-[1.2] tracking-tight sm:text-4xl lg:text-5xl">
          We are not just moving money. We are{" "}
          <span className="text-gradient">shortening the distance</span> between
          you and the people you support.
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
          With {BRAND}, you see the exchange rate, the fee and exactly what
          lands before you pay. Then you follow the transfer all the way to the
          end. Built in the UK, for people supporting family across the
          Caribbean.
        </p>
      </Reveal>
    </section>
  );
}

function Segments() {
  const cards = [
    [
      "For regular support",

      "Save the people you send to and repeat a transfer in a few taps, with the same clear fee every time.",

      "from-[#8B5CF6]/70 to-[#5B21B6]/40",
    ],

    [
      "For urgent moments",

      "Choose a mobile wallet or cash pickup when money needs to arrive within minutes.",

      "from-[#6D3FD9]/60 to-[#3B1A8A]/40",
    ],

    [
      "For supporting more than one person",

      "Keep every recipient and every transfer organised in one place.",

      "from-[#4C1D95]/60 to-[#1E0B4A]/40",
    ],
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
      <SectionHead
        label={`The ${BRAND} app`}

        title="Built for the way you send money home"

        sub="However often you send, and to whoever you send."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {cards.map(([t, d, g], i) => (
          <Reveal key={t} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -6 }}

              transition={{ type: "spring", stiffness: 300, damping: 22 }}

              className={`flex min-h-56 flex-col justify-end rounded-[24px] border border-white/10 bg-gradient-to-br ${g} p-5 sm:h-64 sm:p-7`}
            >
              <h3 className="font-display text-xl font-semibold">{t}</h3>

              <p className="mt-2 text-white/70">{d}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/* UI mockups (all example data)                                       */

/* ------------------------------------------------------------------ */

const panel =
  "mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-[#0E0A1C] p-4 text-sm shadow-xl shadow-black/40";

function QuoteMock() {
  return (
    <div className={panel}>
      <p className="text-xs text-white/45">Pricing breakdown · example</p>

      <dl className="mt-4 space-y-2.5">
        <div className="flex justify-between">
          <dt className="text-white/55">You send</dt>

          <dd className="font-semibold">£200.00</dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-white/55">Transfer fee</dt>

          <dd className="font-semibold">£{METHODS.bank.fee.toFixed(2)}</dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-white/55">Exchange rate</dt>

          <dd className="font-semibold">1 GBP = 205.40 JMD</dd>
        </div>

        <div className="flex justify-between border-t border-white/10 pt-3">
          <dt className="text-white/55">They receive</dt>

          <dd className="font-display text-lg font-semibold text-violet-300">
            J$
            <AnimatedNumber value={41080} />
          </dd>
        </div>
      </dl>
    </div>
  );
}

function TrackerMock() {
  const steps = [
    "Payment received",

    "Security checks passed",

    "Sent to Jamaica",

    "Delivered",
  ];

  return (
    <div className={panel}>
      <p className="text-xs text-white/45">Transfer to Mum · example</p>

      <ol className="mt-4 space-y-3.5">
        {steps.map((s, i) => (
          <motion.li
            key={s}

            initial={{ opacity: 0.3 }}

            whileInView={{ opacity: 1 }}

            viewport={{ once: true }}

            transition={{ delay: 0.5 + i * 0.55, duration: 0.4 }}

            className="flex items-center gap-3"
          >
            <motion.span
              initial={{ scale: 0.6, backgroundColor: "rgba(255,255,255,0.1)" }}

              whileInView={{
                scale: 1,

                backgroundColor: i === 3 ? "#34d399" : "#8b5cf6",
              }}

              viewport={{ once: true }}

              transition={{
                delay: 0.5 + i * 0.55,

                type: "spring",

                stiffness: 300,

                damping: 18,
              }}

              className="grid h-5 w-5 place-items-center rounded-full text-white"
            >
              <svg
                width="10"

                height="10"

                viewBox="0 0 14 14"

                fill="none"

                aria-hidden
              >
                <path
                  d="M2.8 7.3 5.7 10l5.5-6"

                  stroke="currentColor"

                  strokeWidth="2.2"

                  strokeLinecap="round"

                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>

            <span className="font-medium">{s}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function RecipientsMock() {
  const rows = [
    ["M", "Mum", "Kingston · Bank deposit"],

    ["B", "Brother", "Montego Bay · Mobile wallet"],

    ["A", "Aunt", "Spanish Town · Cash pickup"],
  ];

  return (
    <div className={`${panel} space-y-2`}>
      {rows.map(([i, n, d], idx) => (
        <motion.div
          key={n}

          initial={{ opacity: 0, x: -16 }}

          whileInView={{ opacity: 1, x: 0 }}

          viewport={{ once: true }}

          transition={{ delay: idx * 0.12, duration: 0.5, ease: EASE }}

          className="flex items-center gap-3 rounded-xl bg-white/[0.05] p-3"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-500/30 font-display text-sm font-semibold text-violet-200">
            {i}
          </span>

          <div className="flex-1">
            <p className="font-semibold leading-tight">{n}</p>

            <p className="text-xs text-white/45">{d}</p>
          </div>

          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            Send
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function MethodsMock() {
  return (
    <div className={`${panel} space-y-2`}>
      {Object.values(METHODS).map((m, i) => (
        <motion.div
          key={m.label}

          whileHover={{ x: 4 }}

          className={`flex items-center justify-between rounded-xl p-3 ${i === 0 ? "bg-violet-500/20 ring-1 ring-violet-400/40" : "bg-white/[0.05]"}`}
        >
          <div>
            <p className="font-semibold leading-tight">{m.label}</p>

            <p className="text-xs text-white/45">{m.eta}</p>
          </div>

          <span className="font-display font-semibold">
            £{m.fee.toFixed(2)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function AlertMock() {
  const [on, setOn] = useState(true);

  return (
    <div className={panel}>
      <p className="text-xs text-white/45">Rate alert · planned</p>

      <p className="mt-3 text-base font-semibold leading-snug">
        Tell me when £1 reaches J$210
      </p>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.05] p-3">
        <span className="text-white/60">Notify me</span>

        <button
          type="button"

          role="switch"

          aria-checked={on}

          aria-label="Rate alert"

          onClick={() => setOn((v) => !v)}

          className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${on ? "justify-end bg-violet-500" : "justify-start bg-white/15"}`}
        >
          <motion.span
            layout

            transition={{ type: "spring", stiffness: 500, damping: 32 }}

            className="h-5 w-5 rounded-full bg-white"
          />
        </button>
      </div>
    </div>
  );
}

function Features() {
  const items: [string, string, React.ReactNode, string][] = [
    [
      "Pricing breakdown",

      "Every number laid out before you confirm: amount, fee, rate and what they receive.",

      <QuoteMock key="q" />,

      "md:col-span-3",
    ],

    [
      "Live transfer tracking",

      "Follow each stage, from payment received to delivered, without chasing anyone.",

      <TrackerMock key="t" />,

      "md:col-span-3",
    ],

    [
      "Saved recipients",

      "Save the people you send to once. Sending again takes seconds.",

      <RecipientsMock key="r" />,

      "md:col-span-2",
    ],

    [
      "Delivery options",

      "Choose bank deposit, mobile wallet or cash pickup, each with its own fee and timing.",

      <MethodsMock key="m" />,

      "md:col-span-2",
    ],

    [
      "Rate alerts",

      "Get a nudge when the exchange rate reaches the level you are waiting for.",

      <AlertMock key="a" />,

      "md:col-span-2",
    ],
  ];

  return (
    <section
      id="features"
      className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28"
    >
      <SectionHead
        label="Our features"

        title="Everything for sending money home"

        sub="Simple tools that keep every transfer clear."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-6">
        {items.map(([t, d, mock, span], i) => (
          <Reveal key={t} delay={(i % 3) * 0.08} className={span}>
            <Spotlight className="h-full p-6">
              <h3 className="font-display text-lg font-semibold">{t}</h3>

              <p className="mt-1.5 text-white/55">{d}</p>

              <div className="mt-6">{mock}</div>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/* How it works + phone                                                */

/* ------------------------------------------------------------------ */

function Phone() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -12, 0], rotate: [-2, -1, -2] }}

      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}

      className="mx-auto w-full max-w-[280px] rounded-[36px] border-[6px] border-[#1a1530] bg-[#0B0716] p-3 shadow-2xl shadow-violet-900/40 sm:rounded-[44px] sm:border-[7px] sm:p-4"

      aria-hidden
    >
      <div className="mx-auto mb-4 h-5 w-24 rounded-full bg-black" />

      <p className="text-xs text-white/45">Transfer to Mum</p>

      <p className="mt-1 font-display text-3xl font-semibold">J$41,080.00</p>

      <p className="text-xs text-white/45">£200.00 · Bank deposit · Kingston</p>

      <div className="mt-5 space-y-3 rounded-2xl bg-white/[0.05] p-4 text-sm">
        {["Payment received", "Checks passed", "Sent to Jamaica"].map((s) => (
          <div key={s} className="flex items-center gap-2.5">
            <Tick /> {s}
          </div>
        ))}

        <div className="flex items-center gap-2.5 text-white/50">
          <span className="relative flex h-5 w-5 items-center justify-center">
            <span className="absolute h-5 w-5 animate-ping rounded-full bg-emerald-400/40" />

            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          Delivering now
        </div>
      </div>

      <div className="mt-5 rounded-full bg-gradient-to-b from-[#8B5CF6] to-[#6D3FD9] py-3 text-center text-xs font-bold">
        View receipt
      </div>

      <p className="mt-3 text-center text-[10px] text-white/30">
        Example screen
      </p>
    </motion.div>
  );
}

function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,

    offset: ["start 70%", "end 60%"],
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section
      id="how"
      className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28"
    >
      <SectionHead
        label="How it works"

        title="From your phone to their hands"

        sub="Simple to start, even simpler to use."
      />

      <div className="mt-10 grid items-start gap-8 sm:mt-14 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <ol ref={ref} className="relative space-y-5 pl-12">
          <span
            aria-hidden

            className="absolute bottom-3 left-[18px] top-3 w-0.5 bg-white/10"
          />

          <motion.span
            aria-hidden

            style={{ scaleY, transformOrigin: "top" }}

            className="absolute bottom-3 left-[18px] top-3 w-0.5 bg-violet-400"
          />

          {STEPS.map(([t, d], i) => (
            <motion.li
              key={t}

              initial={{ opacity: 0, x: 28 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true, margin: "-60px" }}

              transition={{ duration: 0.6, ease: EASE }}

              className="relative rounded-[24px] border border-white/10 bg-white/[0.03] p-6"
            >
              <span className="absolute -left-12 top-6 grid h-9 w-9 place-items-center rounded-full bg-[#1a1236] font-display text-sm font-semibold text-violet-300 ring-4 ring-[#07050F]">
                {i + 1}
              </span>

              <h3 className="font-display text-xl font-semibold">{t}</h3>

              <p className="mt-2 text-white/60">{d}</p>
            </motion.li>
          ))}
        </ol>

        <div className="lg:sticky lg:top-28">
          <Reveal>
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-[#3b1a8a]/50 to-transparent px-4 py-12">
              <Phone />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/* Pricing                                                             */

/* ------------------------------------------------------------------ */

function Pricing() {
  const perks: Record<string, string[]> = {
    "Bank deposit": [
      "Straight to a bank account",

      "Saved for next time",

      "Best for regular support",
    ],

    "Mobile wallet": [
      "Lands on their phone",

      "Spend or cash out",

      "Fast for urgent needs",
    ],

    "Cash pickup": [
      "No bank account needed",

      "Collected with ID",

      "Pickup details sent to them",
    ],
  };

  return (
    <section
      id="pricing"
      className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28"
    >
      <SectionHead
        label="Pricing"

        title="Simple, transparent pricing"

        sub="A flat fee per transfer plus the exchange rate. Both are shown before you confirm."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {Object.values(METHODS).map((m, i) => (
          <Reveal key={m.label} delay={i * 0.1}>
            <Spotlight
              className={`h-full p-7 ${i === 0 ? "ring-1 ring-violet-400/40" : ""}`}
            >
              <h3 className="font-display text-lg font-semibold">{m.label}</h3>

              <p className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
                £{m.fee.toFixed(2)}
                <span className="ml-1 text-sm font-medium text-white/45 sm:text-base">
                  per transfer
                </span>
              </p>

              <p className="mt-1 text-sm text-white/55">{m.eta}</p>

              <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm text-white/75">
                {perks[m.label].map((p) => (
                  <li key={p} className="flex items-center gap-3">
                    <Tick /> {p}
                  </li>
                ))}
              </ul>
            </Spotlight>
          </Reveal>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-white/40">
        Example fees. Final pricing will be confirmed at launch.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/* Trust                                                               */

/* ------------------------------------------------------------------ */

function Trust() {
  const points = [
    [
      "Identity checks",

      "We verify who you are before your first transfer, to protect you and your family.",
    ],

    [
      "A regulated partner",

      "Money will be moved by an authorised payments partner. We will name them before launch.",
    ],

    [
      "Alerts on every transfer",

      "You are told at each stage, so nothing is a mystery.",
    ],

    [
      "Real human support",

      "Chat, email or WhatsApp. When a check delays a transfer, we explain why.",
    ],
  ];

  return (
    <section
      id="trust"
      className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28"
    >
      <SectionHead
        label="Safety"

        title="Built to be trusted with family money"

        sub="This is how we plan to protect you. We will not call ourselves licensed until we are."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {points.map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.07}>
            <Spotlight className="h-full p-7">
              <Tick />

              <h3 className="mt-5 font-display text-xl font-semibold">{t}</h3>

              <p className="mt-2 text-white/60">{d}</p>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/* FAQ, download, footer                                               */

/* ------------------------------------------------------------------ */

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6 sm:pb-28"
    >
      <SectionHead label="FAQ" title="Questions, answered" />

      <div className="mt-12 space-y-3">
        {FAQS.map(([q, a], i) => {
          const isOpen = open === i;

          return (
            <div
              key={q}

              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <button
                type="button"

                onClick={() => setOpen(isOpen ? null : i)}

                aria-expanded={isOpen}

                className="flex w-full items-center justify-between gap-3 px-4 py-5 text-left font-display text-sm font-semibold sm:gap-4 sm:px-6 sm:text-base focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-400"
              >
                {q}

                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}

                  className="text-2xl leading-none text-violet-300"

                  aria-hidden
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}

                    animate={{ height: "auto", opacity: 1 }}

                    exit={{ height: 0, opacity: 0 }}

                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <p className="px-4 pb-6 leading-7 text-white/60 sm:px-6">
                      {a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Download() {
  const reduce = useReducedMotion();

  return (
    <section id="download" className="px-3 pb-3">
      <Reveal>
        <div className="relative isolate mx-2 max-w-6xl overflow-hidden rounded-[24px] border border-white/10 bg-[#0B0716] px-4 py-16 text-center sm:mx-auto sm:rounded-[32px] sm:px-6 sm:py-24">
          <motion.div
            aria-hidden

            animate={
              reduce
                ? undefined
                : { scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }
            }

            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}

            className="absolute left-1/2 top-full -z-10 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7c3aed]/60 blur-[120px]"
          />

          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Send money home with confidence.
          </h2>

          <p className="mx-auto mt-4 max-w-md text-white/60">
            The {BRAND} app is coming soon to iOS and Android.
          </p>

          <div className="mt-8">
            <StoreButtons center />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
        <div>
          <Logo />

          <p className="mt-3 text-sm text-white/45">
            UK to Jamaica and the Eastern Caribbean.
          </p>
        </div>

        <nav
          aria-label="Legal"

          className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-white/60"
        >
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>

          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
        </nav>
      </div>

      <p className="mt-10 max-w-4xl text-xs leading-5 text-white/35">
        {BRAND} is a UK-based start-up and is not a bank. The app is not yet
        available and does not currently accept customer funds. Rates, fees and
        amounts shown on this website are examples only. Regulated payment
        services will be provided by an authorised partner once the app
        launches.
      </p>
    </footer>
  );
}

/* ------------------------------------------------------------------ */

/* Page                                                                */

/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-clip">
      <Navbar />

      <Hero />

      <Countries />

      <Intro />

      <Segments />

      <Features />

      <HowItWorks />

      <Pricing />

      <Trust />

      <Faq />

      <Download />

      <Footer />
    </main>
  );
}
