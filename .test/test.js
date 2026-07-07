const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  let filePath = path.join(root, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    const ext = path.extname(filePath);
    const type = ext === '.html' ? 'text/html' : ext === '.js' ? 'application/javascript' : 'text/plain';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
});

server.listen(8934, async () => {
  const browser = await chromium.launch({
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
      '--allow-file-access-from-files',
    ],
  });
  const context = await browser.newContext({ permissions: ['camera'] });
  const page = await context.newPage();

  const messages = [];
  page.on('console', (msg) => messages.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => messages.push(`[pageerror] ${err.message}`));

  await page.goto('http://localhost:8934/index.html');
  await page.waitForTimeout(8000);

  const state = await page.evaluate(() => {
    return {
      handCount: typeof handCount !== 'undefined' ? handCount : 'undefined',
      vidReady: typeof vidReady !== 'undefined' ? vidReady : 'undefined',
      overlayHidden: document.getElementById('overlay').classList.contains('hidden'),
      hudText: document.getElementById('hud-status').textContent,
      canvasSize: (() => {
        const c = document.querySelector('#sketch-holder canvas');
        return c ? `${c.width}x${c.height}` : 'no-canvas';
      })(),
      videoDims: (() => {
        const v = document.getElementById('webcam');
        return `${v.videoWidth}x${v.videoHeight}`;
      })(),
    };
  });

  console.log('---- console/page messages ----');
  messages.forEach((m) => console.log(m));
  console.log('---- page state ----');
  console.log(JSON.stringify(state, null, 2));

  await page.screenshot({ path: path.join(__dirname, 'screenshot.png') });

  await browser.close();
  server.close();
});
