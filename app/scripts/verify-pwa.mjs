/**
 * Dist artifact check after `vite build`: standalone manifest, 192/512 PNG
 * icons, and a Workbox service worker that mentions `index.html`.
 * This is not a runtime offline test. Manual install + offline reload is in
 * app/README.md.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

function fail(message) {
  console.error(`PWA verify failed: ${message}`)
  process.exit(1)
}

for (const name of ['index.html', 'manifest.webmanifest', 'sw.js']) {
  if (!existsSync(join(dist, name))) fail(`missing dist/${name}`)
}

const manifest = JSON.parse(
  readFileSync(join(dist, 'manifest.webmanifest'), 'utf8'),
)
if (manifest.display !== 'standalone') {
  fail(`display is ${manifest.display}, expected standalone`)
}
if (!manifest.start_url) fail('manifest is missing start_url')
const pngIcons = (manifest.icons ?? []).filter(
  (icon) => icon.type === 'image/png' && /\b(192x192|512x512)\b/.test(icon.sizes),
)
if (pngIcons.length < 2) {
  fail('manifest needs 192 and 512 PNG icons')
}

const sw = readFileSync(join(dist, 'sw.js'), 'utf8')
if (!sw.includes('precacheAndRoute') && !sw.includes('precache')) {
  fail('service worker does not look like a Workbox precache')
}
if (!sw.includes('index.html')) {
  fail('service worker does not mention index.html (offline shell)')
}

const index = readFileSync(join(dist, 'index.html'), 'utf8')
if (!index.includes('manifest.webmanifest') && !index.includes('rel="manifest"')) {
  fail('index.html does not link the web app manifest')
}

console.log('PWA verify: dist has standalone manifest, 192/512 PNG icons, and a Workbox SW.')
