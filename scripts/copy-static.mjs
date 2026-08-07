import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

mkdirSync(dist, { recursive: true });

cpSync(join(root, 'manifest.json'), join(dist, 'manifest.json'));
cpSync(join(root, 'icons'), join(dist, 'icons'), { recursive: true });
cpSync(join(root, '_locales'), join(dist, '_locales'), { recursive: true });
cpSync(join(root, 'channels'), join(dist, 'channels'), { recursive: true });

console.log('Copied static assets to dist/');
