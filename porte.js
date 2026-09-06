/* KINETOPE — le rituel d'entrée. La porte s'ouvre à chaque visite. */
(function () {
  "use strict";

  var porte = document.getElementById("porte");
  var entrer = document.getElementById("entrer");
  var revoir = document.getElementById("revoir");
  if (!porte || !entrer) return;

  function ouvrir() {
    if (porte.classList.contains("ouverte")) return;
    porte.classList.add("ouverte");
    document.documentElement.classList.add("dedans");
    // focus dans la galerie pour la navigation clavier
    var hero = document.getElementById("galerie-top");
    if (hero) hero.setAttribute("tabindex", "-1"), hero.focus({ preventScroll: true });
  }

  entrer.addEventListener("click", function (e) {
    e.preventDefault();
    ouvrir();
    window.scrollTo(0, 0);
  });

  // espace ou Entrée n'importe où sur la porte = entrer
  document.addEventListener("keydown", function (e) {
    if (porte.classList.contains("ouverte")) return;
    if (e.key === " " || e.key === "Enter") {
      if (document.activeElement === document.body || document.activeElement === entrer) {
        e.preventDefault();
        ouvrir();
        window.scrollTo(0, 0);
      }
    }
  });

  // "revoir l'entrée" : referme la porte, rejoue le rideau
  if (revoir) {
    revoir.addEventListener("click", function (e) {
      e.preventDefault();
      porte.classList.remove("ouverte");
      document.documentElement.classList.remove("dedans");
      window.scrollTo(0, 0);
      var liens = porte.querySelectorAll(".pl");
      liens.forEach(function (l) { l.style.animation = "none"; });
      void liens[0].offsetWidth; // reflow pour rejouer les animations
      liens.forEach(function (l) { l.style.animation = ""; });
      var fiche = document.getElementById("entrer");
      if (fiche) fiche.focus({ preventScroll: true });
    });
  }
})();
