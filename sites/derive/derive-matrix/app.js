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

  /* ---------- Cadrage par bloc : le scroll s'aimante au bloc en cours ----------
     Chaque .ecran est un « plan » du récit. Quand on entre dedans (35% visible),
     un scroll doux cale le haut du bloc en haut du viewport — le visiteur reste
     dans le cadre pendant la lecture/le typing. Déclenché une seule fois par
     bloc, jamais en arrière. reduced-motion : pas d'aimantation. */
  if (!reduced && "IntersectionObserver" in window) {
    var cadrage = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var bloc = entry.target;
        cadrage.unobserve(bloc);
        // caler le haut du bloc : léger délai pour laisser la transition respirer
        setTimeout(function () {
          var y = bloc.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 250);
      });
    }, { threshold: 0.35 });
    Array.prototype.forEach.call(document.querySelectorAll(".ecran"), function (e) { cadrage.observe(e); });
  }

  /* ---------- Questions : conversation avec le terminal ----------
     - boutons numérotés [1]/[2], raccourcis clavier 1/2
     - confirmation tapée par le terminal après le choix
     - impatience : relances après 8s puis 16s d'inaction
     - la réponse est gardée en mémoire de session (pas de storage) :
       le dénouement s'adapte. Refresh = tout retombe à zéro. */
  var reponseNature = null;      // question 1 : bug | feature
  var reponseMode = null;        // question 2 : hasard | ennui | derive

  function tapeDans(ecran, texte, delai) {
    // ajoute une ligne tapée façon terminal : créée au moment T, animée en width
    setTimeout(function () {
      var pre = ecran.querySelector(".toutes-lignes");
      if (!pre) return;
      var span = document.createElement("span");
      span.className = "ln tape-live";
      span.textContent = texte;
      span.style.animation = "tape 0.9s steps(30) forwards";
      pre.appendChild(span);
    }, delai);
  }

  Array.prototype.forEach.call(document.querySelectorAll(".ecran[data-type=question]"), function (ecran, qIdx) {
    var rep = ecran.querySelector(".reponse");
    var boutons = Array.prototype.slice.call(ecran.querySelectorAll(".choix button"));
    var relances = [
      ["> der1ve : la question ne restera pas ouverte éternellement.", 8000],
      ["> der1ve : très bien. je noterai \"" + (qIdx === 0 ? "bug" : "l'ennui") + "\".", 16000]
    ];
    var timersRelance = [];
    var repondu = false;

    function relancer(i) {
      if (repondu || i >= relances.length) return;
      tapeDans(ecran, relances[i][0], 0);
      timersRelance.push(setTimeout(function () { relancer(i + 1); }, relances[i + 1] ? relances[i + 1][1] - relances[i][1] : 0));
    }
    timersRelance.push(setTimeout(function () { relancer(0); }, relances[0][1]));

    function choisir(btn) {
      if (repondu) return;
      repondu = true;
      timersRelance.forEach(clearTimeout);

      var r = btn.getAttribute("data-r");
      if (qIdx === 0) reponseNature = r; else reponseMode = r;

      // le terminal accuse réception, façon shell
      var label = btn.textContent.replace(/^\[\d+\]\s*/, "");
      tapeDans(ecran, "> input reçu: " + label + " — enregistré sous SPEC-humain-00000" + (qIdx + 1), 300);
      tapeDans(ecran, "> der1ve : " + (qIdx === 0
        ? (r === "bug" ? "les meilleurs le sont. ne le dis à personne." : "le feature-tracking te dira. ou pas.")
        : (r === "derive" ? "la seule réponse honnête. ne t'inquiète pas." : "mensonge plausible. c'est toujours l'ennui.")), 1900);

      if (rep) setTimeout(function () { rep.hidden = false; }, 2200);

      boutons.forEach(function (b) {
        b.disabled = true;
        if (b !== btn) b.style.opacity = "0.35";
        else b.classList.add("choisi");
      });
    }

    boutons.forEach(function (btn, i) {
      btn.addEventListener("click", function () { choisir(btn); });
    });

    // raccourcis clavier 1/2/3 — actifs seulement si la question est visible
    document.addEventListener("keydown", function (e) {
      var rect = ecran.getBoundingClientRect();
      var visible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
      if (!visible || repondu) return;
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= boutons.length) choisir(boutons[n - 1]);
    });
  });

  /* ---------- Dénouement : la réponse de Q1 réécrit la dernière ligne ---------- */
  var final = document.querySelector(".ecran.final");
  if (final) {
    var preFinal = final.querySelector(".toutes-lignes");
    var observerFinal = new MutationObserver(function () {
      // intervient quand les lignes finales ont été créées
      var lns = preFinal.querySelectorAll(".ln");
      if (lns.length >= 3 && reponseNature) {
        var ligne = lns[2];
        if (reponseNature === "bug") {
          ligne.textContent = "> der1ve : les bugs finissent toujours par devenir des features. toi aussi, un jour.";
        } else if (reponseNature === "feature") {
          ligne.textContent = "> der1ve : feature aujourd'hui. obsolète demain. reste pour la dérive.";
        }
        observerFinal.disconnect();
      }
    });
    observerFinal.observe(preFinal, { childList: true });
  }

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
