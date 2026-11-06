import { describe, expect, it } from 'vitest'
import { BUCKS_PAGE, CREDITS_SCHEDULE, DEADLINE_SENTENCE, afterYearOne, agencyPage, businessPage, creditsNote, statusBanner } from './content'
import { FIRST_YEAR } from './offer'
import { OFFER_STATUSES } from './status'

const isInitialCaps = (label: string) =>
  label
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w))
    .every((w) => /^[^A-Za-z]*[A-Z0-9]/.test(w))

// "11:59 p.m. Eastern" is one sentence, so the abbreviation is folded before counting.
const sentences = (p: string) => p.replace(/p\.m\./g, 'pm').split(/(?<=[.!?])\s+(?=[A-Z“"$0-9])/).filter(Boolean)

const pages = [businessPage(true), businessPage(false), agencyPage(true), agencyPage(false)]
const allOfferCopy = JSON.stringify([businessPage(true), agencyPage(true), BUCKS_PAGE, CREDITS_SCHEDULE, OFFER_STATUSES.map((s) => [statusBanner(s, 'command-center'), statusBanner(s, 'legiit-bucks')])])
const expiredCopy = JSON.stringify([businessPage(false), agencyPage(false)])

describe('offer wording', () => {
  it('states the terms the way the offer was announced', () => {
    expect(businessPage(true).h1Line1).toBe('$399')
    expect(businessPage(true).h1Line2).toBe('for your first year.')
    const offerPage = businessPage(true).offerPage!
    expect(offerPage).toMatchObject({
      banner: 'Black Friday: Business for $399 your first year, plus double AI credits. Ends November 30, 11:59 p.m. Eastern.',
      bannerLink: 'Get the deal',
      compare: { label: 'Regular price', regular: '$470.40', saving: 'Save $71.40' },
      monthly: 'That’s $33.25 a month, billed annually.',
      bonus: 'Bonus: 2x AI credits for 12 months',
      demoLink: 'See it work in 42 seconds',
      terms: { before: 'Billed annually. Offer ends November 30, 11:59 p.m. Eastern. Prefer to try first? ', trialLabel: 'Start the 7-day trial' },
    })
    expect(offerPage.credits.body).toBe('That’s 600,000 more credits across the year, for drafts, briefs, and research. They arrive month by month, not all at once.')
    expect(offerPage.plan.note).toBe('Renews after 12 months at the regular annual price, currently $470.40, with the standard 50,000 credits a month. Freelance services are purchased separately.')
    expect(businessPage(true).cta).toMatchObject({ live: 'Get Command Center for $399', liveHeader: 'Get the $399 deal' })
    expect(businessPage(true).final.note).toBe('Billed annually. Offer ends November 30, 2026, at 11:59 p.m. Eastern.')
    expect(businessPage(false).offerPage).toBeUndefined()
    expect(businessPage(true).offerLine).toBe('Black Friday bonus: Double your monthly AI credits for 12 months.')
    expect(businessPage(true).heroNote.live).toBe('$399 for your first year, billed annually.')
    expect(agencyPage(true).h1Line1).toBe('$1,399')
    expect(agencyPage(true).h1Line2).toBe('for your first year.')
    expect(agencyPage(true).offerPage).toMatchObject({
      banner: 'Black Friday: Agency for $1,399 your first year, plus double AI credits. Ends November 30, 11:59 p.m. Eastern.',
      compare: { regular: '$1,622.40', saving: 'Save $223.40' },
      monthly: 'That’s $116.58 a month, billed annually.',
      terms: { before: 'Billed annually. Offer ends November 30, 11:59 p.m. Eastern. Prefer to try first? ', trialLabel: 'Start the 7-day Business trial' },
    })
    expect(agencyPage(true).offerPage?.plan.included).toContain('Up to 20 businesses included; more at $10/month each')
    expect(agencyPage(true).cta).toMatchObject({ live: 'Get Command Center for $1,399', liveHeader: 'Get the $1,399 deal' })
    expect(DEADLINE_SENTENCE).toBe('Offer ends November 30, 2026, at 11:59 p.m. Eastern.')
    expect(creditsNote()).toBe('100,000 AI credits are allocated at the start of each of your first 12 months, instead of the standard 50,000. They arrive month by month, not all at once.')
    expect(afterYearOne(FIRST_YEAR.business)).toBe('After the first 12 months the plan renews at the regular annual price, currently $470.40, with the standard 50,000 AI credits a month.')
    expect(afterYearOne(FIRST_YEAR.agency)).toContain('currently $1,622.40')
    for (const page of [businessPage(true), agencyPage(true)]) {
      expect(page.heroNote.live).toContain('billed annually')
      if (page.page === 'agency') expect(page.heroNote.live).toContain('instead of the regular')
      expect(page.pricing.title).toContain('normally')
      if (page.page === 'agency') expect(page.heroNote.live).toContain(DEADLINE_SENTENCE)
      expect(page.pricing.afterYearOne).toContain('renews at the regular annual price')
    }
  })

  it('never describes the offer as a percentage off or as lasting forever', () => {
    for (const phrase of ['30%', 'percent off', '% off', 'forever', 'for life', 'lifetime', 'locked in', 'every year', 'countdown', 'hurry', 'free $125', '$125 free', '$125 in free', 'free credit.']) {
      expect(allOfferCopy.toLowerCase(), phrase).not.toContain(phrase.toLowerCase())
    }
    expect(allOfferCopy).not.toContain('30% off')
    // "not all at once" is the one allowed use of the phrase in a statement, so it must be negated wherever it appears; the FAQ asks it as a question.
    expect(allOfferCopy.match(/all at once(?!\?)/g)?.length).toBe(allOfferCopy.match(/not all at once/g)?.length)
  })

  it('keeps the deposit bonus apart from Command Center and spells out the $25', () => {
    expect(BUCKS_PAGE.h1Line1 + ' ' + BUCKS_PAGE.h1Line2).toBe('Deposit $100. Spend $125.')
    expect(BUCKS_PAGE.math.clarification).toBe('The bonus is $25. This is not $125 of free credit, and it is not part of any Command Center subscription.')
    expect(BUCKS_PAGE.subhead).toContain('your $100, plus $25 from Legiit')
    expect(JSON.stringify(BUCKS_PAGE)).not.toMatch(/\$399|\$1,399|AI credits/)
    expect(BUCKS_PAGE.rules.items.join(' ')).toContain('cannot be withdrawn')
  })

  it('drops every promotional figure once the offer has expired', () => {
    for (const phrase of ['$399', '$1,399', '100,000', 'first year', 'first-year', 'Black Friday', 'first 12 months']) {
      const pattern = new RegExp(phrase.replace(/[$.]/g, '\\$&'), 'i')
      const expiredPages = [businessPage(false), agencyPage(false)].map((p) => JSON.stringify({ ...p, faq: null, pricing: { ...p.pricing, eyebrow: null, title: null, creditsNote: null, afterYearOne: null }, heroNote: p.heroNote.expired, cta: null, switchPlan: null }))
      for (const text of expiredPages) expect(text, phrase).not.toMatch(pattern)
    }
    expect(expiredCopy).toContain('$49/month billed monthly, or $470.40 a year billed annually')
    expect(expiredCopy).toContain('$169/month billed monthly, or $1,622.40 a year billed annually')
  })
})

describe('copy rules', () => {
  it('uses Initial Caps for the H1, every button label, and every FAQ question', () => {
    for (const page of pages) {
      // The offer pages follow the approved design, which sets the H1, the buttons, and the questions in sentence case; the live labels show only with the offer.
      const labels = page.offerPage ? [] : [page.h1Line1, page.h1Line2, page.cta.fallback, page.cta.fallbackHeader]
      for (const label of labels) expect(isInitialCaps(label), label).toBe(true)
      if (!page.offerPage) for (const item of page.faq.items) expect(isInitialCaps(item.question), item.question).toBe(true)
      expect(new Set(page.faq.items.map((i) => i.id)).size).toBe(page.faq.items.length)
    }
    for (const label of [BUCKS_PAGE.h1Line1, BUCKS_PAGE.h1Line2, ...Object.values(BUCKS_PAGE.cta)]) expect(isInitialCaps(label), label).toBe(true)
  })

  it('sets the offer page in sentence case, with the contact answer under the FAQ heading', () => {
    const page = businessPage(true)
    expect(page.faq.items.map((i) => i.question)).toEqual([
      'What exactly is the Black Friday special?',
      'Are the credits delivered all at once?',
      'What happens after the first year?',
      'Can I pay monthly instead?',
      'Is there still a free trial?',
      'How many businesses does Business include?',
      'Are freelance services included?',
      'When does the offer end?',
    ])
    expect(page.faq.help?.text).toBe('Still unsure? Email help@legiit.com or visit the support center.')
    expect(page.faq.openFirst).toBe(true)
    expect(agencyPage(true).faq.items.map((i) => i.question)).toEqual([
      'What exactly is the Black Friday special?',
      'What does that cost per client?',
      'Are the credits delivered all at once?',
      'What happens after the first year?',
      'Can I pay monthly instead?',
      'Can I start on Business and upgrade later?',
      'Is there a free trial for Agency?',
      'Are freelance services included?',
      'When does the offer end?',
    ])
    for (const step of agencyPage(true).offerPage?.steps ?? []) expect(sentences(step.paragraph).length, step.paragraph).toBeLessThanOrEqual(2)
    expect(page.offerPage?.steps.map((s) => s.label)).toEqual(['Step 1 · Know your next move', 'Step 2 · Get the work started', 'Step 3 · Get expert help to finish it'])
    for (const step of page.offerPage?.steps ?? []) {
      expect(step.bullets).toHaveLength(3)
      expect(sentences(step.paragraph).length, step.paragraph).toBeLessThanOrEqual(3)
      expect(step.screens.length).toBeGreaterThan(0)
    }
    expect(page.offerPage?.plan.included).toContain('2% back in Legiit Bucks on completed freelancer orders')
  })

  it('keeps every paragraph to two sentences or fewer', () => {
    const paragraphs: string[] = []
    for (const page of pages) {
      paragraphs.push(page.subhead, ...Object.values(page.heroNote), page.problem.lead, page.demo.body, page.pricing.creditsNote, page.pricing.afterYearOne, page.final.body)
      if (page.offerPage) paragraphs.push(page.offerPage.credits.body, page.offerPage.plan.note, page.offerPage.plan.tagline, page.final.note ?? '', page.faq.help?.text ?? '')
      for (const item of page.problem.items) paragraphs.push(item.problem, item.solution)
      for (const f of page.features) paragraphs.push(...f.paragraphs)
      for (const item of page.faq.items) paragraphs.push(...item.answer)
    }
    paragraphs.push(BUCKS_PAGE.subhead, ...Object.values(BUCKS_PAGE.heroNote), BUCKS_PAGE.math.clarification, ...BUCKS_PAGE.how.steps.map((s) => s.body), ...BUCKS_PAGE.rules.items, BUCKS_PAGE.final.body, CREDITS_SCHEDULE.body)
    for (const p of paragraphs) expect(sentences(p).length, p).toBeLessThanOrEqual(2)
  })

  it('has no em dashes, emoji, or unverified terms', () => {
    const all = allOfferCopy + expiredCopy
    expect(all).not.toMatch(/—/)
    expect(all).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u)
    for (const phrase of ['no credit card', 'money back', 'guarantee', 'unlimited', 'refund', 'risk-free', 'popular']) {
      expect(all.toLowerCase(), phrase).not.toContain(phrase)
    }
    // Renewal can be stopped from Active Subscriptions (Legiit support article 36000493110); the word is only ever used there.
    expect(all.match(/cancel/gi)).toBeNull()
  })

  it('names the other plan on each page and links to its page', () => {
    expect(businessPage(true).switchPlan.href).toMatch(/agency/)
    expect(agencyPage(true).switchPlan.href).toMatch(/business/)
    expect(businessPage(true).switchPlan.before).toContain('$1,399')
    expect(agencyPage(true).switchPlan.before).toContain('$399')
  })
})
