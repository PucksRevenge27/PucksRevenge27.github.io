// Particles.js config (inline)
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#00ffd0" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.3 },
    "size": { "value": 4, "random": true },
    "line_linked": { "enable": true, "distance": 130, "color": "#00ffd0", "opacity": 0.35, "width": 1 },
    "move": { "enable": true, "speed": 2, "direction": "none", "out_mode": "bounce" }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "repulse" },
      "onclick": { "enable": true, "mode": "push" },
    },
    "modes": {
      "repulse": { "distance": 120, "duration": 0.4 },
      "push": { "particles_nb": 4 }
    }
  },
  "retina_detect": true
});
