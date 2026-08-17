import * as fs from 'fs';
import * as path from 'path';

const projectRoot = path.resolve(__dirname, '..');
const distNgAddDir = path.join(projectRoot, 'dist/ng-add');
const srcNgAddDir = path.join(projectRoot, 'src/ng-add');

export function copyAssets(): void {
  console.log('📦 Packaging assets for ngx-playwright-schematics distribution...');

  fs.mkdirSync(distNgAddDir, { recursive: true });

  // Copy schema.json
  const schemaSrc = path.join(srcNgAddDir, 'schema.json');
  const schemaDest = path.join(distNgAddDir, 'schema.json');
  if (fs.existsSync(schemaSrc)) {
    fs.copyFileSync(schemaSrc, schemaDest);
  }

  // Copy files recursive
  const filesSrc = path.join(srcNgAddDir, 'files');
  const filesDest = path.join(distNgAddDir, 'files');
  if (fs.existsSync(filesSrc)) {
    copyRecursive(filesSrc, filesDest);
  }

  console.log('✅ Asset packaging complete.');
}

function copyRecursive(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (require.main === module) {
  copyAssets();
}
