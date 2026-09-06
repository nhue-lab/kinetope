/* DERIVE — micro-interactions. Vanilla, déterministe, ~100 lignes. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return; // no-op total : le site reste lisible via CSS

  // Curseur vivant : lerp sur rAF, position pure du temps
  var curseur = document.createElement("div");
  curseur.id = "curseur";
  document.body.appendChild(curseur);

  var mx = -100, my = -100;   // cible (souris)
  var cx = -100, cy = -100;   // position courante (lerp)

  document.addEventListener("mousemove", function (e) {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  // Parallaxe : scroll lu dans la boucle rAF, pas dans l'événement
  var salles = Array.prototype.slice.call(document.querySelectorAll(".salle"));
  var hero = document.querySelector(".hero");

  // Révélation au scroll — IntersectionObserver, une seule classe
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    salles.forEach(function (s) { io.observe(s); });
  } else {
    salles.forEach(function (s) { s.classList.add("visible"); });
  }

  // Boucle unique : curseur (lerp) + parallaxe subtile du hero
  function boucle() {
    // lerp déterministe : position = fonction de la position précédente
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    curseur.style.transform = "translate3d(" + (cx - 12) + "px," + (cy - 12) + "px,0)";

    if (hero) {
      var y = window.scrollY || 0;
      hero.style.transform = "translate3d(0," + (y * 0.3) + "px,0)";
    }
    requestAnimationFrame(boucle);
  }
  requestAnimationFrame(boucle);
})();
