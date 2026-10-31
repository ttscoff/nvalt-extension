const test = require("node:test");
const assert = require("node:assert/strict");
const { cleanNoteTitle, siteNamesFor } = require("../src/title.js");

test("drops a trailing site name", function () {
  assert.equal(cleanNoteTitle("Article | Brett Terpstra", ["Brett Terpstra"]), "Article");
});

test("drops a leading site name", function () {
  assert.equal(cleanNoteTitle("Brett Terpstra | Article", ["Brett Terpstra"]), "Article");
});

test("keeps a hyphen inside a word", function () {
  assert.equal(cleanNoteTitle("A well-known title", ["Example"]), "A well-known title");
});

test("keeps the original separators when nothing matches", function () {
  assert.equal(cleanNoteTitle("Hello | World", ["Other"]), "Hello | World");
});

test("og:site_name is enough to identify the site piece", function () {
  assert.equal(cleanNoteTitle("Post | Example Blog", ["Example Blog"]), "Post");
});

test("a www hostname supplies the domain and the site label", function () {
  assert.deepEqual(siteNamesFor(null, "www.brettterpstra.com"), [
    "brettterpstra.com",
    "brettterpstra"
  ]);
  assert.equal(
    cleanNoteTitle("Article | brettterpstra.com", siteNamesFor(null, "www.brettterpstra.com")),
    "Article"
  );
});

test("a first label shorter than 4 characters is not a site name", function () {
  assert.deepEqual(siteNamesFor(null, "ab.co"), ["ab.co"]);
});

test("keeps the original title when every piece matches", function () {
  assert.equal(
    cleanNoteTitle("Brett Terpstra | brettterpstra.com", [
      "Brett Terpstra",
      "brettterpstra.com",
      "brettterpstra"
    ]),
    "Brett Terpstra | brettterpstra.com"
  );
});

test("joins the remaining pieces in order", function () {
  assert.equal(
    cleanNoteTitle("Part One | Part Two | Example", ["Example"]),
    "Part One - Part Two"
  );
});
