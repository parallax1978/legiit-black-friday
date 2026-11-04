import { describe, expect, it } from 'vitest'
import { BUCKS_PAGE, CREDITS_SCHEDULE, DEADLINE_SENTENCE, afterYearOne, agencyPage, businessPage, creditsNote, statusBanner } from './content'
import { FIRST_YEAR } from './offer'
import { OFFER_STATUSES } from './status'

/** Proper names that keep their capitals inside a sentence-case label. */
const PROPER = new Set(['Legiit', 'Business', 'Agency', 'Command', 'Center', 'AI', 'Lara', 'Do', 'This', 'Next', 'Black', 'Friday', 'Eastern', 'November', 'Monday', 'Bucks', 'PayPal', 'I', 'Google', 'Wallet', 'Deposit', 'Funds', 'Active', 'Subscriptions', 'The'])
/** Sentence case: the first word capitalised, every later word lowercase unless it is a proper name, a number, or follows a sentence end. */
const isSentenceCase = (label: string) => {
  const words = label.split(/\s+/).filter(Boolean)
  const first = words[0] ?? ''
  if (!/^[^a-z]*[A-Z0-9$]/.test(first)) return false
  let sentenceStart = false
  for (const w of words.slice(1)) {
    const core = w.replace(/^[^A-Za-z]+/, '')
    const capital = /^[A-Z]/.test(core)
    if (capital && !sentenceStart && !PROPER.has(core.replace(/[^A-Za-z]+$/, '')) && !/^[A-Z]{2,}$/.test(core)) return false
    sentenceStart = /[.!?]$/.test(w)
  }
  return true
}

// "11:59 p.m. Eastern" is one sentence, so the abbreviation is folded before counting.
const sentences = (p: string) => p.replace(/p\.m\./g, 'pm').split(/(?<=[.!?])\s+(?=[A-Z“"$0-9])/).filter(Boolean)

const pages = [businessPage(true), businessPage(false), agencyPage(true), agencyPage(false)]
const allOfferCopy = JSON.stringify([businessPage(true), agencyPage(true), BUCKS_PAGE, CREDITS_SCHEDULE, OFFER_STATUSES.map((s) => [statusBanner(s, 'command-center'), statusBanner(s, 'legiit-bucks')])])
const expiredCopy = JSON.stringify([businessPage(false), agencyPage(false)])

describe('offer wording', () => {
  it('states the terms the way the offer was announced', () => {
    expect(businessPage(true).h1Line2).toBe('$399 for your first year.')
    expect(agencyPage(true).h1Line2).toBe('$1,399 for your first year.')
    expect(DEADLINE_SENTENCE).toBe('Offer ends November 30, 2026, at 11:59 p.m. Eastern.')
    expect(creditsNote()).toBe('100,000 AI credits are allocated at the start of each of your first 12 months, instead of the standard 50,000. They arrive month by month, not all at once.')
    expect(afterYearOne(FIRST_YEAR.business)).toBe('After the first 12 months the plan renews at the regular annual price, currently $470.40, with the standard 50,000 AI credits a month.')
    expect(afterYearOne(FIRST_YEAR.agency)).toContain('currently $1,622.40')
    for (const page of [businessPage(true), agencyPage(true)]) {
      expect(page.heroNote.live).toContain('billed annually')
      expect(page.heroNote.live).toContain(DEADLINE_SENTENCE)
      expect(page.pricing.afterYearOne).toContain('renews at the regular annual price')
    }
  })

  it('never describes the offer as a percentage off or as lasting forever', () => {
    for (const phrase of ['30%', 'percent off', '% off', 'forever', 'for life', 'lifetime', 'locked in', 'every year', 'countdown', 'hurry', 'free $125', '$125 free', '$125 in free', 'free credit.']) {
      expect(allOfferCopy.toLowerCase(), phrase).not.toContain(phrase.toLowerCase())
    }
    expect(allOfferCopy).not.toContain('30% off')
    // "not all at once" is the one allowed use of the phrase, so it must be negated wherever it appears.
    expect(allOfferCopy.match(/all at once/g)?.length).toBe(allOfferCopy.match(/not all at once|delivered all at once\?/g)?.length)
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
  it('uses sentence case for the H1, every H2, every button label, and every FAQ question', () => {
    for (const page of pages) {
      const headings = [page.h1Line1, page.h1Line2, page.problem.title, page.featuresSection.title, page.demo.title, page.pricing.title, page.pricing.expiredTitle, page.faq.title, page.final.title, ...page.features.map((f) => f.title)]
      for (const label of [...headings, ...Object.values(page.cta)]) expect(isSentenceCase(label), label).toBe(true)
      for (const item of page.faq.items) expect(isSentenceCase(item.question), item.question).toBe(true)
      expect(new Set(page.faq.items.map((i) => i.id)).size).toBe(page.faq.items.length)
      // Every section has a one-sentence description.
      for (const lead of [page.problem.lead, page.featuresSection.lead, page.demo.body, page.pricing.lead, page.faq.lead]) expect(sentences(lead).length, lead).toBe(1)
    }
    for (const label of [BUCKS_PAGE.h1Line1, BUCKS_PAGE.h1Line2, BUCKS_PAGE.how.title, BUCKS_PAGE.rules.title, BUCKS_PAGE.final.title, ...Object.values(BUCKS_PAGE.cta), ...BUCKS_PAGE.how.steps.map((s) => s.title)]) expect(isSentenceCase(label), label).toBe(true)
    expect(isSentenceCase('Start My 7-Day Free Trial')).toBe(false)
  })

  it('keeps every paragraph to two sentences or fewer', () => {
    const paragraphs: string[] = []
    for (const page of pages) {
      paragraphs.push(page.subhead, ...Object.values(page.heroNote), page.problem.lead, page.demo.body, page.pricing.creditsNote, page.pricing.afterYearOne, page.final.body)
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
    expect(businessPage(true).switchPlan.after).toContain('$1,399')
    expect(agencyPage(true).switchPlan.after).toContain('$399')
  })
})
