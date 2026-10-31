#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "dist", "chrome");
const targetDir = path.resolve(rootDir, "..", "nv", "SafariExtension", "Resources");

function copyRecursive(src, dest) {
  var baseName = path.basename(src);
  if (baseName === ".DS_Store" || baseName.indexOf("._") === 0) {
    return;
  }
  var stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function (entry) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    });
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

if (!fs.existsSync(sourceDir)) {
  console.error("Source build directory not found: " + sourceDir);
  console.error("Run npm run build:chrome first.");
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
copyRecursive(sourceDir, targetDir);
fs.copyFileSync(path.join(sourceDir, "content-script.js"), path.join(targetDir, "content.js"));
console.log("Synced Chrome build to " + targetDir);
