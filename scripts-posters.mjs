// Renders a transparent WebP poster per specimen from its GLB. Usage: node scripts-posters.mjs [id ...]
import { chromium } from '/Users/sammartanom/Documents/SCIENCE/repo/scripts/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const data = JSON.parse(html.match(/<script[^>]*id="specimen-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
const only = process.argv.slice(2);
const todo = data.filter(s => !only.length || only.includes(s.id));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
const queue = todo.slice();
async function worker() {
  const p = await b.newPage({ viewport: { width: 600, height: 600 } });
  await p.setContent('<html><head><meta name="viewport" content="width=device-width"></head><body style="margin:0;background:transparent"><script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script></body></html>');
  while (queue.length) {
    const s = queue.shift();
    const t0 = Date.now();
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const arr = await p.evaluate(async (src) => {
          await customElements.whenDefined('model-viewer');
          customElements.get('model-viewer').minimumRenderScale = 1;
          document.querySelectorAll('model-viewer').forEach(n => n.remove());
          const mv = document.createElement('model-viewer');
          mv.setAttribute('src', src); mv.setAttribute('camera-orbit', '30deg 72deg auto'); mv.setAttribute('exposure', '1'); mv.setAttribute('shadow-intensity', '0');
          mv.style.cssText = 'width:600px;height:600px;background:transparent;--poster-color:transparent';
          document.body.appendChild(mv);
          await new Promise((ok, no) => { mv.addEventListener('load', ok, { once: true }); mv.addEventListener('error', () => no(new Error('load error')), { once: true }); setTimeout(() => no(new Error('timeout')), 420000); });
          await new Promise(r => setTimeout(r, 1500));
          const blob = await mv.toBlob({ mimeType: 'image/webp', qualityArgument: 0.88 });
          return Array.from(new Uint8Array(await blob.arrayBuffer()));
        }, 'https://models.mikesammartano.com/' + s.glb);
        fs.writeFileSync(new URL('./static/posters/' + s.id + '.webp', import.meta.url), Buffer.from(arr));
        console.log('ok', s.id, arr.length, (Date.now() - t0) + 'ms');
        break;
      } catch (e) { console.log('fail', s.id, attempt, String(e).slice(0, 80)); }
    }
  }
}
await Promise.all([worker(), worker()]);
await b.close();
