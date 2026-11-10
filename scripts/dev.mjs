import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const base = path.resolve('public');
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png' };
const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const target = path.resolve(base, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!(target === base || target.startsWith(base + path.sep))) {res.writeHead(403);res.end('Forbidden');return;}
  try { const info = await stat(target);if(!info.isFile())throw Error('Not file'); const buf=await readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(buf); }
  catch { res.writeHead(404);res.end('Not Found'); }
});
server.listen(Number(process.env.PORT||4173), '0.0.0.0', () => console.log('Prototype local dev: http://localhost:'+String(process.env.PORT||4173)));
