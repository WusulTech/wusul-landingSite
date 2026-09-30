const fs = require("fs");

module.exports = function (eleventyConfig) {
  // style.css stays the single list of stylesheets (@import order), but pages
  // link each file directly so the browser fetches them in parallel instead
  // of discovering them one @import at a time.
  eleventyConfig.addGlobalData("cssFiles", () =>
    [...fs.readFileSync("css/style.css", "utf8").matchAll(/@import\s+url\("([^"]+)"\)/g)]
      .map((m) => "css/" + m[1])
  );
  eleventyConfig.addWatchTarget("css/style.css");

  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add(".zip-review/**");

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    templateFormats: ["njk", "html", "md"],
  };
};
