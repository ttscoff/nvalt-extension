#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const target = process.argv[2];
if (!target || ["chrome", "firefox"].indexOf(target) === -1) {
  console.error("Usage: node scripts/build.js <chrome|firefox>");
  process.exit(1);
}

const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const distDir = path.join(rootDir, "dist", target);
const iconsDistDir = path.join(distDir, "icons");
const zipPath = path.join(rootDir, "dist", "nvalt-" + target + ".zip");

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(iconsDistDir, { recursive: true });

["background.js", "content-script.js", "popup.js", "popup.css", "popup.html", "title.js", "url.js"].forEach(function (file) {
  fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
});

fs.readdirSync(path.join(rootDir, "icons"))
  .filter(function (name) { return name.toLowerCase().endsWith(".png"); })
  .forEach(function (name) {
    fs.copyFileSync(path.join(rootDir, "icons", name), path.join(iconsDistDir, name));
  });

var manifestSrc = target === "chrome"
  ? path.join(srcDir, "manifest.chrome.json")
  : path.join(srcDir, "manifest.firefox.json");
fs.copyFileSync(manifestSrc, path.join(distDir, "manifest.json"));

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}
execSync('cd "' + distDir + '" && zip -r "' + zipPath + '" . -x "*.DS_Store"', { stdio: "ignore" });
console.log("Built " + target + " extension into " + distDir);
