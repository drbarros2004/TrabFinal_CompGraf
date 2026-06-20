// ─── Rodas de acordes ────────────────────────────────────────────────────────
// Cada acorde: { label, fingering }
//   fingering: 6 inteiros; índice 0 = corda 6 (grave/topo) → 5 = corda 1 (aguda);
//   -1 = abafada, 0 = solta, 1..N = traste pressionado.
// A nota soada por cada corda é derivada do fingering por noteForString().

// Nota de cada corda solta: índice 0 = corda 6 (E2) → 5 = corda 1 (E4)
const OPEN_NOTES = ["E2", "A2", "D3", "G3", "B3", "E4"];

// Nota soada pela corda i no traste f (f >= 0); null se abafada (f < 0).
function noteForString(i, f) {
  if (f < 0) return null;
  return Tone.Frequency(OPEN_NOTES[i]).transpose(f).toNote();
}

const WHEELS = [
  {
    id: "campoG",
    name: "Campo de G",
    chords: [
      { label: "G",   fingering: [ 3, 2, 0, 0, 0, 3] },
      { label: "Am",  fingering: [-1, 0, 2, 2, 1, 0] },
      { label: "Bm",  fingering: [-1, 2, 4, 4, 3, 2] },
      { label: "C",   fingering: [-1, 3, 2, 0, 1, 0] },
      { label: "D",   fingering: [-1,-1, 0, 2, 3, 2] },
      { label: "Em",  fingering: [ 0, 2, 2, 0, 0, 0] },
      { label: "F#°", fingering: [ 2,-1, 4, 2, 1, 2] },
    ],
  },
  {
    id: "campoC",
    name: "Campo de C",
    chords: [
      { label: "C",   fingering: [-1, 3, 2, 0, 1, 0] },
      { label: "Dm",  fingering: [-1,-1, 0, 2, 3, 1] },
      { label: "Em",  fingering: [ 0, 2, 2, 0, 0, 0] },
      { label: "F",   fingering: [ 1, 3, 3, 2, 1, 1] },
      { label: "G",   fingering: [ 3, 2, 0, 0, 0, 3] },
      { label: "Am",  fingering: [-1, 0, 2, 2, 1, 0] },
      { label: "B°",  fingering: [-1, 2, 3, 4, 3,-1] },
    ],
  },
  {
    id: "campoD",
    name: "Campo de D",
    chords: [
      { label: "D",   fingering: [-1,-1, 0, 2, 3, 2] },
      { label: "Em",  fingering: [ 0, 2, 2, 0, 0, 0] },
      { label: "F#m", fingering: [ 2, 4, 4, 2, 2, 2] },
      { label: "G",   fingering: [ 3, 2, 0, 0, 0, 3] },
      { label: "A",   fingering: [-1, 0, 2, 2, 2, 0] },
      { label: "Bm",  fingering: [-1, 2, 4, 4, 3, 2] },
      { label: "C#°", fingering: [-1, 4, 5, 6, 5,-1] },
    ],
  },
  {
    id: "custom",
    name: "Meus acordes",
    // Adicione seus acordes aqui — basta { label, fingering }.
    // fingering: 6 inteiros, índice 0 = corda 6 (grave) → 5 = corda 1 (aguda);
    //   -1 = abafada, 0 = solta, 1.. = traste pressionado. As notas são derivadas.
    chords: [
      { label: "E",  fingering: [ 0, 2, 2, 1, 0, 0] },
      { label: "A7", fingering: [-1, 0, 2, 0, 2, 0] },
    ],
  },
];
