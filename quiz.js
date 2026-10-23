// ===== EINSTELLUNGEN =====
const EURO_PRO_FRAGE = 0; // Gewinn pro richtiger Antwort (15 Fragen = 150 €)
const VERSUCHE = 5;        // wie oft sie von vorn anfangen darf (1 = nur ein Versuch)
const GEBURTSTAGS_SEITE = "https://jonas-sz.github.io/fuer-dich-8k2x/"; // Link zur Geburtstags-Website (erscheint am Ende)

// ===== FRAGEN =====
// f = Frage, o = 4 Antworten, r = Nummer der richtigen Antwort (0 = A, 1 = B, 2 = C, 3 = D)
// b = Buchstabe fürs Lösungswort. Fehlt b, zählt der erste Buchstabe der richtigen Antwort.
// Beispiel: { f: "Wo war unser erstes Date?", o: ["Kino", "Park", "Café", "Strand"], r: 2 }  (ergibt den Buchstaben C)
// Die 15 Beispiele unten ergeben das Wort DUBISTMEINEWELT. Ersetze Fragen und Antworten durch deine eigenen.
const MILLIONAER = [
  { f: "Wo hatten wir unser erstes Date?", o: ["Braunschweig", "Augustdorf", "Borgsdorf", "Bielefeld"], r: 3, b: "I" },
  { f: "Wieviele Zettel sind in diesem Raum versteckt?", o: ["4", "5", "6", "keiner"], r: 1, b: "D" },
  { f: "Welcher Wochentag ist dein 63 Geburtstag?", o: ["Montag", "Freitag", "Mittwoch", "Sonntag"], r: 2, b: "T" },
  { f: "Welcher Psychologe führte das berühmte Experiment durch, bei dem Menschen vermeintlich anderen Personen tödliche Elektroschocks verabreichten, weil eine Autoritätsperson sie dazu aufforderte?", o: ["Philip Zimbardo", "Stanley Milgram", "Solomon Asch", "B. F. Skinner"], r: 1, b: "I" },
  { f: "Wohin werden wir fahren?", o: ["Borgsdorf", "Spazieren", "McDonalds", "Zeitung verteilen"], r: 0, b: "W" },
  { f: "Welchen Hubzapfenversatz besitzt die 689-cm³-Zweizylinder-Reihenmotor der Yamaha YZF-R7?", o: ["90°", "180°", "270°", "360°"], r: 2, b: "L" },
  { f: "Welches Tier siehst du? 70.083, 27.883 ?", o: ["Katze", "Bär", "Ziege", "Hund"], r: 3, b: "M" },
  { f: "En qué fase se necesitan siete cartas del mismo color?", o: ["6", "7", "8", "9"], r: 2, b: "E" },
  { f: "Welche Worte wählte ich im bewegten Bild, nachdem wir unsere Räumlichkeiten in Augenschein genommen habe?", o: ["AHHH", "WOW", "YEAH", "WUHUU"], r: 1, b: "U" },
  { f: "Zlh ylho Xku zdu hv dp 2. Dsulo 2025 (ROT13) ?", o: ["16:59", "12:00", "23:23", "15:10"], r: 3, b: "S" },
  { f: "Was kommt NICHT in meine Bolognese?", o: ["Milch", "Oregano", "Hack", "Tomatenmark"], r: 0, b: "B" },
  { f: "12 – 9 – 5 – 2 – 19 – 20 – 4 – 21 – 13 – 9 – 3 – 8?", o: ["Ja", "Nein", "Mir egal", "Vielleicht"], r: 0, b: "T" },
  { f: "Welcher Film war Pixars 23. Langfilm?", o: ["Luca", "Soul", "COCO", "G.O.A.T"], r: 1, b: "E" },
  { f: "Wieviele Stunden sind wir heute um 12 Uhr zusammen (ab 12 Uhr)?", o: ["21.888", "22.065", "21.912", "22.856"], r: 2, b: "N" },
  { f: "Stell dich auf das Bett und sag was du siehst", o: ["Nichts", "Jonas", "LEDs", "Etwas anderes..."], r: 3, b: "E" },
];

(function () {
  

const KEY = "fd-millionaer", area = document.getElementById("spiel");
const N = MILLIONAER.length, HAUPT = N * EURO_PRO_FRAGE;
const buchstabe = (q) => (q.b || q.o[q.r].charAt(0)).toUpperCase();

let st = { versuche: 0, fertig: false };

localStorage.removeItem(KEY);


  function speichern() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function el(t, c, x) { const e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; }
  function knopf(t, f) { const b = el("button", "", t); b.onclick = f; return b; }
  function leeren() { area.textContent = ""; }
  function wortBox(l) { const w = el("div", "wort"); for (let i = 0; i < N; i++) w.appendChild(el("span", "", l[i] || "_")); return w; }

  function start() {
    leeren();
    if (st.fertig) return sieg();
    area.appendChild(el("p", "spiel-frage", "Beantworte " + N + " Fragen und verdiene dir deine Belohnungen!"));
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
      area.appendChild(el("p", "small-line", "Frage " + (idx + 1) + " von " + N + " · gewonnen: " + (idx * EURO_PRO_FRAGE)));
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
              area.appendChild(el("p", "spiel-frage", "Du hast es leider nicht geschafft."));
              const rest = VERSUCHE - st.versuche;
              if (rest > 0) area.appendChild(knopf("Nochmal (" + rest + " übrig)", start));
                  else {
                    st.versuche = 0; speichern();
                    area.appendChild(el("p", "small-line", "Drei Fehlversuche, das Quiz startet von vorn."));
                    area.appendChild(knopf("Neu starten", start));
                  }
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
    area.appendChild(el("p", "ergebnis", "Hauptgewinn: 150 € ♥"));
    area.appendChild(el("p", "spiel-frage", "Alle Buchstaben gefunden:"));
    area.appendChild(wortBox(MILLIONAER.map(buchstabe)));
    area.appendChild(el("p", "small-line", "Die Buchstaben wirst du noch brauchen!"));
    if (GEBURTSTAGS_SEITE.indexOf("DEIN-NAME") < 0) {
      const a = el("a", "cta", "Zur Geburtstags-Website ›"); a.href = GEBURTSTAGS_SEITE; area.appendChild(a);
    }
  }

  start();
})();
