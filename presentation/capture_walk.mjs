import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMG = join(__dirname, 'images')
const WALK = 'http://localhost:5175'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
const p = await ctx.newPage()

await p.goto(`${WALK}/`, { waitUntil: 'networkidle' })
await p.waitForTimeout(800)

// 온보딩 → 산책 시작하기
try { await p.click('text=산책 시작하기', { timeout: 4000 }) } catch { console.log('start btn not found') }
await p.waitForTimeout(1400)
await p.screenshot({ path: join(IMG, 'walk_home.jpg'), type: 'jpeg', quality: 92 })

// 코스 선택 → 첫 코스 카드 → 상세(지도)
try {
  await p.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('button, a, [role="button"], [class*="card" i], [class*="course" i]'))
    const c = cards.find(el => el.offsetWidth > 150 && el.offsetHeight > 80)
    c && c.click()
  })
  await p.waitForTimeout(2600)
  await p.screenshot({ path: join(IMG, 'walk_detail.jpg'), type: 'jpeg', quality: 92 })
} catch (e) { console.log('detail nav failed', e.message) }

await browser.close()
console.log('done')
