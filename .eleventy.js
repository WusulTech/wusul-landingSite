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

  // Cache-busting token for CSS/JS links: unique per build/deploy
  eleventyConfig.addGlobalData("buildId", Date.now().toString(36));

  // Inline SVG icons: {% icon "whatsapp" %}
  eleventyConfig.addShortcode("icon", require("./lib/icons.js"));

  // Bootstrap 4.6.2 CSS trimmed to the selectors our pages actually use
  // (~158KB -> a few KB). Classes added only by JS must be safelisted.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const { PurgeCSS } = require("purgecss");
    const [result] = await new PurgeCSS().purge({
      content: [`${dir.output}/**/*.html`, "js/**/*.js"],
      css: [require.resolve("bootstrap/dist/css/bootstrap.min.css")],
      safelist: ["show", "collapse", "collapsing", "open", "loaded", "is-success", "is-error"],
    });
    fs.mkdirSync(`${dir.output}/css/vendor`, { recursive: true });
    fs.writeFileSync(`${dir.output}/css/vendor/bootstrap.min.css`, result.css);
  });

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
