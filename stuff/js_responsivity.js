// responzivní interface
var functionR() {
  var bodyEl = document.getElementById("body");
  bodyEl.style.width = 0.9*window.innerWidth + "px";
  bodyEl.style.height = 0.9*window.innerHeight + "px";
};
var responsivity = window.setInterval(functionR, 10);
