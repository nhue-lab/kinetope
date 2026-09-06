/* WARREN v4 — catalogue rendering + CSS-only previews. All fields escaped. */
(function () {
  "use strict";

  var galerie = document.getElementById("galerie");
  var status = document.getElementById("status");
  if (!galerie) return;

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function pad(n) { return (n < 10 ? "00" : n < 100 ? "0" : "") + n; }

  /* Miniatures en CSS pur : chaque type = un décor reconnaissable, 0 image. */
  function previewHTML(s) {
    var t = s.preview && s.preview.type;
    if (t === "terminal") {
      var lignes = (s.preview.lines || []).map(function (l) {
        return "<span><b>" + esc(l[0]) + "</b> " + esc(l[1]) + "</span>";
      }).join("");
      return '<div class="cadre mini-term" aria-hidden="true">' +
        lignes +
        '<span class="caret-ligne">&gt; </span></div>';
    }
    if (t === "retro2003") {
      var digits = (s.preview.counter || "000001").split("").map(function (d) {
        return '<span class="d">' + esc(d) + "</span>";
      }).join("");
      return '<div class="cadre mini-2003" aria-hidden="true">' +
        '<div class="fen"><div class="barre"><span>welcome.htm</span><i>X</i></div></div>' +
        '<div class="digits">' + digits + "</div>" +
        '<p class="blink">UNDER CONSTRUCTION SINCE 2003</p></div>';
    }
    return '<div class="cadre mini-none" aria-hidden="true">[ preview pending ]</div>';
  }

  function ficheHTML(s, idx) {
    var ref = "SPEC-" + pad(idx + 1);
    var observed = s.observed || s.year || "";

    var exhibits = (s.exhibits || []).map(function (p) {
      return '<li><a href="' + esc(p.url) + '">' + esc(p.name) + "</a></li>";
    }).join("");

    var tags = (s.tags || []).map(function (t) {
      return "<span>" + esc(t) + "</span>";
    }).join("") + (s.easter_eggs ? "<span>easter eggs ✓</span>" : "");

    return (
      '<article class="fiche">' +
        '<div class="tete">' +
          '<span class="ref">' + esc(ref) + "</span>" +
          "<h2>" + esc(s.title) + "</h2>" +
          '<span class="obs">obs. ' + esc(observed) + "</span>" +
        "</div>" +
        '<div class="corps">' +
          "<div>" +
            '<p class="label">mechanism</p>' +
            "<p>" + esc(s.mechanism) + "</p>" +
            '<p class="label" style="margin-top:1.2rem">why it&#39;s here</p>' +
            '<p class="pourquoi">' + esc(s.why_here) + "</p>" +
            '<p class="label data">specimen data</p>' +
            "<p>" + esc(s.subtitle || "") + " · " + esc(s.year) +
              " · " + esc(s.weight_kb) + " KB · " + esc(s.type) + "</p>" +
          "</div>" +
          '<div class="visuel">' +
            '<p class="label">preview</p>' +
            previewHTML(s) +
          "</div>" +
        "</div>" +
        '<div class="pied">' +
          '<div class="tags">' + tags + "</div>" +
          (exhibits ? '<ul class="exhibits">' + exhibits + "</ul>" : "") +
          '<a class="cta" href="' + esc(s.url) + '">enter →</a>' +
        "</div>" +
      "</article>"
    );
  }

  fetch("catalogue.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      var sites = data.sites || [];
      if (!sites.length) {
        galerie.textContent = "> empty catalogue. the warren awaits its first resident.";
        status.textContent = "> status: 0 specimens catalogued";
        return;
      }
      galerie.innerHTML = sites.map(ficheHTML).join("");

      var last = sites[sites.length - 1];
      var date = last.observed || last.year || "n/a";
      status.innerHTML =
        "&gt; status: <b>" + sites.length + "</b> specimen" +
        (sites.length > 1 ? "s" : "") + " catalogued — last entry <b>" + esc(date) + "</b>";
    })
    .catch(function () {
      galerie.textContent = "";
      status.textContent = "> status: catalogue unreachable. even warrens have rats.";
    });
})();
