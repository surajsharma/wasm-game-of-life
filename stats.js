javascript: (function () {
  var script = document.createElement("script");
  let controls = document.querySelector("#controls");
  script.onload = function () {
    var stats = new Stats();
    stats.domElement.setAttribute("id", "stats");
    controls.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = "https://mrdoob.github.io/stats.js/build/stats.min.js";
  controls.appendChild(script);
})();
