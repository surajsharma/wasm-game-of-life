// A dependency graph that contains any wasm must all be imported
// asynchronously. This `bootstrap.js` file does the single async import, so
// that no one else needs to worry about it again.

(async () => {
  const stats = await import("./stats.js");
  const index = await import("./index.js");

  if (!stats || !index) {
    console.log("Error importing file.", stats || index);
  }
})();
