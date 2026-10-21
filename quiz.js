// ===== EINSTELLUNGEN =====
const EURO_PRO_FRAGE = 10; // Gewinn pro richtiger Antwort (15 Fragen = 150 €)
const VERSUCHE = 3;        // wie oft sie von vorn anfangen darf (1 = nur ein Versuch)
const GEBURTSTAGS_SEITE = "https://DEIN-NAME.github.io/REPO-NAME/"; // Link zur Geburtstags-Website (erscheint am Ende)

// ===== FRAGEN =====
// f = Frage, o = 4 Antworten, r = Nummer der richtigen Antwort (0 = A, 1 = B, 2 = C, 3 = D)
// b = Buchstabe fürs Lösungswort. Fehlt b, zählt der erste Buchstabe der richtigen Antwort.
// Beispiel: { f: "Wo war unser erstes Date?", o: ["Kino", "Park", "Café", "Strand"], r: 2 }  (ergibt den Buchstaben C)
// Die 15 Platzhalter unten ergeben das Wort HERZENSMENSCHEN. Ersetze sie durch eigene Fragen.
const MILLIONAER = Array.from("HERZENSMENSCHEN").map(function (b, i) {
  return { f: "[Frage " + (i + 1) + " über uns]", o: ["Antwort A", "Antwort B", "Antwort C", "Antwort D"], r: i % 4, b: b };
});

(function () {
  const KEY = "fd-millionaer", area = document.getElementById("spiel");
  const N = MILLIONAER.length, HAUPT = N * EURO_PRO_FRAGE;
  const buchstabe = (q) => (q.b || q.o[q.r].charAt(0)).toUpperCase();
  let st = { versuche: 0, fertig: false };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  function speichern() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function el(t, c, x) { const e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; }
  function knopf(t, f) { const b = el("button", "", t); b.onclick = f; return b; }
  function leeren() { area.textContent = ""; }
  function wortBox(l) { const w = el("div", "wort"); for (let i = 0; i < N; i++) w.appendChild(el("span", "", l[i] || "_")); return w; }

  function start() {
    leeren();
    if (st.fertig) return sieg();
    area.appendChild(el("p", "spiel-frage", "Beantworte " + N + " Fragen über uns.\nFür jede richtige Antwort gibt es " + EURO_PRO_FRAGE + " €, am Ende " + HAUPT + " €.\nDie Buchstaben der richtigen Antworten ergeben ein Wort: das Passwort zu deinem Geschenk."));
    const rest = VERSUCHE - st.versuche;
    if (rest <= 0) { area.appendChild(el("p", "ergebnis", "Alle Versuche sind verbraucht.")); return; }
    area.appendChild(knopf("Los geht’s (" + rest + (rest === 1 ? " Versuch" : " Versuche") + ")", function () { st.versuche++; speichern(); spiel(); }));
  }

  function spiel() {
    let idx = 0, buchst = [], joker = true;
    function frage() {
      leeren();
      const q = MILLIONAER[idx];
      const dots = el("div", "dots");
      for (let i = 0; i < N; i++) dots.appendChild(el("span", "dot" + (i < idx ? " an" : "")));
      area.appendChild(dots);
      area.appendChild(el("p", "small-line", "Frage " + (idx + 1) + " von " + N + " · gewonnen: " + idx * EURO_PRO_FRAGE + " €"));
      area.appendChild(wortBox(buchst));
      area.appendChild(el("p", "spiel-frage", q.f));
      const box = el("div", "opts"); area.appendChild(box);
      const kn = q.o.map(function (t, i) {
        const b = knopf("ABCD".charAt(i) + ": " + t, function () {
          kn.forEach((x) => (x.disabled = true));
          if (i === q.r) {
            b.classList.add("richtig"); buchst.push(buchstabe(q)); idx++;
            setTimeout(function () { if (idx >= N) { st.fertig = true; speichern(); sieg(); } else frage(); }, 1100);
          } else {
            b.classList.add("falsch"); kn[q.r].classList.add("richtig");
            setTimeout(function () {
              leeren();
              area.appendChild(el("p", "ergebnis", "Leider falsch."));
              area.appendChild(el("p", "spiel-frage", "Du hast " + idx * EURO_PRO_FRAGE + " € gewonnen."));
              const rest = VERSUCHE - st.versuche;
              if (rest > 0) area.appendChild(knopf("Nochmal (" + rest + " übrig)", start));
              else area.appendChild(el("p", "small-line", "Alle Versuche sind verbraucht."));
            }, 1400);
          }
        });
        box.appendChild(b); return b;
      });
      if (joker && q.o.length === 4) {
        const j = knopf("50:50", function () {
          [0, 1, 2, 3].filter((i) => i !== q.r).sort(() => Math.random() - 0.5).slice(0, 2).forEach((i) => (kn[i].style.visibility = "hidden"));
          joker = false; j.remove();
        });
        area.appendChild(j);
      }
    }
    frage();
  }

  function sieg() {
    leeren();
    area.appendChild(el("p", "ergebnis", "Hauptgewinn: " + HAUPT + " € ♥"));
    area.appendChild(el("p", "spiel-frage", "Alle Buchstaben gefunden:"));
    area.appendChild(wortBox(MILLIONAER.map(buchstabe)));
    area.appendChild(el("p", "small-line", "Das ist dein Passwort für die Geburtstags-Website."));
    if (GEBURTSTAGS_SEITE.indexOf("DEIN-NAME") < 0) {
      const a = el("a", "cta", "Zur Geburtstags-Website ›"); a.href = GEBURTSTAGS_SEITE; area.appendChild(a);
    }
  }

  start();
})();
