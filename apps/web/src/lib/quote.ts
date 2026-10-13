/**
 * Dummy quote service.
 * Everything the calculator shows comes through getQuote(), so when the backend
 * exists you only replace the body of that one function with a fetch call, e.g.
 *   const res = await fetch('/api/quote', { method: 'POST', body: JSON.stringify(req) });
 *   return res.json();
 * The numbers below are examples, not live rates.
 */

export type MethodKey = "bank" | "wallet" | "cash";
export type Currency = "JMD" | "XCD";
export type Side = "send" | "receive";

export interface Destination {
  code: string;
  country: string;
  flag: string;
  currency: Currency;
  /** Units of destination currency per 1 GBP (example only). */
  rate: number;
  /** Part of the first pilot corridor. */
  live: boolean;
}

export const DESTINATIONS: Destination[] = [
  {
    code: "JM",
    country: "Jamaica",
    flag: "🇯🇲",
    currency: "JMD",
    rate: 205.4,
    live: true,
  },
  {
    code: "AG",
    country: "Antigua and Barbuda",
    flag: "🇦🇬",
    currency: "XCD",
    rate: 3.58,
    live: false,
  },
  {
    code: "DM",
    country: "Dominica",
    flag: "🇩🇲",
    currency: "XCD",
    rate: 3.58,
    live: false,
  },
  {
    code: "GD",
    country: "Grenada",
    flag: "🇬🇩",
    currency: "XCD",
    rate: 3.58,
    live: false,
  },
  {
    code: "KN",
    country: "St Kitts and Nevis",
    flag: "🇰🇳",
    currency: "XCD",
    rate: 3.58,
    live: false,
  },
  {
    code: "LC",
    country: "St Lucia",
    flag: "🇱🇨",
    currency: "XCD",
    rate: 3.58,
    live: false,
  },
  {
    code: "VC",
    country: "St Vincent and the Grenadines",
    flag: "🇻🇨",
    currency: "XCD",
    rate: 3.58,
    live: false,
  },
];

export const METHODS: Record<
  MethodKey,
  { label: string; fee: number; eta: string; blurb: string }
> = {
  bank: {
    label: "Bank deposit",
    fee: 1.99,
    eta: "Same day",
    blurb: "Straight into their bank account",
  },
  wallet: {
    label: "Mobile wallet",
    fee: 2.49,
    eta: "Within minutes",
    blurb: "Onto their phone wallet",
  },
  cash: {
    label: "Cash pickup",
    fee: 3.49,
    eta: "Within minutes",
    blurb: "Collected in person with ID",
  },
};

export const LIMITS = { min: 10, max: 5000 };

export interface QuoteRequest {
  destination: string;
  method: MethodKey;
  /** Which field the customer typed into. */
  side: Side;
  amount: number;
}

export interface Quote {
  destination: Destination;
  method: MethodKey;
  sendAmount: number;
  receiveAmount: number;
  fee: number;
  total: number;
  rate: number;
  eta: string;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export async function getQuote(req: QuoteRequest): Promise<Quote> {
  // Simulated network latency so loading states are real.
  await new Promise((r) => setTimeout(r, 280 + Math.random() * 220));

  const destination =
    DESTINATIONS.find((d) => d.code === req.destination) ?? DESTINATIONS[0];
  const m = METHODS[req.method];

  const sendAmount =
    req.side === "send"
      ? round2(req.amount)
      : Math.ceil((req.amount / destination.rate) * 100) / 100;
  const receiveAmount =
    req.side === "send"
      ? round2(sendAmount * destination.rate)
      : round2(req.amount);

  return {
    destination,
    method: req.method,
    sendAmount,
    receiveAmount,
    fee: m.fee,
    total: round2(sendAmount + m.fee),
    rate: destination.rate,
    eta: m.eta,
  };
}

/* ---------- formatting helpers ---------- */

export const formatMoney = (n: number, dp = 2) =>
  n.toLocaleString("en-GB", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });

/** "1234567.5" -> "1,234,567.5" (keeps what the user is typing intact). */
export function groupDigits(raw: string) {
  const [int, dec] = raw.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec === undefined ? grouped : `${grouped}.${dec}`;
}

/** Strip everything but digits and one decimal point, cap decimals, trim leading zeros. */
export function cleanAmount(v: string, dp = 2) {
  const s = v.replace(/[^\d.]/g, "");
  const [int, ...rest] = s.split(".");
  const out = rest.length ? `${int}.${rest.join("").slice(0, dp)}` : int;
  return out.replace(/^0+(?=\d)/, "");
}
