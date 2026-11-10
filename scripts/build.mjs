import { cp, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const source = path.join(root, 'public');
const output = path.join(root, 'dist');
const mandatory = ['index.html', 'styles.css', 'app.js', 'data.js', 'matching.js'];
const files = await readdir(source);
for (const file of mandatory) {
  if (!files.includes(file)) throw new Error(`Missing required prototype file: ${file}`);
  const info = await stat(path.join(source, file));
  if (!info.size) throw new Error(`Empty prototype file: ${file}`);
}
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true, force: true });
console.log(`F2H static prototype built: ${mandatory.length} required files → dist/`);
