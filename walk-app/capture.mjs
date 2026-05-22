import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:5173'
const DIR = './screenshots'
mkdirSync(DIR, { recursive: true })

const screens = [
  { name: '01_onboarding', url: `${BASE}/?screen=onboarding` },
  { name: '02_home',       url: `${BASE}/?screen=home` },
  { name: '03_detail',     url: `${BASE}/?screen=detail&course=loop1` },
]

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
})

for (const s of screens) {
  const page = await context.newPage()
  await page.goto(s.url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  await page.screenshot({ path: `${DIR}/${s.name}.png`, fullPage: false })
  console.log(`✓ ${s.name}`)
  await page.close()
}

await browser.close()
console.log('Done — screenshots saved to ./screenshots/')
