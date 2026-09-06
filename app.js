/* WARREN — rendering of the fixed catalogue. One local fetch, nothing mysterious. */
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
        galerie.textContent = "> empty catalogue. the warren awaits its first resident.";
        return;
      }
      data.sites.forEach(function (s, idx) {
        var fiche = document.createElement("article");
        fiche.className = "fiche";

        var num = String(idx + 1);
        var exhibits = (s.exhibits || []).map(function (p) {
          return '<li><a href="' + p.url + '">' + p.name + "</a></li>";
        }).join("");

        fiche.innerHTML =
          '<div class="identite">' +
            '<span class="num">SITE ' + num + " / " + data.sites.length + "</span>" +
            "<h2>" + s.title + "</h2>" +
            '<p class="sous">' + (s.subtitle || "") + "</p>" +
            '<p class="meta"><b>' + s.year + "</b> · " + s.author +
              " · " + s.weight_kb + " KB · " + s.type + "</p>" +
            '<div class="tags">' +
              (s.tags || []).map(function (t) { return "<span>" + t + "</span>"; }).join("") +
              (s.easter_eggs ? '<span>easter eggs ✓</span>' : "") +
            "</div>" +
          "</div>" +
          '<div class="corps">' +
            '<p class="label">mechanism</p>' +
            '<p class="mecanique">' + s.mechanism + "</p>" +
            '<p class="label">why it&apos;s here</p>' +
            '<p class="pourquoi">' + s.why_here + "</p>" +
            (exhibits ? '<p class="label">exhibits</p><ul class="pieces">' + exhibits + "</ul>" : "") +
            '<a class="cta" href="' + s.url + '">enter →</a>' +
          "</div>";

        galerie.appendChild(fiche);
      });
    })
    .catch(function () {
      galerie.textContent = "> catalogue unreachable. even warrens have rats.";
    });
})();
