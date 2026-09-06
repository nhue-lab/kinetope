/* DERIVE — chat fantôme + titre répulsif + terminal narratif + lapin */
(function () {
  "use strict";

  // L'histoire recommence à zéro : jamais de restauration de scroll au refresh.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Chat fantôme (contenu figé, rotation déterministe) ---------- */
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
      var l = LIGNES[i % LIGNES.length]; i++;
      var b = document.createElement("b");
      b.textContent = l[0] + " : ";
      el.appendChild(b);
      el.appendChild(document.createTextNode(l[1]));
      el.style.left = (8 + ((i * 37) % 70)) + "%";
      el.style.top = (12 + ((i * 53) % 70)) + "%";
      chat.appendChild(el);
      setTimeout(function () { el.remove(); }, 6200);
    };
    for (var k = 0; k < 4; k++) spawn();
    setInterval(spawn, 1500);
  }

  /* ---------- Terminal : découpe des lignes + déclenchement du typing ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".toutes-lignes"), function (pre) {
    var lignes;
    try { lignes = JSON.parse(pre.getAttribute("data-lines")); }
    catch (e) { return; }
    pre.textContent = "";
    lignes.forEach(function (txt) {
      var span = document.createElement("span");
      span.className = "ln";
      span.textContent = txt;
      pre.appendChild(span);
    });
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("tape");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    Array.prototype.forEach.call(document.querySelectorAll(".ecran"), function (e) { io.observe(e); });
  } else {
    Array.prototype.forEach.call(document.querySelectorAll(".ecran"), function (e) { e.classList.add("tape"); });
  }

  /* ---------- Questions : toute réponse mène au même "peu importe" ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".ecran[data-type=question]"), function (ecran) {
    var rep = ecran.querySelector(".reponse");
    Array.prototype.forEach.call(ecran.querySelectorAll(".choix button"), function (btn) {
      btn.addEventListener("click", function () {
        if (rep) rep.hidden = false;
        Array.prototype.forEach.call(ecran.querySelectorAll(".choix button"), function (b) {
          b.disabled = true;
          if (b !== btn) b.style.opacity = "0.35";
        });
      });
    });
  });

  /* ---------- Lapin : glitch + easter egg (3 clics) ---------- */
  var lapin = document.getElementById("lapin");
  var secret = document.getElementById("secret");
  if (lapin && !reduced) lapin.classList.add("glitch");
  if (lapin && secret) {
    var clics = 0;
    lapin.addEventListener("click", function () {
      clics++;
      if (clics === 3 && secret.hidden) {
        secret.hidden = false;
        lapin.style.color = "var(--acide)";
      }
    });
  }

  /* ---------- Titre répulsif ---------- */
  var lettres = Array.prototype.slice.call(document.querySelectorAll(".titre span"));
  var mx = -9999, my = -9999;
  if (lettres.length && !reduced) {
    document.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
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
        var dx = centre[idx][0] - mx, dy = centre[idx][1] - my;
        var d = Math.hypot(dx, dy) || 1;
        var R = 140;
        if (d < R) {
          var f = (R - d) / R;
          l.style.transform = "translate(" + (dx / d * f * -40).toFixed(1) + "px," + (dy / d * f * -40).toFixed(1) + "px)";
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

  /* ---------- Révélation des logs ---------- */
  var logs = Array.prototype.slice.call(document.querySelectorAll(".log"));
  if ("IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    logs.forEach(function (s) { io2.observe(s); });
  } else {
    logs.forEach(function (s) { s.classList.add("visible"); });
  }
})();
