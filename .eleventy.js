const Image = require("@11ty/eleventy-img");
const path = require("path");

// Build-time image optimization. Accepts:
//   - remote URLs (http/https) — fetched and optimized
//   - repo-relative paths starting with "/uploads/..." (CMS uploads)
//   - other repo-relative paths
//
// Outputs <picture> with WebP + JPEG fallbacks and explicit dimensions.
async function imageShortcode(src, alt, sizes = "(min-width: 1024px) 1024px, 100vw", className = "") {
  if (!src) return "";

  let input = src;
  if (!/^https?:\/\//i.test(src) && src.startsWith("/")) {
    input = `.${src}`; // resolve "/uploads/foo.jpg" -> "./uploads/foo.jpg"
  }

  const metadata = await Image(input, {
    widths: [400, 800, 1200, "auto"],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/img/",
    urlPath: "/img/",
  });

  return Image.generateHTML(metadata, {
    alt: alt || "",
    sizes,
    class: className,
    loading: "lazy",
    decoding: "async",
  });
}

module.exports = function (eleventyConfig) {
  // Static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "uploads": "uploads" });

  // Watch CSS so dev server reloads on edits
  eleventyConfig.addWatchTarget("./src/assets/css/");

  // Image shortcode
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  // Useful filter for the JSON-LD block
  eleventyConfig.addFilter("jsonify", (obj) => JSON.stringify(obj));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
