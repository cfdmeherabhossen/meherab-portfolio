import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', process.argv.includes('--dist') ? 'dist' : '.');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/meherab-portfolio') { response.writeHead(302, { Location: '/meherab-portfolio/' }).end(); return; }
    pathname = pathname.replace(/^\/meherab-portfolio\//, '/');
    if (pathname === '/') pathname = '/index.html';
    if (pathname !== '/index.html' && !pathname.startsWith('/assets/')) { response.writeHead(404).end('Not found'); return; }
    const target = resolve(root, '.' + pathname);
    if (!target.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const file = await stat(target);
    if (!file.isFile()) { response.writeHead(404).end(); return; }
    const headers = { 'Content-Type': types[extname(target).toLowerCase()] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' };
    let start = 0;
    let end = file.size - 1;
    if (request.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (!match || (!match[1] && !match[2])) { response.writeHead(416, { 'Content-Range': `bytes */${file.size}` }).end(); return; }
      if (!match[1]) start = Math.max(0, file.size - Number(match[2]));
      else { start = Number(match[1]); if (match[2]) end = Math.min(Number(match[2]), end); }
      if (start > end || start >= file.size) { response.writeHead(416, { 'Content-Range': `bytes */${file.size}` }).end(); return; }
      headers['Content-Range'] = `bytes ${start}-${end}/${file.size}`;
    }
    headers['Content-Length'] = end - start + 1;
    response.writeHead(request.headers.range ? 206 : 200, headers);
    if (request.method === 'HEAD') response.end();
    else createReadStream(target, { start, end }).on('error', () => response.destroy()).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Portfolio: http://127.0.0.1:${port}/meherab-portfolio/`));
