/**
 * Generates the web logo assets from the master artwork.
 *
 *   npm install --no-save sharp
 *   node scripts/generate-logo-assets.mjs
 *
 * Reads  : logo/1000361674.jpg  (the full lockup on a white background)
 * Writes : public/logo.png      trimmed lockup, for the header and footer
 *          public/favicon.png   the icon mark only, squared, for the browser tab
 *          public/og.png        1200x630 share card on the site's ivory
 *
 * Swap the source file and re-run; the crops are detected, not hardcoded.
 */
import sharp from 'sharp'

const SRC = 'logo/1000361674.jpg'
const INK = 235 // grey level below which a pixel counts as artwork, not paper

// 1. Trim the flat white surround.
const trimmed = await sharp(SRC).trim({ threshold: 12 }).toBuffer()
const { width, height } = await sharp(trimmed).metadata()
console.log(`trimmed lockup: ${width}x${height}`)

// 2. Locate the icon mark.
//    The mark is narrow and centred; the wordmark underneath spans nearly the
//    full width. So the first row whose ink reaches near the left edge marks
//    the top of the wordmark, and everything above that is the icon.
const { data } = await sharp(trimmed).greyscale().raw().toBuffer({ resolveWithObject: true })

const rowBounds = (y) => {
  let left = -1
  let right = -1
  for (let x = 0; x < width; x++) {
    if (data[y * width + x] < INK) {
      if (left < 0) left = x
      right = x
    }
  }
  return [left, right]
}

const LEFT_EDGE = Math.round(width * 0.14)
let wordmarkTop = height
for (let y = 0; y < height; y++) {
  const [l] = rowBounds(y)
  if (l >= 0 && l < LEFT_EDGE) {
    wordmarkTop = y
    break
  }
}

let left = width
let right = 0
let top = -1
let bottom = 0
for (let y = 0; y < wordmarkTop; y++) {
  const [l, r] = rowBounds(y)
  if (l < 0) continue
  if (top < 0) top = y
  bottom = y
  if (l < left) left = l
  if (r > right) right = r
}
const markBox = { left, top, width: right - left + 1, height: bottom - top + 1 }
console.log(`icon mark: ${markBox.width}x${markBox.height} at ${markBox.left},${markBox.top}`)

// 3. Full lockup. Capped height keeps it crisp on retina without a huge file.
await sharp(trimmed)
  .resize({ height: 240, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile('public/logo.png')
console.log('wrote public/logo.png')

// 4. Icon mark on its own, cropped tight. The header is only 80px tall, so the
//    stacked lockup's wordmark would be unreadable there — the header pairs
//    this mark with live "Jeevon" text instead.
await sharp(trimmed)
  .extract(markBox)
  .resize({ height: 160, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile('public/logo-mark.png')
console.log('wrote public/logo-mark.png')

// 5. Favicon: the mark, squared up with a little breathing room.
//    Two passes, because sharp resizes before compositing in one pipeline.
const mark = await sharp(trimmed).extract(markBox).toBuffer()
const side = Math.max(markBox.width, markBox.height)
const pad = Math.round(side * 0.1)
const squared = await sharp({
  create: {
    width: side + pad * 2,
    height: side + pad * 2,
    channels: 4,
    background: { r: 252, g: 250, b: 247, alpha: 1 }, // site ivory
  },
})
  .composite([{ input: mark, gravity: 'center' }])
  .png()
  .toBuffer()

await sharp(squared).resize(256, 256).png({ compressionLevel: 9 }).toFile('public/favicon.png')
console.log('wrote public/favicon.png')

// 6. Share card for link previews.
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#fcfaf7' } })
  .composite([
    {
      input: await sharp(trimmed).resize({ width: 720, withoutEnlargement: true }).toBuffer(),
      gravity: 'center',
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile('public/og.png')
console.log('wrote public/og.png')
