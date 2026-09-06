/* DERIVE — chat fantôme + titre répulsif + parallaxe. Vanilla, 0 dépendance, contenu figé dans le code (zéro maintenance). */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Chat fantôme : contenu en dur, rotation déterministe ---------- */
  var LIGNES = [
    ["anon_1997", "j'ai re-commencé un side project"],
    ["xX_pixel_Xx", "c'est pas un bug c'est une feature"],
    ["anon", "cp chez moi ça marche"],
    ["curieux_42", "source : je l'ai inventé"],
    ["anon_1997", "premier"],
    ["modérateur", "[deleted]"],
    ["xX_pixel_Xx", "gg wp"],
    ["curieux_42", "ça dépend"],
    ["anon", "fyi je guess"],
    ["modérateur", "verrouillé pour raisons de lucidité"]
  ];

  var chat = document.getElementById("chat");
  if (chat && !reduced) {
    var i = 0;
    var spawn = function () {
      var el = document.createElement("div");
      el.className = "ligne";
      var ligne = LIGNES[i % LIGNES.length];
      i++;
      var b = document.createElement("b");
      b.textContent = ligne[0] + " : ";
      el.appendChild(b);
      el.appendChild(document.createTextNode(ligne[1]));
      // position pseudo-aléatoire mais déterministe (cycle fixe)
      el.style.left = (8 + ((i * 37) % 70)) + "%";
      el.style.top = (12 + ((i * 53) % 70)) + "%";
      chat.appendChild(el);
      setTimeout(function () { el.remove(); }, 6200);
    };
    for (var k = 0; k < 4; k++) spawn();
    setInterval(spawn, 1500);
  }

  /* ---------- Titre répulsif ---------- */
  var lettres = Array.prototype.slice.call(document.querySelectorAll(".titre span"));
  var mx = -9999, my = -9999;

  if (lettres.length && !reduced) {
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
    }, { passive: true });

    var centre = [];
    var mesure = function () {
      centre = lettres.map(function (l) {
        var r = l.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      });
    };
    mesure();
    window.addEventListener("resize", mesure);

    var tick = function () {
      lettres.forEach(function (l, idx) {
        var dx = centre[idx][0] - mx;
        var dy = centre[idx][1] - my;
        var d = Math.hypot(dx, dy);
        var RAYON = 140;
        if (d < RAYON) {
          var force = (RAYON - d) / RAYON;
          l.style.transform = "translate(" + (dx / d * force * -40).toFixed(1) + "px," + (dy / d * force * -40).toFixed(1) + "px)";
          l.classList.add("proche");
        } else {
          l.style.transform = "";
          l.classList.remove("proche");
        }
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Révélation des salles ---------- */
  var salles = Array.prototype.slice.call(document.querySelectorAll(".salle"));
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
})();
