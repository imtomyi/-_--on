import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const htmlPath = 'file://' + join(__dirname, 'deck.html')
const out = join(__dirname, '행궁동_막걸리산책_중간발표.pdf')

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(htmlPath, { waitUntil: 'networkidle' })
await page.emulateMedia({ media: 'print' })
await page.pdf({
  path: out,
  width: '1280px',
  height: '720px',
  printBackground: true,
  pageRanges: '1-10',
})
await browser.close()
console.log('PDF written:', out)
