import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const versionPath = path.resolve(__dirname, '../public/version.json');
const pkgPath = path.resolve(__dirname, '../package.json');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const timestamp = new Date().toISOString();

const versionData = {
    version: pkg.version,
    timestamp: timestamp,
    buildId: Math.random().toString(36).substring(2, 9)
};

fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 4));
console.log(`SW: version.json updated with timestamp: ${timestamp}`);
