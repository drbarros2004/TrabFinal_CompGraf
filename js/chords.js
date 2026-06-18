// ─── Campo harmônico de Sol Maior ───────────────────────────────────────────
// Índice 0 = corda 6 (grave/topo) → índice 5 = corda 1 (aguda/base)
const CHORDS = {
  G:      { label: "G",   notes: ["G2","B2","D3","G3","B3","G4"] },
  Am:     { label: "Am",  notes: ["A2","A2","E3","A3","C4","E4"] },
  Bm:     { label: "Bm",  notes: ["B2","B2","F#3","B3","D4","F#4"] },
  C:      { label: "C",   notes: ["E2","C3","E3","G3","C4","E4"] },
  D:      { label: "D",   notes: ["E2","A2","D3","A3","D4","F#4"] },
  Em:     { label: "Em",  notes: ["E2","B2","E3","G3","B3","E4"] },
  "F#dim":{ label: "F#°", notes: ["F#2","C3","F#3","A3","C4","F#4"] },
};

const CHORD_ORDER = ["G","Am","Bm","C","D","Em","F#dim"];

// Posição de dedo por acorde
// Índice 0 = corda 6 (E2) → índice 5 = corda 1 (E4)
// 0 = solta, -1 = abafada, 1–7 = traste pressionado
const FINGERINGS = {
  G:       [ 3,  2,  0,  0,  0,  3],
  Am:      [ 0,  0,  2,  2,  1,  0],
  Bm:      [-1,  2,  4,  4,  3,  2],
  C:       [-1,  3,  2,  0,  1,  0],
  D:       [-1, -1,  0,  2,  3,  2],
  Em:      [ 0,  2,  2,  0,  0,  0],
  "F#dim": [ 2, -1,  4,  2,  1,  2],
};
