/**
 * Generates the web logo assets from the master artwork.
 *
 *   npm run logo:assets
 *
 * Reads  : logo/1000361674.jpg
 * Writes : public/logo.png     the complete logo, used in the header + footer
 *          public/favicon.png  the complete logo, squared for the browser tab
 *          public/og.png       the complete logo on a 1200x630 share card
 *
 * The logo is never cropped. The only thing removed is the blank paper around
 * the artwork (`.trim()`), which is what lets it render larger on the page.
 * Everything else just resizes or pads it onto a bigger canvas.
 *
 * Replace the file in logo/ and re-run to update all three.
 */
import sharp from 'sharp'

const SRC = 'logo/1000361674.jpg'
const IVORY = '#fcfaf7' // the site background, so padding is invisible

// Remove the empty margin around the artwork. Nothing inside the logo is cut.
const logo = await sharp(SRC).trim({ threshold: 12 }).toBuffer()
const { width, height } = await sharp(logo).metadata()
const srcMeta = await sharp(SRC).metadata()
console.log(`source  : ${srcMeta.width}x${srcMeta.height}`)
console.log(`artwork : ${width}x${height} after removing the blank margin`)

// 1. The complete logo. 320px tall covers a ~80px display size at 4x density.
await sharp(logo)
  .resize({ height: 320, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile('public/logo.png')
console.log('wrote public/logo.png')

// 2. Favicon: the whole logo centred on a square. Padded, not cropped, so the
//    wordmark and tagline are still there.
const side = Math.round(Math.max(width, height) * 1.06)
const squared = await sharp({
  create: { width: side, height: side, channels: 3, background: IVORY },
})
  .composite([
    {
      input: await sharp(logo)
        .resize({ width: Math.round(side * 0.92), withoutEnlargement: true })
        .toBuffer(),
      gravity: 'center',
    },
  ])
  .png()
  .toBuffer()

await sharp(squared).resize(256, 256).png({ compressionLevel: 9 }).toFile('public/favicon.png')
console.log('wrote public/favicon.png')

// 3. Share card for link previews.
await sharp({ create: { width: 1200, height: 630, channels: 3, background: IVORY } })
  .composite([
    {
      input: await sharp(logo).resize({ width: 760, withoutEnlargement: true }).toBuffer(),
      gravity: 'center',
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile('public/og.png')
console.log('wrote public/og.png')
