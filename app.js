/* WARREN v5 — full-width scene previews. Escaped fields, one-shot render. */
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

  /* Scènes signature : la preview EST une page du site, en condensé. */
  function sceneHTML(s) {
    var t = s.preview && s.preview.type;
    var url = esc(s.url);

    if (t === "terminal") {
      var lignes = (s.preview.lines || []).map(function (l) {
        return '<p class="t"><b>' + esc(l[0]) + "</b> " + esc(l[1]) + "</p>";
      }).join("");
      var punch = esc(s.preview.punch || "");
      return (
        '<a class="scene scene-terminal" href="' + url + '" aria-hidden="true" tabindex="-1">' +
          '<div class="scanlines"></div>' +
          lignes +
          '<p class="t grand caret">&gt; ' + punch + "</p>" +
          '<span class="cta-hover">enter the terminal →</span>' +
        "</a>"
      );
    }

    if (t === "retro2003") {
      var digits = (s.preview.counter || "000001").split("").map(function (d) {
        return '<span class="d">' + esc(d) + "</span>";
      }).join("");
      return (
        '<a class="scene scene-2003" href="' + url + '" aria-hidden="true" tabindex="-1">' +
          '<p class="titre2003">::: WELCOME TO MY HOMEPAGE :::</p>' +
          '<div class="fen"><div class="barre"><span>welcome.htm — Internet Explorer</span><i>X</i></div>' +
          '<div class="contenu"><div class="digits">' + digits + "</div></div></div>" +
          '<p class="visiteur">YOU ARE VISITOR N°000001 — CONGRATULATIONS</p>' +
          '<span class="cta-hover">go back to 2003 →</span>' +
        "</a>"
      );
    }

    return '<div class="scene scene-none" aria-hidden="true">[ preview pending ]</div>';
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
        sceneHTML(s) +
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
          "<div>" +
            '<p class="label">notes from the lab</p>' +
            '<p class="pourquoi">' + esc(s.notes || "Field observations pending.") + "</p>" +
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
