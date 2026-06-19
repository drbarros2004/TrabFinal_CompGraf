// ─── CustomChord — derivação de notas, rótulo e construtor ───────────────────

// Nota de cada corda solta: índice 0 = corda 6 (E2) → 5 = corda 1 (E4)
const OPEN_NOTES = ["E2", "A2", "D3", "G3", "B3", "E4"];

// Nota soada pela corda i no traste f (f >= 0); null se abafada (f < 0).
function noteForString(i, f) {
  if (f < 0) return null;
  return Tone.Frequency(OPEN_NOTES[i]).transpose(f).toNote();
}

// Notas de um fingering completo (array de 6); abafadas viram null.
function notesFromFingering(fingering) {
  return fingering.map((f, i) => noteForString(i, f));
}

// Monta o rótulo a partir das partes escolhidas no painel.
//   base: "A".."G"   accidental: "" | "#" | "b"
//   quality: "" (maior) | "m" (menor)
//   extensions: array de strings, ex. ["7","9"]
//   bass: "" | "A".."G" (com possível acidente, ex. "G#")
function buildChordLabel({ base, accidental, quality, extensions, bass }) {
  let s = base + (accidental || "");
  if (quality === "m") s += "m";
  if (extensions && extensions.length) s += extensions.join("");
  if (bass) s += "/" + bass;
  return s;
}

const CustomChordBuilder = {
  active: false,
  fingering: [0, 0, 0, 0, 0, 0],
  _dom: null,   // referências dos elementos DOM do painel (criado na Task 9)

  open() {
    this.active = true;
    this.fingering = [0, 0, 0, 0, 0, 0];
    activeView = VIEWS.braco;          // construtor sempre na vista braço
    if (this._buildPanel) this._buildPanel();   // painel DOM (Task 9)
  },

  cancel() {
    this.active = false;
    if (this._destroyPanel) this._destroyPanel();
  },

  // Corda mais próxima do y do mouse (ou null se longe demais)
  _nearestString(my) {
    let best = null, bestD = 24;       // tolerância vertical em px
    for (let i = 0; i < 6; i++) {
      const d = abs(activeView.stringY(i) - my);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  },

  // Traste 1..numFrets cujo centro fica mais próximo de mx (ou null)
  _nearestFret(mx) {
    let best = null, bestD = 1e9;
    for (let f = 1; f <= activeView.numFrets; f++) {
      const d = abs(activeView.fretX(f - 0.5) - mx);
      if (d < bestD) { bestD = d; best = f; }
    }
    return best;
  },

  handleClick(mx, my) {
    const i = this._nearestString(my);
    if (i === null) return;
    if (mx < activeView.nutX) {
      // zona à esquerda do nut: alterna solta (0) ↔ abafada (-1)
      this.fingering[i] = (this.fingering[i] === -1) ? 0 : -1;
    } else {
      const f = this._nearestFret(mx);
      if (f !== null) this.fingering[i] = (this.fingering[i] === f) ? 0 : f;
    }
  },

  draw() {
    // Desenha o fingering em construção sobre o braço
    push();
    for (let i = 0; i < 6; i++) {
      const f = this.fingering[i];
      const y = activeView.stringY(i);
      if (f === -1) {
        noStroke(); fill(...COLORS.hint); textAlign(CENTER, CENTER); textSize(13);
        text("×", activeView.nutX - 25, y);
      } else if (f === 0) {
        noFill(); stroke(...COLORS.menuText); strokeWeight(1.5);
        ellipse(activeView.nutX - 25, y, 9, 9);
      } else {
        noStroke(); fill(...COLORS.menuActive);
        ellipse(activeView.fretX(f - 0.5), y, 14, 14);
      }
    }
    // Instruções
    noStroke(); fill(...COLORS.hint); textAlign(CENTER, TOP); textSize(12);
    text("Clique nas casas para montar o acorde · esquerda do nut: solta/abafada · ESC cancela",
         (activeView.stringX0 + activeView.stringX1) / 2, NECK.yBot + 24);
    pop();
  },
};
