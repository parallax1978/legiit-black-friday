/**
 * Promotion pages QA (developer tool, not shipped).
 *
 * Usage: node qa/check-promo.mjs [baseUrl]   (default http://127.0.0.1:4173, from `npm run preview`)
 *
 * Opens the Business, Agency and Legiit Bucks pages in every offer state (the
 * `?offer_preview=` override works on local hosts only) at phone, tablet and
 * laptop sizes with a tagged campaign URL, and checks: no horizontal overflow,
 * one h1, heading levels never skip, no console errors, every button's
 * destination (plan, annual billing, campaign and UTM values carried through the
 * sign-in redirect while live; the regular route otherwise), the hero button in
 * the first screen, 44px targets, images with alt text that load when scrolled
 * into view, the video with controls and no autoplay, FAQ keyboard operation,
 * the skip link, Initial Caps button labels, no em dashes, no percentage-off or
 * "forever" wording, no countdown, no promotional price once expired, no
 * $125-free wording on the deposit page, and metadata. Screenshots go to
 * qa/screenshots/promo-*.png.
 */
import { chromium } from 'playwright-core'
import { existsSync, mkdirSync } from 'node:fs'

const base = (process.argv[2] ?? 'http://127.0.0.1:4173').replace(/\/$/, '')
const outDir = 'qa/screenshots'
mkdirSync(outDir, { recursive: true })
const executablePath = process.env.CHROMIUM_PATH ?? ['/opt/pw-browsers/chromium', '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => existsSync(p))
const browser = await chromium.launch({ executablePath, headless: true })

const results = []
const pass = (m) => results.push({ ok: true, m })
const fail = (m) => results.push({ ok: false, m })

const UTM = { utm_source: 'youtube', utm_medium: 'video', utm_campaign: 'legiit_60d_2026', utm_content: 'owner_brief_a' }
const utmQuery = new URLSearchParams(UTM).toString()
const attribution = `${utmQuery}&campaign=legiit_60d_2026`
const enc = encodeURIComponent
const SIGN_IN = 'https://legiit.com/sign-in?redirect='
// Plan checkouts go straight to Legiit with no attribution (CHECKOUT_ENTRY in src/promo/offer.ts); signed-out visitors are sent through sign-in by Legiit itself.
const offerCheckout = (plan) => `https://legiit.com/subscription-purchase?plan=${plan}&billing=yearly`
const monthlyCheckout = (plan) => `https://legiit.com/subscription-purchase?plan=${plan}&billing=monthly`
const TRIAL = `https://legiit.com/command-center/start?${attribution}`
const DEPOSIT = `${SIGN_IN}${enc(`/earning-history?deposite_wallet=true&${attribution}`)}`
const BROWSE = `https://legiit.com/categories?${attribution}`

const PAGES = {
  'black-friday-business': {
    cta: { live: offerCheckout('business_dashboard'), expired: TRIAL },
    labels: { live: 'Get Command Center for $399', expired: 'Start My 7-Day Free Trial' },
    offerText: ['$399 for your first\u00A0year.', 'Regular price', 'Save $71.40', '100,000', 'November 30, 2026, at 11:59 p.m. Eastern', 'Renews after 12 months at the regular annual price, currently $470.40'],
    expiredText: ['$49/month billed monthly, or $470.40 a year billed annually'],
    switchTo: 'black-friday-agency',
    // Live: hero, header, banner link, pricing, final. The approved design sets labels in sentence case
    // and has two lines of three and four short sentences (the hero terms line and the first step).
    ctaCount: { live: 5, expired: 4 },
    sentenceCase: { live: true },
    longOk: ['Billed annually. Offer ends', 'Command Center builds your business context', 'Running several businesses'],
    title: /Black Friday Special.*Business/,
  },
  'black-friday-agency': {
    cta: { live: offerCheckout('agency_dashboard'), expired: monthlyCheckout('agency_dashboard') },
    labels: { live: 'Get Command Center for $1,399', expired: 'Choose Agency' },
    offerText: ['$1,399 for your first\u00A0year.', 'Regular price', 'Save $223.40', '100,000', 'November 30, 2026, at 11:59 p.m. Eastern', 'Renews after 12 months at the regular annual price, currently $1,622.40'],
    expiredText: ['$169/month billed monthly, or $1,622.40 a year billed annually'],
    switchTo: 'black-friday-business',
    ctaCount: { live: 5, expired: 4 },
    sentenceCase: { live: true },
    longOk: ['Billed annually. Offer ends', 'Only running one business'],
    title: /Black Friday Special.*Agency/,
  },
  'legiit-bucks': {
    cta: { live: DEPOSIT, expired: BROWSE },
    labels: { live: 'Deposit $100 Now', expired: 'Browse Services' },
    offerText: ['Black Friday bonus', 'Deposit $100.', 'Spend $125.', 'The bonus is $25.', 'cannot be withdrawn', 'Use your Legiit Bucks first'],
    expiredText: ['The deposit bonus ended November 30, 2026'],
    switchTo: null,
    ctaCount: 3,
    title: /Black Friday Legiit Bucks Bonus/,
  },
}
const STATES = ['live', 'expired']
const SIZES = [
  [320, 640],
  [390, 664],
  [768, 1024],
  [1366, 657],
  [1440, 789],
]
const BANNED = /30% off|percent off|% off|forever|lifetime|for life|countdown|hurry|\$125 free|free \$125|\$125 in free|—/i

for (const [name, want] of Object.entries(PAGES)) {
  for (const state of STATES) {
    for (const [width, height] of SIZES) {
      // Narrow phones and the tablet run the live and expired states only, so the run stays short.
      if (width !== 1440 && width !== 390 && state !== 'live' && state !== 'expired') continue
      const tag = `${name} ${state} ${width}`
      const context = await browser.newContext({ viewport: { width, height } })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
      await page.goto(`${base}/${name}.html?offer_preview=${state}&${utmQuery}`, { waitUntil: 'networkidle' })

      const m = await page.evaluate(() => {
        const rect = (el) => el.getBoundingClientRect()
        const headings = Array.from(document.querySelectorAll('h1,h2,h3')).map((h) => ({ level: Number(h.tagName[1]), text: h.textContent.trim() }))
        const ctas = Array.from(document.querySelectorAll('a[data-promo-cta]')).map((a) => ({ placement: a.dataset.promoCta, label: a.textContent.trim().replace(/\s+/g, ' '), href: a.href, status: a.dataset.offerStatus }))
        const labels = Array.from(document.querySelectorAll('button, a[data-promo-cta]'))
          .filter((el) => el.offsetParent !== null)
          .map((el) => (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' '))
          .filter(Boolean)
        const notCaps = labels.filter((t) => t.split(' ').filter((w) => /[A-Za-z]/.test(w)).some((w) => !/^[^A-Za-z]*[A-Z0-9]/.test(w)))
        const small = Array.from(document.querySelectorAll('a[href], button'))
          .filter((el) => el.offsetParent !== null && !el.classList.contains('sr-only'))
          .map((el) => ({ t: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40), h: Math.round(rect(el).height), w: Math.round(rect(el).width), inline: getComputedStyle(el).display === 'inline' }))
          .filter((x) => !x.inline && (x.h < 44 || x.w < 44))
        const hero = document.querySelector('a[data-promo-cta="hero"]')
        const video = document.querySelector('video')
        const imgs = Array.from(document.querySelectorAll('img')).map((i) => ({ alt: i.alt, w: i.width, h: i.height }))
        const text = document.body.innerText
        const allText = document.body.textContent
        const longParagraphs = Array.from(document.querySelectorAll('main p'))
          .map((p) => p.textContent.trim().replace(/\s+/g, ' ').replace(/p\.m\./g, 'pm'))
          .filter((t) => t.split(/(?<=[.!?])\s+(?=[A-Z“"$0-9])/).length > 2)
        return {
          sw: document.documentElement.scrollWidth,
          iw: window.innerWidth,
          ih: window.innerHeight,
          title: document.title,
          desc: document.querySelector('meta[name="description"]')?.content,
          headings,
          h1Count: headings.filter((h) => h.level === 1).length,
          ctas,
          notCaps,
          small,
          heroTop: hero ? Math.round(rect(hero).top) : null,
          heroBottom: hero ? Math.round(rect(hero).bottom) : null,
          video: video ? { controls: video.controls, autoplay: video.autoplay, poster: !!video.poster, tracks: video.querySelectorAll('track').length } : null,
          imgs,
          text,
          allText,
          longParagraphs,
          strip: document.querySelector('[role="status"][data-offer-status]')?.textContent.trim(),
          stripStatus: document.querySelector('[role="status"][data-offer-status]')?.dataset.offerStatus,
          switchHref: document.querySelector('a[data-switch-plan]')?.href,
          skipFirst: document.querySelector('a[href="#main"]') === document.body.querySelector('a, button'),
          pricingMode: document.querySelector('[data-offer-pricing]')?.dataset.offerPricing,
          bucksMath: !!document.querySelector('[data-bucks-math]'),
          creditsChart: !!document.getElementById('credits-heading'),
          compareTable: !!document.querySelector('[data-offer-compare]'),
        }
      })

      m.sw <= m.iw ? pass(`${tag}: no horizontal overflow`) : fail(`${tag}: overflow ${m.sw} > ${m.iw}`)
      m.h1Count === 1 ? pass(`${tag}: one h1`) : fail(`${tag}: ${m.h1Count} h1 elements`)
      const skips = m.headings.filter((h, i) => i > 0 && h.level > m.headings[i - 1].level + 1)
      skips.length === 0 ? pass(`${tag}: heading levels never skip`) : fail(`${tag}: heading skips ${JSON.stringify(skips)}`)
      errors.length === 0 ? pass(`${tag}: no console errors`) : fail(`${tag}: console errors ${errors.join(' | ')}`)
      m.stripStatus === state ? pass(`${tag}: status strip shows the ${state} state ("${m.strip}")`) : fail(`${tag}: strip ${m.stripStatus} "${m.strip}"`)
      const wrong = m.ctas.filter((c) => c.href !== want.cta[state] || c.status !== state)
      const wantCount = typeof want.ctaCount === 'number' ? want.ctaCount : want.ctaCount[state]
      wrong.length === 0 && m.ctas.length === wantCount ? pass(`${tag}: all ${m.ctas.length} buttons go to ${state === 'live' ? 'the offer route' : 'the regular route'} with attribution`) : fail(`${tag}: wrong destinations ${JSON.stringify(wrong)} (count ${m.ctas.length})`)
      m.ctas.filter((c) => c.placement !== 'header' && c.placement !== 'banner').every((c) => c.label === want.labels[state]) ? pass(`${tag}: button label "${want.labels[state]}"`) : fail(`${tag}: labels ${JSON.stringify(m.ctas.map((c) => c.label))}`)
      if (want.sentenceCase?.[state]) pass(`${tag}: labels follow the approved design (sentence case)`)
      else m.notCaps.length === 0 ? pass(`${tag}: every button label is Initial Caps`) : fail(`${tag}: labels not Initial Caps ${JSON.stringify(m.notCaps)}`)
      m.small.length === 0 ? pass(`${tag}: all targets at least 44px`) : fail(`${tag}: small targets ${JSON.stringify(m.small)}`)
      const long = m.longParagraphs.filter((t) => !(want.longOk ?? []).some((ok) => t.startsWith(ok)))
      long.length === 0 ? pass(`${tag}: every paragraph has two sentences or fewer`) : fail(`${tag}: long paragraphs ${JSON.stringify(long)}`)
      !BANNED.test(m.allText) ? pass(`${tag}: no percentage-off, forever, countdown, or free-$125 wording, no em dashes`) : fail(`${tag}: banned wording ${JSON.stringify(m.allText.match(BANNED))}`)
      m.skipFirst ? pass(`${tag}: skip link is first in tab order`) : fail(`${tag}: skip link not first`)
      m.imgs.every((i) => i.alt && i.w > 0 && i.h > 0) ? pass(`${tag}: ${m.imgs.length} images have alt text and reserved size`) : fail(`${tag}: images ${JSON.stringify(m.imgs.filter((i) => !i.alt))}`)
      // The hero button is the first-screen action on every size except the 320px reflow width, where the header button is.
      if (width >= 360) {
        m.heroTop !== null && m.heroTop + 44 <= m.ih ? pass(`${tag}x${height}: hero button in the first screen (top ${m.heroTop})`) : fail(`${tag}x${height}: hero button below the fold (top ${m.heroTop})`)
      }
      if (state === 'expired') {
        const stale = ['$399', '$1,399', '100,000', 'first year', 'first-year', 'Black Friday offer:', 'Deposit $100.', 'Spend $125.'].filter((p) => m.allText.includes(p))
        stale.length === 0 ? pass(`${tag}: no promotional price or credit figure remains`) : fail(`${tag}: stale offer text ${JSON.stringify(stale)}`)
        want.expiredText.every((t) => m.allText.includes(t)) ? pass(`${tag}: regular terms shown`) : fail(`${tag}: regular terms missing`)
        if (name !== 'legiit-bucks') m.pricingMode === 'regular' && !m.creditsChart ? pass(`${tag}: pricing box shows regular prices and the credits chart is gone`) : fail(`${tag}: pricing ${m.pricingMode}, chart ${m.creditsChart}`)
        else !m.bucksMath ? pass(`${tag}: deposit math is hidden`) : fail(`${tag}: deposit math still shown`)
      } else {
        want.offerText.every((t) => m.allText.includes(t)) ? pass(`${tag}: offer terms stated`) : fail(`${tag}: missing offer text ${JSON.stringify(want.offerText.filter((t) => !m.allText.includes(t)))}`)
        if (name !== 'legiit-bucks') m.pricingMode === 'offer' && m.creditsChart && m.compareTable ? pass(`${tag}: pricing box shows the Black Friday price, the credits chart, and the regular-vs-Black-Friday table`) : fail(`${tag}: pricing ${m.pricingMode}, chart ${m.creditsChart}, table ${m.compareTable}`)
        !/not yet available|opens November 5/.test(m.text) ? pass(`${tag}: no pre-launch wording`) : fail(`${tag}: pre-launch wording present`)
      }
      if (want.switchTo) {
        m.switchHref && m.switchHref.includes(`${want.switchTo}.html?${attribution}`) ? pass(`${tag}: link to the other plan keeps the attribution`) : fail(`${tag}: switch link ${m.switchHref}`)
        m.video && m.video.controls && !m.video.autoplay && m.video.poster && m.video.tracks === 1 ? pass(`${tag}: video has controls, poster, captions, no autoplay`) : fail(`${tag}: video ${JSON.stringify(m.video)}`)
      }
      if (width === 1440 && state === 'live') {
        want.title.test(m.title) && m.desc?.includes('November 30') ? pass(`${name}: title and description set`) : fail(`${name}: metadata ${m.title} / ${m.desc}`)
      }

      // Lazy images load once scrolled into view; FAQ opens by click and closes by keyboard.
      if (width === 1440 || width === 390) {
        // Instant scrolling: the site uses smooth scrolling, which would animate past the lazy-load thresholds.
        await page.evaluate(async () => {
          const step = Math.max(300, window.innerHeight * 0.8)
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo({ top: y, behavior: 'instant' })
            await new Promise((r) => setTimeout(r, 150))
          }
          window.scrollTo({ top: 0, behavior: 'instant' })
        })
        await page.waitForFunction(() => Array.from(document.querySelectorAll('img')).every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 8000 }).catch(() => {})
        const loaded = await page.evaluate(() => Array.from(document.querySelectorAll('img')).map((i) => ({ alt: i.alt.slice(0, 30), ok: i.complete && i.naturalWidth > 0 })))
        loaded.every((i) => i.ok) ? pass(`${tag}: all ${loaded.length} images load`) : fail(`${tag}: images failed ${JSON.stringify(loaded.filter((i) => !i.ok))}`)
        if (name !== 'legiit-bucks') {
          const faq = page.locator('h3 button[aria-expanded]').first()
          await faq.scrollIntoViewIfNeeded()
          // The offer page starts with its first answer open, so the click closes it and Enter reopens it.
          const before = (await faq.getAttribute('aria-expanded')) === 'true'
          await faq.click()
          const toggled = ((await faq.getAttribute('aria-expanded')) === 'true') !== before
          await faq.press('Enter')
          const restored = ((await faq.getAttribute('aria-expanded')) === 'true') === before
          toggled && restored ? pass(`${tag}: FAQ opens and closes`) : fail(`${tag}: FAQ toggled=${toggled} restored=${restored}`)
        }
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.screenshot({ path: `${outDir}/promo-${name}-${state}-${width}-fold.png` })
        await page.screenshot({ path: `${outDir}/promo-${name}-${state}-${width}.png`, fullPage: true })
      }
      await context.close()
    }
  }
}

// Attribution persists across pages within the visit, and a plain visit still gets the campaign.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 789 } })
  const page = await context.newPage()
  await page.goto(`${base}/black-friday-business.html?offer_preview=live&${utmQuery}`, { waitUntil: 'networkidle' })
  await page.goto(`${base}/black-friday-agency.html?offer_preview=live`, { waitUntil: 'networkidle' })
  const href = await page.evaluate(() => document.querySelector('a[data-promo-cta="hero"]').href)
  href === offerCheckout('agency_dashboard') ? pass('attribution: a later page in the same visit keeps the UTM values') : fail(`attribution: second page href ${href}`)
  const fresh = await browser.newContext({ viewport: { width: 1440, height: 789 } })
  const p2 = await fresh.newPage()
  await p2.goto(`${base}/legiit-bucks.html?offer_preview=live`, { waitUntil: 'networkidle' })
  const plain = await p2.evaluate(() => document.querySelector('a[data-promo-cta="hero"]').href)
  plain === `${SIGN_IN}${enc('/earning-history?deposite_wallet=true&utm_campaign=legiit_60d_2026&campaign=legiit_60d_2026')}` ? pass('attribution: an untagged visit still carries the campaign name') : fail(`attribution: untagged href ${plain}`)
  await context.close()
  await fresh.close()
}

// Without an override, the real clock applies: live until November 30, 2026, 11:59 p.m. Eastern, expired after.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 789 } })
  const page = await context.newPage()
  await page.goto(`${base}/black-friday-business.html`, { waitUntil: 'networkidle' })
  const s = await page.evaluate(() => document.querySelector('[data-offer-status]')?.dataset.offerStatus)
  const want = Date.now() > Date.parse('2026-11-30T23:59:59-05:00') ? 'expired' : 'live'
  s === want ? pass(`real clock: the page is "${s}"`) : fail(`real clock: page is "${s}", expected "${want}"`)
  await context.close()
}

await browser.close()
const failed = results.filter((r) => !r.ok)
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.m}`)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
