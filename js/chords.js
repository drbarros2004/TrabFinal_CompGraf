// ─── Rodas de acordes ────────────────────────────────────────────────────────
// Cada acorde: { label, notes, fingering }
//   notes:     6 nomes de nota; índice 0 = corda 6 (grave/topo) → 5 = corda 1 (aguda)
//   fingering: 6 inteiros; -1 = abafada, 0 = solta, 1..N = traste pressionado
// Notas de cordas abafadas nos presets recebem a tônica/nota harmônica para o
// caso "bloqueio OFF" (comportamento atual de tocar tudo).

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
      { label: "G",   notes: ["G2","B2","D3","G3","B3","G4"],     fingering: [ 3, 2, 0, 0, 0, 3] },
      { label: "Am",  notes: ["A2","A2","E3","A3","C4","E4"],     fingering: [-1, 0, 2, 2, 1, 0] },
      { label: "Bm",  notes: ["B2","B2","F#3","B3","D4","F#4"],   fingering: [-1, 2, 4, 4, 3, 2] },
      { label: "C",   notes: ["E2","C3","E3","G3","C4","E4"],     fingering: [-1, 3, 2, 0, 1, 0] },
      { label: "D",   notes: ["E2","A2","D3","A3","D4","F#4"],    fingering: [-1,-1, 0, 2, 3, 2] },
      { label: "Em",  notes: ["E2","B2","E3","G3","B3","E4"],     fingering: [ 0, 2, 2, 0, 0, 0] },
      { label: "F#°", notes: ["F#2","C3","F#3","A3","C4","F#4"],  fingering: [ 2,-1, 4, 2, 1, 2] },
    ],
  },
  {
    id: "campoC",
    name: "Campo de C",
    chords: [
      { label: "C",   notes: ["C3","C3","E3","G3","C4","E4"],     fingering: [-1, 3, 2, 0, 1, 0] },
      { label: "Dm",  notes: ["D3","A2","D3","A3","D4","F4"],     fingering: [-1,-1, 0, 2, 3, 1] },
      { label: "Em",  notes: ["E2","B2","E3","G3","B3","E4"],     fingering: [ 0, 2, 2, 0, 0, 0] },
      { label: "F",   notes: ["F2","C3","F3","A3","C4","F4"],     fingering: [ 1, 3, 3, 2, 1, 1] },
      { label: "G",   notes: ["G2","B2","D3","G3","B3","G4"],     fingering: [ 3, 2, 0, 0, 0, 3] },
      { label: "Am",  notes: ["A2","A2","E3","A3","C4","E4"],     fingering: [-1, 0, 2, 2, 1, 0] },
      { label: "B°",  notes: ["B2","B2","F3","B3","D4","D4"],     fingering: [-1, 2, 3, 4, 3,-1] },
    ],
  },
  {
    id: "campoD",
    name: "Campo de D",
    chords: [
      { label: "D",   notes: ["E2","A2","D3","A3","D4","F#4"],    fingering: [-1,-1, 0, 2, 3, 2] },
      { label: "Em",  notes: ["E2","B2","E3","G3","B3","E4"],     fingering: [ 0, 2, 2, 0, 0, 0] },
      { label: "F#m", notes: ["F#2","C#3","F#3","A3","C#4","F#4"],fingering: [ 2, 4, 4, 2, 2, 2] },
      { label: "G",   notes: ["G2","B2","D3","G3","B3","G4"],     fingering: [ 3, 2, 0, 0, 0, 3] },
      { label: "A",   notes: ["A2","A2","E3","A3","C#4","E4"],    fingering: [-1, 0, 2, 2, 2, 0] },
      { label: "Bm",  notes: ["B2","B2","F#3","B3","D4","F#4"],   fingering: [-1, 2, 4, 4, 3, 2] },
      { label: "C#°", notes: ["C#3","C#3","G3","C#4","E4","E4"],  fingering: [-1, 4, 5, 6, 5,-1] },
    ],
  },
  {
    id: "custom",
    name: "Meus acordes",
    chords: [],   // preenchido em memória pelo construtor (sem persistência)
  },
];
