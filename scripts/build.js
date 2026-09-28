import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

// Clean and recreate public/
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true, force: true });
}
fs.mkdirSync(publicDir, { recursive: true });

// Copy static entrypoints
fs.copyFileSync(path.join(rootDir, 'workshop.html'), path.join(publicDir, 'workshop.html'));
fs.copyFileSync(path.join(rootDir, 'workshop.html'), path.join(publicDir, 'index.html'));
fs.copyFileSync(path.join(rootDir, 'notes.html'), path.join(publicDir, 'notes.html'));
fs.mkdirSync(path.join(publicDir, 'notes'), { recursive: true });
fs.copyFileSync(path.join(rootDir, 'notes.html'), path.join(publicDir, 'notes', 'index.html'));

// Copy directories recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.endsWith('.bak') || entry.name.endsWith('.tmp') || entry.name.startsWith('.')) {
      continue;
    }
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(path.join(rootDir, 'src'), path.join(publicDir, 'src'));
if (fs.existsSync(path.join(rootDir, 'partner-research-skill'))) {
  copyDir(path.join(rootDir, 'partner-research-skill'), path.join(publicDir, 'partner-research-skill'));
}

console.log('✅ Built public/ distribution directory successfully.');
