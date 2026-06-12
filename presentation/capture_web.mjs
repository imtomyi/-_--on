import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMG = join(__dirname, 'images')
const GYEBO = 'http://localhost:5173'
const WALK  = 'http://localhost:5175'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })

async function shot(name) {
  const p = await ctx.newPage()
  return p
}

// 1) walk-app — 코스 선택(홈)
{
  const p = await ctx.newPage()
  await p.goto(`${WALK}/?screen=home`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)
  await p.screenshot({ path: join(IMG, 'walk_home.jpg'), type: 'jpeg', quality: 92 })
  // 코스 상세(지도)
  await p.goto(`${WALK}/?screen=detail&course=loop1`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(2200)
  await p.screenshot({ path: join(IMG, 'walk_detail.jpg'), type: 'jpeg', quality: 92 })
  await p.close()
}

// 2) gyebo-web — 취향 테스트(항아리)
{
  const p = await ctx.newPage()
  await p.goto(`${GYEBO}/`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(600)
  // 계보 보기
  await p.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button,a')).find(e => /계보\s*보기/.test(e.textContent))
    b && b.click()
  })
  await p.waitForTimeout(700)
  // 취향
  await p.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(e => e.textContent.trim() === '취향')
    b && b.click()
  })
  await p.waitForTimeout(1400)
  await p.screenshot({ path: join(IMG, 'gyebo_taste.jpg'), type: 'jpeg', quality: 92 })
  await p.close()
}

await browser.close()
console.log('captured: walk_home, walk_detail, gyebo_taste')
