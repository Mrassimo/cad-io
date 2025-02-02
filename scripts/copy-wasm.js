const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const publicDir = path.join(__dirname, '..', 'public');
const wasmDir = path.join(publicDir, 'wasm');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

if (!fs.existsSync(wasmDir)) {
  fs.mkdirSync(wasmDir);
}

// Copy WASM files
const sourceDir = path.join(__dirname, '..', 'node_modules', 'opencascade.js', 'dist');
const files = fs.readdirSync(sourceDir);

files.forEach(file => {
  if (file.endsWith('.wasm')) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(wasmDir, file);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to public/wasm/`);
  }
}); 