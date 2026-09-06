/* TERRIER — rendu du catalogue figé. Un fetch local, zéro transformation mystérieuse. */
(function () {
  "use strict";

  var galerie = document.getElementById("galerie");
  if (!galerie) return;

  fetch("catalogue.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      if (!data.sites || !data.sites.length) {
        galerie.textContent = "> catalogue vide. le terrier attend son premier locataire.";
        return;
      }
      data.sites.forEach(function (s, idx) {
        var fiche = document.createElement("article");
        fiche.className = "fiche";

        var num = String(idx + 1);
        var pieces = (s.pieces || []).map(function (p) {
          return '<li><a href="' + p.url + '">' + p.nom + "</a></li>";
        }).join("");

        fiche.innerHTML =
          '<div class="identite">' +
            '<span class="num">SITE ' + num + " / " + data.sites.length + "</span>" +
            "<h2>" + s.titre + "</h2>" +
            '<p class="sous">' + (s.sous_titre || "") + "</p>" +
            '<p class="meta"><b>' + s.annee + "</b> · " + s.auteur +
              " · " + s.poids_ko + " Ko · " + s.type + "</p>" +
            '<div class="tags">' +
              (s.tags || []).map(function (t) { return "<span>" + t + "</span>"; }).join("") +
              (s.easter_eggs ? '<span>easter eggs ✓</span>' : "") +
            "</div>" +
          "</div>" +
          '<div class="corps">' +
            '<p class="label">mécanique</p>' +
            '<p class="mecanique">' + s.mecanique + "</p>" +
            '<p class="label">pourquoi c&apos;est ici</p>' +
            '<p class="pourquoi">' + s.pourquoi + "</p>" +
            (pieces ? '<p class="label">pièces</p><ul class="pieces">' + pieces + "</ul>" : "") +
            '<a class="cta" href="' + s.url + '">entrer →</a>' +
          "</div>";

        galerie.appendChild(fiche);
      });
    })
    .catch(function () {
      galerie.textContent = "> catalogue introuvable. même les terriers ont des rats.";
    });
})();
