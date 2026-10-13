"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DESTINATIONS,
  LIMITS,
  METHODS,
  cleanAmount,
  formatMoney,
  getQuote,
  groupDigits,
  type Destination,
  type MethodKey,
  type Quote,
  type Side,
} from "../lib/quote";
import { AnimatedNumber } from "./motion";

/* ---------------- Destination dropdown ---------------- */

function DestinationSelect({
  value,
  onChange,
}: {
  value: Destination;
  onChange: (d: Destination) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Sending to ${value.country}. Change destination`}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-2.5 pr-2.5 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-violet-400"
      >
        <span className="text-lg leading-none" aria-hidden>
          {value.flag}
        </span>
        {value.currency}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
        >
          <path
            d="m3.5 5.5 3.5 3.5 3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Destination country"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-30 mt-2 max-h-72 w-72 overflow-auto rounded-2xl border border-white/10 bg-[#140E2B] p-1.5 shadow-2xl shadow-black/50"
          >
            {DESTINATIONS.map((d) => (
              <li
                key={d.code}
                role="option"
                aria-selected={d.code === value.code}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange(d);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-white/10 ${d.code === value.code ? "bg-white/10" : ""}`}
                >
                  <span className="text-xl" aria-hidden>
                    {d.flag}
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-white">
                      {d.country}
                    </span>
                    <span className="block text-xs text-white/50">
                      {d.currency}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${d.live ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/60"}`}
                  >
                    {d.live ? "Launching first" : "Planned"}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Calculator ---------------- */

export default function Calculator() {
  const [dest, setDest] = useState<Destination>(DESTINATIONS[0]);
  const [method, setMethod] = useState<MethodKey>("bank");
  const [anchor, setAnchor] = useState<{ side: Side; raw: string }>({
    side: "send",
    raw: "200",
  });
  const [attempt, setAttempt] = useState(0);
  // The last quote we received, tagged with the request it answers.
  const [result, setResult] = useState<{ key: string; quote: Quote } | null>(
    null,
  );
  const [failedKey, setFailedKey] = useState<string | null>(null);

  const amount = parseFloat(anchor.raw);
  // Identifies the quote we currently need. null means there is nothing to quote.
  const requestKey =
    amount > 0
      ? `${dest.code}|${method}|${anchor.side}|${anchor.raw}|${attempt}`
      : null;

  // Everything below is derived during render, so the effect never has to set state synchronously.
  const quote = requestKey && result ? result.quote : null;
  const failed = requestKey !== null && failedKey === requestKey;
  const loading = requestKey !== null && result?.key !== requestKey && !failed;

  // Fetch a fresh quote whenever the request changes. State is only set inside the async callback.
  useEffect(() => {
    if (!requestKey) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const q = await getQuote({
          destination: dest.code,
          method,
          side: anchor.side,
          amount,
        });
        if (!cancelled) setResult({ key: requestKey, quote: q });
      } catch {
        if (!cancelled) setFailedKey(requestKey);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [requestKey, dest.code, method, anchor.side, amount]);

  const sendValue =
    anchor.side === "send"
      ? groupDigits(anchor.raw)
      : quote
        ? groupDigits(quote.sendAmount.toFixed(2))
        : "";
  const receiveValue =
    anchor.side === "receive"
      ? groupDigits(anchor.raw)
      : quote
        ? groupDigits(quote.receiveAmount.toFixed(2))
        : "";
  const sendNum =
    anchor.side === "send"
      ? parseFloat(anchor.raw) || 0
      : (quote?.sendAmount ?? 0);

  let error: string | null = null;
  if (sendNum > 0 && sendNum < LIMITS.min)
    error = `The minimum transfer is £${LIMITS.min}.`;
  else if (sendNum > LIMITS.max)
    error = `The maximum transfer is £${formatMoney(LIMITS.max, 0)}.`;
  else if (failed) error = "We could not get a quote. Please try again.";

  const ready = !!quote && !loading && !error && sendNum >= LIMITS.min;
  const dim = loading ? "opacity-50" : "opacity-100";

  const swapSides = (side: Side) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAnchor({ side, raw: cleanAmount(e.target.value) });

  return (
    <div className="w-full max-w-[460px] rounded-[28px] border border-white/10 bg-[#0E0A1C]/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Send money</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
          From the UK
        </span>
      </div>

      {/* You send */}
      <label className="mt-5 block rounded-2xl bg-white/[0.06] px-4 pb-3 pt-2.5 ring-1 ring-white/10 transition focus-within:ring-2 focus-within:ring-violet-400">
        <span className="text-xs font-medium text-white/55">You send</span>
        <span className="flex items-center justify-between gap-3">
          <input
            inputMode="decimal"
            autoComplete="off"
            value={sendValue}
            onChange={swapSides("send")}
            placeholder="0.00"
            aria-label="Amount you send in pounds"
            className={`w-full min-w-0 bg-transparent font-display text-3xl font-semibold text-white outline-none placeholder:text-white/25 transition-opacity ${anchor.side === "send" ? "opacity-100" : dim}`}
          />
          <span className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold">
            <span className="text-lg leading-none" aria-hidden>
              🇬🇧
            </span>{" "}
            GBP
          </span>
        </span>
      </label>

      {/* Rate chip between the fields */}
      <div className="relative z-10 -my-2.5 flex justify-center">
        <motion.div
          layout
          className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1A1236] px-3.5 py-1.5 text-xs font-medium text-violet-200"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${loading ? "animate-pulse" : ""}`}
          />
          <span className={`transition-opacity ${dim}`}>
            1 GBP = {formatMoney(dest.rate)} {dest.currency}
          </span>
        </motion.div>
      </div>

      {/* They receive */}
      <label className="block rounded-2xl bg-white/[0.06] px-4 pb-3 pt-2.5 ring-1 ring-white/10 transition focus-within:ring-2 focus-within:ring-violet-400">
        <span className="text-xs font-medium text-white/55">
          They receive in {dest.country}
        </span>
        <span className="flex items-center justify-between gap-3">
          <input
            inputMode="decimal"
            autoComplete="off"
            value={receiveValue}
            onChange={swapSides("receive")}
            placeholder="0.00"
            aria-label={`Amount received in ${dest.currency}`}
            className={`w-full min-w-0 bg-transparent font-display text-3xl font-semibold text-violet-200 outline-none placeholder:text-white/25 transition-opacity ${anchor.side === "receive" ? "opacity-100" : dim}`}
          />
          <DestinationSelect value={dest} onChange={setDest} />
        </span>
      </label>

      {/* Delivery method */}
      <p className="mb-2 mt-5 text-xs font-medium text-white/55">
        How they get it
      </p>
      <div
        className="grid grid-cols-3 gap-1.5 rounded-2xl bg-white/[0.06] p-1"
        role="radiogroup"
        aria-label="Delivery method"
      >
        {(Object.keys(METHODS) as MethodKey[]).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={method === k}
            onClick={() => setMethod(k)}
            className="relative rounded-xl px-2 py-2.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-violet-400"
          >
            {method === k && (
              <motion.span
                layoutId="method-pill"
                className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#8B5CF6] to-[#6D3FD9]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span
              className={`relative ${method === k ? "text-white" : "text-white/60"}`}
            >
              {METHODS[k].label}
            </span>
          </button>
        ))}
      </div>

      {/* Breakdown */}
      <dl className={`mt-5 space-y-2.5 text-sm transition-opacity ${dim}`}>
        <div className="flex justify-between">
          <dt className="text-white/55">Transfer fee</dt>
          <dd className="font-semibold">
            £{quote ? <AnimatedNumber value={quote.fee} /> : "0.00"}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-white/55">Arrives</dt>
          <dd className="font-semibold">{quote?.eta ?? METHODS[method].eta}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
          <dt className="font-semibold">Total you pay</dt>
          <dd className="font-display text-xl font-semibold">
            £{quote ? <AnimatedNumber value={quote.total} /> : "0.00"}
          </dd>
        </div>
      </dl>

      {/* Messages */}
      <AnimatePresence initial={false} mode="popLayout">
        {error && (
          <motion.p
            key="err"
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-300"
          >
            <span>{error}</span>
            {failed && (
              <button
                type="button"
                onClick={() => setAttempt((n) => n + 1)}
                className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/15"
              >
                Try again
              </button>
            )}
          </motion.p>
        )}
        {!error && !dest.live && (
          <motion.p
            key="soon"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-xl bg-amber-400/10 px-3.5 py-2.5 text-sm text-amber-200"
          >
            {dest.country} is planned after the Jamaica launch. We will add it
            as soon as our payout partners are in place.
          </motion.p>
        )}
      </AnimatePresence>

      {ready ? (
        <a
          href="#download"
          className="mt-5 block rounded-full bg-gradient-to-b from-[#8B5CF6] to-[#6D3FD9] py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-violet-900/40 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Get the app
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="mt-5 block w-full cursor-not-allowed rounded-full bg-white/10 py-3.5 text-center text-sm font-bold text-white/40"
        >
          {loading ? "Getting your quote…" : "Enter an amount"}
        </button>
      )}
      <p className="mt-3 text-center text-[11px] leading-4 text-white/40">
        Example rates and fees. Not a live quote. The app is coming soon.
      </p>
    </div>
  );
}
