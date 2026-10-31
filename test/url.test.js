const test = require("node:test");
const assert = require("node:assert/strict");
const { buildMarkdownifyURL } = require("../src/url.js");

test("builds a page URL with title and readability", function () {
  var result = buildMarkdownifyURL({
    html: "",
    pageURL: "https://brettterpstra.com/a b",
    title: "Web Excursions",
    readability: true
  });
  assert.equal(result.ok, true);
  assert.equal(
    result.url,
    "nvalt://markdownify?url=" +
      encodeURIComponent("https://brettterpstra.com/a b") +
      "&title=" +
      encodeURIComponent("Web Excursions") +
      "&readability=1"
  );
});

test("builds a selection URL and keeps the page as the source", function () {
  var result = buildMarkdownifyURL({
    html: "<p>Hi</p>",
    pageURL: "https://example.com/post",
    title: "Hi",
    readability: false
  });
  assert.equal(
    result.url,
    "nvalt://markdownify?html=" +
      encodeURIComponent("<p>Hi</p>") +
      "&url=" +
      encodeURIComponent("https://example.com/post") +
      "&title=" +
      encodeURIComponent("Hi") +
      "&readability=0"
  );
});

test("omits an empty title", function () {
  var result = buildMarkdownifyURL({
    html: "",
    pageURL: "https://example.com",
    title: "   ",
    readability: false
  });
  assert.equal(result.url, "nvalt://markdownify?url=https%3A%2F%2Fexample.com&readability=0");
});

test("rejects a URL longer than 1000000 characters", function () {
  var result = buildMarkdownifyURL({
    html: "x".repeat(1000000),
    pageURL: "https://example.com",
    title: "",
    readability: false
  });
  assert.equal(result.ok, false);
  assert.equal(result.error, "That selection is too large to send.");
});
