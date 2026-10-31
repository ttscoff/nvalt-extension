const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");

test("chrome and firefox builds expose Send to nvALT", function () {
  execFileSync(process.execPath, ["scripts/build.js", "chrome"], { cwd: root });
  execFileSync(process.execPath, ["scripts/build.js", "firefox"], { cwd: root });

  var chrome = JSON.parse(fs.readFileSync(path.join(root, "dist/chrome/manifest.json"), "utf8"));
  var firefox = JSON.parse(fs.readFileSync(path.join(root, "dist/firefox/manifest.json"), "utf8"));
  assert.equal(chrome.name, "Send to nvALT");
  assert.equal(chrome.manifest_version, 3);
  assert.deepEqual(chrome.permissions.sort(), ["activeTab", "scripting", "storage"]);
  assert.equal(firefox.name, "Send to nvALT");
  assert.equal(firefox.manifest_version, 2);
  assert.deepEqual(firefox.permissions.sort(), ["<all_urls>", "activeTab", "storage"]);
  assert.equal(firefox.browser_specific_settings.gecko.id, "send-to-nvalt@elasticthreads.net");

  var popup = fs.readFileSync(path.join(root, "dist/chrome/popup.html"), "utf8");
  assert.match(popup, /id="note-title"/);
  assert.match(popup, /id="readability"/);
  assert.match(popup, /id="markdownify-url"/);
  assert.match(popup, /id="markdownify-selection"/);
  assert.match(popup, /id="select-section"/);

  var content = fs.readFileSync(path.join(root, "dist/chrome/content-script.js"), "utf8");
  assert.match(content, /buildMarkdownifyURL/);
  assert.doesNotMatch(content, /x-marked-3/);
  assert.match(content, /Send to nvALT/);
  var background = fs.readFileSync(path.join(root, "dist/chrome/background.js"), "utf8");
  assert.match(background, /url\.js/);
});
