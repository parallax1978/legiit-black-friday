# November 2026 promotion pages

Three landing pages for Legiit's November promotion, built on the Command Center landing page's brand system, components, and conventions (React 18, TypeScript strict, Tailwind 3, Vite 5, the same header, footer, buttons, FAQ accordion, product sections, screenshots, and overview video).

| Page | Dev and preview route | Deployed path (`npm run build:promo`) | Code |
|---|---|---|---|
| Command Center for business owners | `/black-friday-business.html` | `/black-friday/business/` | `src/promo/business.tsx`, `PromoApp.tsx`, copy in `content.ts` (`businessPage`) |
| Command Center for agencies | `/black-friday-agency.html` | `/black-friday/agency/` | `src/promo/agency.tsx`, `PromoApp.tsx`, copy in `content.ts` (`agencyPage`) |
| Legiit Bucks deposit bonus | `/legiit-bucks.html` | `/legiit-bucks/` | `src/promo/bucks.tsx`, `BucksApp.tsx`, copy in `content.ts` (`BUCKS_PAGE`) |

## Run and check

```bash
npm install
npm run dev                      # http://localhost:5173/black-friday-business.html etc.
npm run check                    # typecheck, 51 unit tests (incl. src/promo/*.test.ts), build
npm run preview                  # serves dist/ at http://localhost:4173
node qa/check-promo.mjs          # 801 browser checks across pages, offer states, and sizes; screenshots in qa/screenshots/promo-*
npm run build:promo              # upload-ready pages -> dist-promo/ (PROMO_BASE=/path/ for another base)
```

Preview any offer state on a local host with `?offer_preview=live|upcoming|pending|expired`. The override is ignored on any other host.

## The offer, in one file

Every price, credit figure, date, route, and readiness flag is in `src/promo/offer.ts`. The copy in `src/promo/content.ts` interpolates from it, and `src/promo/offer.test.ts` pins the values, so a change to the offer is one edit and the tests say what moved.

| Term | Value | Where |
|---|---|---|
| Business first year | $399, billed annually at purchase (regular annual price $470.40) | `FIRST_YEAR.business` |
| Agency first year | $1,399, billed annually at purchase (regular annual price $1,622.40) | `FIRST_YEAR.agency` |
| AI credits | 100,000 a month for the first 12 months instead of 50,000, allocated monthly | `CREDITS` |
| Offer window | Opens November 5, 2026; ends November 30, 2026, at 11:59 p.m. Eastern (fixed EST offsets, verified by a unit test) | `OFFER_WINDOW` |
| Deposit bonus | Deposit $100, Legiit adds $25, $125 to spend; in $100 steps | `BUCKS_DEPOSIT` |
| Campaign name | `legiit_60d_2026` | `CAMPAIGN_NAME` |
| Checkout readiness | `business_dashboard`, `agency_dashboard`, `legiitBucksDeposit`, all `false` | `CHECKOUT_READY` |

Wording rules enforced by `src/promo/content.test.ts` and the QA: the offer is never "30% off", nothing suggests the first-year price or doubled credits continue past year one (every page says the plan renews at the regular annual price, currently $470.40 or $1,622.40, with the standard 50,000 credits), credits are "allocated monthly, not all at once", the deposit page says "the bonus is $25, this is not $125 of free credit, and it is not part of any Command Center subscription", no countdown, no em dashes, Initial Caps on buttons and FAQ questions, two sentences per paragraph.

## Offer states

`src/promo/status.ts` computes the state from the clock and the readiness flag, re-checks every minute and when the tab regains focus, so a page left open flips on time.

| State | When | Buttons | What the page says |
|---|---|---|---|
| `upcoming` | Before November 5 | Business: the 7-day trial at `/command-center/start`. Agency: the regular month-to-month checkout. Bucks: create a free account | Terms shown with "opens November 5, 2026"; never "live" |
| `pending` | In the window, but the plan's `CHECKOUT_READY` flag is still `false` | Same regular routes | "not yet available at checkout" |
| `live` | In the window and the flag is `true` | The plan's annual checkout; the Deposit Funds screen | The offer, with the end date in words |
| `expired` | After November 30, 11:59 p.m. Eastern | Regular routes | Regular prices only. The H1, title, FAQ, features, final section, and credits chart drop every promotional figure; the QA asserts none remains |

**Flip a `CHECKOUT_READY` flag only after a real end-to-end purchase on the live site shows the offer price (or the $25 bonus).** Until then no page claims the promotion is available, whatever the date. Shak owns that check (deck, "Fix and prove it").

## Destinations and attribution

| Button | Destination |
|---|---|
| Business, live | `https://legiit.com/sign-in?redirect=/subscription-purchase?plan=business_dashboard&billing=yearly&utm_…&campaign=legiit_60d_2026` |
| Agency, live | same with `plan=agency_dashboard` |
| Business, not live | `https://legiit.com/command-center/start?utm_…&campaign=…` (the landing page's trial route) |
| Agency, not live | sign-in, then `/subscription-purchase?plan=agency_dashboard&billing=monthly&…` |
| Legiit Bucks, live | `https://legiit.com/sign-in?redirect=/earning-history?deposite_wallet=true&utm_…&campaign=…` (Legiit's Deposit Funds screen, its own spelling, taken from the "Deposit Funds" menu item and wallet "Deposit" button in Legiit's app bundle) |
| Legiit Bucks, upcoming or pending | `https://legiit.com/register?…` |
| Legiit Bucks, expired | `https://legiit.com/categories?…` |

Why sign-in first: checked on November 4, 2026, a signed-out visit to `/subscription-purchase` and to `/earning-history?deposite_wallet=true` redirects to `/sign-in` and drops the destination, so the visitor would land on the homepage after logging in. Routing through `/sign-in?redirect=…` (the form Legiit's own Business "Subscribe" button builds) keeps the plan, billing period, campaign, and UTM values in the redirect target. `CHECKOUT_ENTRY` in `offer.ts` switches every plan button to the direct checkout URL once Legiit's checkout keeps the plan for signed-out visitors.

Attribution (`src/promo/attribution.ts`): the page reads `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, and `campaign` from its URL, stores them in `sessionStorage` for the visit (failures ignored), and forwards them on every button and on the link between the Business and Agency pages. A visit with no parameters still carries `utm_campaign=legiit_60d_2026&campaign=legiit_60d_2026`. No vendor is added: events go through the project's typed `track()` hooks (`promo_view`, `promo_cta_click` with page, placement, plan, billing, state, campaign, and destination), and `src/lib/dataLayer.ts` forwards them to a GTM `dataLayer` only when the host page already has one (legiit.com runs GTM-MXLWTRC). Nothing is loaded or sent otherwise.

## Assets

The pages reuse the landing page's approved assets from `src/config/media.ts`: the 42-second overview video with poster and captions, and the product screens (`priorities`, `brief-builder`, `ai-visibility`, `specialist-help`, `services`). To replace one, swap the file in `src/assets/product/` or point the entry in `media.ts` at a new import; the promotion pages pick it up. The Legiit Bucks page uses no product imagery. Every image has alt text and reserved dimensions, below-the-fold images lazy-load, and the QA confirms they load.

## Verified sources

- Offer terms: Jim Sabellico's #legiit message of November 4, 2026 and the "Legiit, The Next 60 Days" deck (prices, credits, dates, "$100 increments", "bonus funds are for services and cannot be withdrawn").
- Regular prices, allowances, plan ids, and routes: `src/pricing/plans.ts` (Legiit's pricing API and pages, captured October 27, 2026).
- Legiit Bucks are spent at checkout by choosing Wallet and "Use your Legiit Bucks first", can be combined with a card or PayPal, and are listed at `/legiit-bucks/history`: Legiit support article 36000603472.
- Subscriptions are managed at `/buyer/active-subscriptions`: Legiit support article 36000493110. This is the only basis for "You can review or stop renewal from Active Subscriptions".
- The Deposit Funds screen is `/earning-history?deposite_wallet=true`: Legiit's app bundle (`main-DbE6ZM3h.js`, the Financial menu and wallet widget), November 4, 2026.

## Not stated, because unverified

Whether the 7-day trial can convert to the first-year price (the pages say to complete the annual purchase before the deadline), whether Business-to-Agency upgrades keep the offer, whether the $25 bonus is added automatically or by support and when, whether deposit-bonus Legiit Bucks expire (the 2% cashback expires after 30 days; the deposit bonus is not documented), card and cancellation terms, and what one AI credit buys.

## Blockers before launch

1. **Checkout does not yet apply the offer.** `/subscription-purchase?plan=business_dashboard&billing=yearly` is the regular $470.40 checkout today. Shak needs to build the $399 and $1,399 first-year prices and the 100,000-credit allocation, prove them with a real purchase, and then set `CHECKOUT_READY` in `src/promo/offer.ts`. Same for the $25 deposit bonus.
2. **Sign-in redirect and registration.** Confirm `/sign-in?redirect=…` returns to the checkout after login, and that "Register Now" on the sign-in page keeps the redirect for new accounts (the October review found it did not). If registration drops it, new buyers lose the plan.
3. **Deposit bonus mechanics.** Confirm whether the $25 is automatic, when it posts, whether it expires, and whether a $200 deposit earns $50 (the pages say so, from the deck's "$100 increments").
4. **Hosting paths.** `npm run build:promo` writes `/black-friday/business/`, `/black-friday/agency/`, `/legiit-bucks/` with assets under `/promo-assets/`. Set `PROMO_BASE` if the pages will live elsewhere. The pages carry `noindex` until they are approved for search.
5. **GTM.** If the pages are hosted on legiit.com, add a GTM trigger on the custom events `promo_view` and `promo_cta_click`; otherwise register a handler with `setAnalyticsHandler`.
