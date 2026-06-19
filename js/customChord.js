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

  // open()/cancel()/save()/draw()/handleClick() — implementados nas Tasks 8 e 9.
};
