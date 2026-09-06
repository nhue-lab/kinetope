/* WARREN v3 — catalogue rendering. All JSON fields HTML-escaped before injection. */
(function () {
  "use strict";

  var galerie = document.getElementById("galerie");
  var status = document.getElementById("status");
  if (!galerie) return;

  // Escape every dynamic string — the catalogue is ours, but robustness is not optional.
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function pad(n) { return (n < 10 ? "00" : n < 100 ? "0" : "") + n; }

  function ficheHTML(s, idx, total) {
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
          "</div>" +
          "<div>" +
            '<p class="label">why it&#39;s here</p>' +
            '<p class="pourquoi">' + esc(s.why_here) + "</p>" +
            '<p class="label" style="margin-top:1.2rem">specimen data</p>' +
            "<p>" + esc(s.subtitle || "") + " · " + esc(s.year) +
              " · " + esc(s.weight_kb) + " KB · " + esc(s.type) + "</p>" +
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

      var html = sites.map(function (s, idx) {
        return ficheHTML(s, idx, sites.length);
      }).join("");

      // One shot: gallery is static after render (no aria-live chatter).
      galerie.innerHTML = html;

      // Instrumentation line: deterministic, derived from the data itself.
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
