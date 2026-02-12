import { useState, useEffect } from "react";

const YEAR1_TIERS = [
  { months: 6, label: "6 months", discount: 0 },
  { months: 9, label: "9 months", discount: 1000 },
  { months: 11, label: "11 months", discount: 2000 },
];

const RENEWAL_TIERS = [
  { months: 0, label: "No lock-in", hikeDiscount: 0 },
  { months: 6, label: "6 months", hikeDiscount: 0.3 },
  { months: 9, label: "9 months", hikeDiscount: 0.5 },
  { months: 11, label: "11 months", hikeDiscount: 0.7 },
];

const ESCALATION = 0.07;

function fmt(n) {
  return "\u20b9" + Math.round(n).toLocaleString("en-IN");
}

function YearOneTier({ tier, selected, onClick, mrp }) {
  const rent = mrp - tier.discount;
  const yearlySavings = tier.discount * 11;
  const isBest = tier.months === 11;

  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
        selected
          ? "border-stone-900 bg-stone-50 shadow-lg ring-1 ring-stone-900/5"
          : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
      }`}
    >
      {isBest && (
        <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide shadow-sm">
          BEST VALUE
        </span>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selected ? "border-stone-900 bg-stone-900" : "border-stone-300"
              }`}
            >
              {selected && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <p className={`font-semibold text-base ${selected ? "text-stone-900" : "text-stone-600"}`}>
              {tier.label} lock-in
            </p>
          </div>
          {tier.discount > 0 ? (
            <p className="text-stone-400 text-sm ml-7">{fmt(tier.discount)} off MRP/month</p>
          ) : (
            <p className="text-stone-400 text-sm ml-7">Base price</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`font-bold text-xl ${selected ? "text-stone-900" : "text-stone-600"}`}>
            {fmt(rent)}
          </p>
          <p className="text-stone-400 text-xs">/month</p>
        </div>
      </div>
      {yearlySavings > 0 && (
        <div className={`mt-3 ml-7 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
          selected ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
        }`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          You save {fmt(yearlySavings)} over 11 months
        </div>
      )}
    </button>
  );
}

function RenewalTier({ tier, selected, onClick, baseRent, hikeAmount, noLockInRent }) {
  const discount = Math.round(hikeAmount * tier.hikeDiscount);
  const rent = Math.round(baseRent + hikeAmount - discount);
  const yearlySavings = (noLockInRent - rent) * 11;
  const isBest = tier.months === 11;
  const isNoLockin = tier.months === 0;

  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left transition-all duration-200 ${
        isNoLockin
          ? `p-4 rounded-xl border-2 ${selected ? "border-red-300 bg-red-50/50" : "border-stone-200 bg-stone-50/50 hover:border-stone-300"}`
          : `p-5 rounded-2xl border-2 ${
              selected
                ? "border-stone-900 bg-stone-50 shadow-lg ring-1 ring-stone-900/5"
                : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
            }`
      }`}
    >
      {isBest && (
        <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide shadow-sm">
          RECOMMENDED
        </span>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selected
                  ? isNoLockin ? "border-red-400 bg-red-400" : "border-stone-900 bg-stone-900"
                  : "border-stone-300"
              }`}
            >
              {selected && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <p className={`font-semibold text-base ${
              isNoLockin
                ? selected ? "text-red-700" : "text-stone-400"
                : selected ? "text-stone-900" : "text-stone-600"
            }`}>
              {isNoLockin ? "No lock-in" : `${tier.label} lock-in`}
            </p>
          </div>
          {isNoLockin ? (
            <p className="text-red-400 text-sm ml-7">Full 7% hike applies</p>
          ) : (
            <p className="text-stone-400 text-sm ml-7">{Math.round(tier.hikeDiscount * 100)}% off the rent hike</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`font-bold text-xl ${
            isNoLockin
              ? selected ? "text-red-600" : "text-stone-400"
              : selected ? "text-stone-900" : "text-stone-600"
          }`}>
            {fmt(rent)}
          </p>
          <p className="text-stone-400 text-xs">/month</p>
        </div>
      </div>
      {yearlySavings > 0 && !isNoLockin && (
        <div className={`mt-3 ml-7 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
          selected ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
        }`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          You save {fmt(yearlySavings)} over 11 months vs no lock-in
        </div>
      )}
      {isNoLockin && (
        <div className={`mt-3 ml-7 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
          selected ? "bg-red-100 text-red-600" : "bg-stone-100 text-stone-400"
        }`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          You&apos;d pay {fmt(hikeAmount * 11)} extra per year
        </div>
      )}
    </button>
  );
}

export default function App() {
const getInitialMrp = () => {
  const params = new URLSearchParams(window.location.search);
  const value = Number(params.get("mrp"));
  if (!isNaN(value) && value >= 15000 && value <= 80000) {
    return value;
  }
  return 35000;
};

const [mrp, setMrp] = useState(getInitialMrp);
  const [y1TierIdx, setY1TierIdx] = useState(2);
  const [renewalTierIdx, setRenewalTierIdx] = useState(3);
  const [showRenewal, setShowRenewal] = useState(false);
      useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("mrp", mrp);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [mrp]);

  const y1Tier = YEAR1_TIERS[y1TierIdx];
  const y1Rent = mrp - y1Tier.discount;
  const y1YearlySavings = y1Tier.discount * 11;

  const hikeAmount = Math.round(mrp * ESCALATION);
  const noLockInRenewalRent = mrp + hikeAmount;
  const renewalTier = RENEWAL_TIERS[renewalTierIdx];
  const renewalDiscount = Math.round(hikeAmount * renewalTier.hikeDiscount);
  const renewalRent = mrp + hikeAmount - renewalDiscount;
  const renewalYearlySavings = (noLockInRenewalRent - renewalRent) * 11;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fafaf9 0%, #f5f5f4 40%, #e7e5e4 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-stone-400 text-xs tracking-[0.25em] uppercase font-medium mb-3">Flent</p>
          <h1
            style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-4xl text-stone-900 mb-3 leading-tight"
          >
            Rent Calculator
          </h1>
          <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
            Pick your lock-in, see your savings — now and at renewal.
          </p>
        </div>

        {/* MRP Input */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-5">
          <label className="block text-xs font-semibold text-stone-400 mb-3 tracking-[0.15em] uppercase">
            Your Room's MRP
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xl font-medium">{"\u20b9"}</span>
            <input
              type="number"
              value={mrp}
              onChange={(e) => setMrp(Math.max(0, Number(e.target.value)))}
              className="w-full pl-11 pr-4 py-4 text-2xl font-bold text-stone-900 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all"
              placeholder="35000"
              min="0"
              step="1000"
            />
          </div>
          <input
            type="range"
            min={15000}
            max={80000}
            step={1000}
            value={mrp}
            onChange={(e) => setMrp(Number(e.target.value))}
            className="w-full mt-4 accent-stone-800 h-2"
          />
          <div className="flex justify-between text-xs text-stone-400 mt-1 font-medium">
            <span>{"\u20b9"}15,000</span>
            <span>{"\u20b9"}80,000</span>
          </div>
        </div>

        {/* Year 1 */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xs font-semibold text-stone-400 tracking-[0.15em] uppercase">
                Choose Your Lock-in
              </h2>
              <p className="text-stone-300 text-xs mt-0.5">All plans are for an 11-month agreement</p>
            </div>
            <span className="text-xs font-bold text-stone-300 bg-stone-100 px-3 py-1 rounded-full tracking-wide uppercase">
              Year 1
            </span>
          </div>

          <div className="space-y-3">
            {YEAR1_TIERS.map((tier, idx) => (
              <YearOneTier
                key={idx}
                tier={tier}
                selected={y1TierIdx === idx}
                onClick={() => setY1TierIdx(idx)}
                mrp={mrp}
              />
            ))}
          </div>

          {/* Year 1 Summary */}
          <div className="mt-5 rounded-xl overflow-hidden border border-stone-200">
            <div className="bg-stone-900 p-4">
              <div className="flex justify-between items-baseline">
                <span className="text-stone-300 text-sm">Your monthly rent</span>
                <span className="text-white font-bold text-2xl">{fmt(y1Rent)}</span>
              </div>
            </div>
            <div className="bg-stone-800 px-4 py-3">
              <div className="flex justify-between items-baseline">
                <span className="text-stone-400 text-sm">MRP</span>
                <span className="text-stone-400 text-sm line-through">{fmt(mrp)}</span>
              </div>
            </div>
            {y1YearlySavings > 0 && (
              <div className="bg-emerald-600 px-4 py-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-emerald-100 text-sm font-medium">Your total Year 1 savings</span>
                  <span className="text-white font-bold text-lg">{fmt(y1YearlySavings)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Renewal Toggle */}
        <button
          onClick={() => setShowRenewal(!showRenewal)}
          className="w-full flex items-center justify-between p-5 mb-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              showRenewal ? "bg-stone-900" : "bg-stone-100 group-hover:bg-stone-200"
            }`}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={showRenewal ? "white" : "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-stone-500 transition-transform duration-200 ${showRenewal ? "rotate-90" : ""}`}
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-stone-800 font-semibold text-sm">What happens at renewal?</p>
              <p className="text-stone-400 text-xs">See Year 2 pricing with 7% escalation</p>
            </div>
          </div>
        </button>

        {/* Renewal Section */}
        {showRenewal && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-stone-400 tracking-[0.15em] uppercase">
                Renewal Lock-in
              </h2>
              <span className="text-xs font-bold text-stone-300 bg-stone-100 px-3 py-1 rounded-full tracking-wide uppercase">
                Year 2
              </span>
            </div>

            {/* The pitch */}
            <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-amber-900 text-sm font-semibold mb-1">Here's the deal at renewal</p>
              <p className="text-amber-700 text-sm leading-relaxed">
                Your MRP goes up 7% — from {fmt(mrp)} to <strong>{fmt(mrp + hikeAmount)}</strong> (a {fmt(hikeAmount)}/mo hike). Without a lock-in, you pay the full hike. Pick a lock-in and we'll cut the hike down for you.
              </p>
            </div>

            {/* No lock-in first — the bad option */}
            <div className="mb-3">
              <RenewalTier
                tier={RENEWAL_TIERS[0]}
                selected={renewalTierIdx === 0}
                onClick={() => setRenewalTierIdx(0)}
                baseRent={mrp}
                hikeAmount={hikeAmount}
                noLockInRent={noLockInRenewalRent}
              />
            </div>

            {/* Divider with CTA */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-stone-200"></div>
              <span className="text-xs font-bold text-emerald-600 tracking-wide uppercase whitespace-nowrap">
                Lock in & save
              </span>
              <div className="flex-1 h-px bg-stone-200"></div>
            </div>

            {/* Lock-in options */}
            <div className="space-y-3">
              {RENEWAL_TIERS.slice(1).map((tier, idx) => (
                <RenewalTier
                  key={idx}
                  tier={tier}
                  selected={renewalTierIdx === idx + 1}
                  onClick={() => setRenewalTierIdx(idx + 1)}
                  baseRent={mrp}
                  hikeAmount={hikeAmount}
                  noLockInRent={noLockInRenewalRent}
                />
              ))}
            </div>

            {/* Renewal Summary */}
            <div className="mt-5 rounded-xl overflow-hidden border border-stone-200">
              <div className="bg-stone-900 p-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-300 text-sm">Year 2 monthly rent</span>
                  <span className="text-white font-bold text-2xl">{fmt(renewalRent)}</span>
                </div>
              </div>
              <div className="bg-stone-800 px-4 py-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-400 text-sm">Without lock-in</span>
                  <span className="text-stone-400 text-sm line-through">{fmt(noLockInRenewalRent)}</span>
                </div>
              </div>
              {renewalTier.months > 0 && (
                <>
                  <div className="bg-stone-700 px-4 py-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-stone-300 text-sm">Hike absorbed by Flent</span>
                      <span className="text-stone-200 font-semibold">
                        {fmt(renewalDiscount)}/mo ({Math.round(renewalTier.hikeDiscount * 100)}% of hike)
                      </span>
                    </div>
                  </div>
                  <div className="bg-emerald-600 px-4 py-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-emerald-100 text-sm font-medium">Your total Year 2 savings</span>
                      <span className="text-white font-bold text-lg">{fmt(renewalYearlySavings)}</span>
                    </div>
                  </div>
                </>
              )}
              {renewalTier.months === 0 && (
                <div className="bg-red-500 px-4 py-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-red-100 text-sm font-medium">Extra you'd pay per year</span>
                    <span className="text-white font-bold text-lg">{fmt(hikeAmount * 11)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Year 1 to 2 comparison */}
            <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200">
              <p className="text-xs font-semibold text-stone-400 tracking-[0.15em] uppercase mb-3">Year 1 vs Year 2</p>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-500 text-sm">Year 1 ({y1Tier.label} lock-in)</span>
                  <span className="text-stone-700 font-semibold">{fmt(y1Rent)}/mo</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-500 text-sm">
                    Year 2 ({renewalTier.months === 0 ? "no lock-in" : `${renewalTier.label} lock-in`})
                  </span>
                  <span className="text-stone-700 font-semibold">{fmt(renewalRent)}/mo</span>
                </div>
                <div className="pt-2 border-t border-stone-200">
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-500 text-sm">Effective monthly increase</span>
                    <span className={`font-bold ${renewalRent > y1Rent ? "text-amber-600" : "text-emerald-600"}`}>
                      +{fmt(renewalRent - y1Rent)} ({((renewalRent - y1Rent) / y1Rent * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2-year total */}
            <div className="mt-4 p-4 rounded-xl bg-stone-900 text-white">
              <p className="text-xs font-semibold text-stone-400 tracking-[0.15em] uppercase mb-3">2-Year Summary</p>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-300 text-sm">Year 1 total (11 months)</span>
                  <span className="text-stone-100 font-semibold">{fmt(y1Rent * 11)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-300 text-sm">Year 2 total (11 months)</span>
                  <span className="text-stone-100 font-semibold">{fmt(renewalRent * 11)}</span>
                </div>
                <div className="pt-2 border-t border-stone-700">
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-200 text-sm font-medium">Grand total (22 months)</span>
                    <span className="text-white font-bold text-lg">{fmt(y1Rent * 11 + renewalRent * 11)}</span>
                  </div>
                </div>
                {(y1YearlySavings + renewalYearlySavings) > 0 && (
                  <div className="pt-2 border-t border-stone-700">
                    <div className="flex justify-between items-baseline">
                      <span className="text-emerald-300 text-sm font-medium">Total saved with lock-ins</span>
                      <span className="text-emerald-400 font-bold text-lg">
                        {fmt(y1YearlySavings + renewalYearlySavings)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pb-6">
          <p className="text-stone-400 text-xs leading-relaxed max-w-sm mx-auto">
            Year 1: flat {"\u20b9"}1,000 off per lock-in tier upgrade. Renewal: discount applied to the 7% hike amount (30% / 50% / 70% for 6 / 9 / 11 months). Actual amounts confirmed in your quote.
          </p>
        </div>
      </div>
    </div>
  );
}
