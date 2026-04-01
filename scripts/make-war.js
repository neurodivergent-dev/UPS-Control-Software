import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createWar() {
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  const outputFile = path.join(rootDir, 'dist.war');

  const output = fs.createWriteStream(outputFile);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', () => {
    console.log(`\x1b[32m✔ Project packaged: ${outputFile}\x1b[0m`);
    console.log(`\x1b[32m✔ Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB\x1b[0m`);
  });

  archive.on('error', (err) => { throw err; });
  archive.pipe(output);

  // Add the dist directory contents
  if (fs.existsSync(distDir)) {
    archive.directory(distDir, false);
  } else {
    console.error(`\x1b[31m✘ Error: ${distDir} not found!\x1b[0m`);
  }

  await archive.finalize();
}

createWar().catch(console.error);
