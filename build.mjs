// 建置腳本：編譯 Tailwind CSS 並內嵌，再依內嵌 script 計算 CSP 雜湊
// 用法：node build.mjs   （需要 Node.js；第一次執行會透過 npx 下載 tailwindcss@3.4.17）
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const srcPath = join(root, 'src', 'player.src.html');
const outPath = join(root, 'index.html'); // GitHub Pages 預設首頁

const tmp = mkdtempSync(join(tmpdir(), 'mp3-build-'));
try {
  const inCss = join(tmp, 'in.css');
  const outCss = join(tmp, 'out.css');
  writeFileSync(inCss, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
  const q = (p) => `"${p.replace(/"/g, '')}"`;
  execSync(`npx --yes tailwindcss@3.4.17 -i ${q(inCss)} -o ${q(outCss)} --content ${q(srcPath)} --minify`,
    { stdio: 'inherit' });
  const css = readFileSync(outCss, 'utf8').replace(/<\/style/gi, '<\\/style');

  let html = readFileSync(srcPath, 'utf8').replace('/*__TAILWIND__*/', () => css);

  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const hashes = scripts.map((s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`);

  const csp = [
    "default-src 'none'",
    `script-src ${hashes.join(' ')}`,
    "style-src 'unsafe-inline'",
    'media-src blob:',
    'img-src data:',
    "base-uri 'none'",
    "form-action 'none'"
  ].join('; ');

  html = html.replace('__CSP__', csp);
  writeFileSync(outPath, html);
  console.log(`已輸出 ${outPath}（CSS ${css.length} bytes，script 雜湊 ${hashes.length} 個）`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
