// ─── Rodas de acordes ────────────────────────────────────────────────────────
// Cada acorde: { label, fingering }
//   fingering: 6 inteiros; índice 0 = corda 6 (grave/topo) → 5 = corda 1 (aguda);
//   -1 = abafada, 0 = solta, 1..N = traste pressionado.
//   A nota soada por cada corda é derivada do fingering por noteForString().

// Nota de cada corda solta: índice 0 = corda 6 (E2) → 5 = corda 1 (E4)
const OPEN_NOTES = ["E2", "A2", "D3", "G3", "B3", "E4"];

// Nota soada pela corda i no traste f (f >= 0); null se abafada (f < 0).
function noteForString(i, f) {
  if (f < 0) return null;
  return Tone.Frequency(OPEN_NOTES[i]).transpose(f).toNote();
}

// ─── Template das rodas ──────────────────────────────────────────────────────
// 6 rodas (5 do jogo + 1 customizada), 6 acordes cada.
// A POSIÇÃO de cada acorde na roda segue a ORDEM do array — índice 0 no topo,
// daí no sentido horário:
//   0 = topo · 1 = cima-direita · 2 = baixo-direita ·
//   3 = base · 4 = baixo-esquerda · 5 = cima-esquerda.
//
// As digitações (fingering) abaixo são PLACEHOLDERS (cordas soltas).
// Substitua cada PLACEHOLDER pela digitação real, ex.: fingering: [-1, 3, 2, 0, 1, 0].
const PLACEHOLDER = [0, 0, 0, 0, 0, 0];

const WHEELS = [
  {
    id: "roda1",
    chords: [
      { label: "A",   fingering: [-1, 0, 2, 2, 2, 0] }, // topo
      { label: "E",  fingering:  [0, 2, 2, 1, 0, 0] }, // cima-direita
      { label: "Bm", fingering: [-1, 2, 4, 4, 3, 2] }, // baixo-direita
      { label: "F#m", fingering: [2, 4, 4, 2, 2, 2] }, // base
      { label: "C#m", fingering: [-1, 4, 6, 6, 5, 4] }, // baixo-esquerda
      { label: "D",   fingering: [-1, -1, 0, 2, 3, 2] }, // cima-esquerda
    ],
  },

  {
    id: "roda2",
    chords: [
      { label: "B", fingering:   [-1, 2, 4, 4, 4, 2] }, // topo
      { label: "F#", fingering:  [2, 4, 4, 3, 2, 2] }, // cima-direita
      { label: "C#m", fingering: [-1, 4, 6, 6, 5, 4] }, // baixo-direita
      { label: "G#m", fingering: [4, 6, 6, 4, 4, 4] }, // base
      { label: "D#m", fingering: [-1, 6, 8, 8, 7, 6] }, // baixo-esquerda
      { label: "E", fingering:   [0, 2, 2, 1, 0, 0] }, // cima-esquerda
    ],
  },

  {
    id: "roda3",
    chords: [
      { label: "C", fingering: [-1, 3, 2, 0, 1, 0] }, // topo
      { label: "G", fingering: [3, 2, 0, 0, 3, 3] }, // cima-direita
      { label: "Dm", fingering: [-1, -1, 0, 2, 3, 1] }, // baixo-direita
      { label: "Am", fingering: [-1, 0, 2, 2, 1, 0] }, // base
      { label: "Em", fingering: [0, 2, 2, 0, 0, 0] }, // baixo-esquerda
      { label: "F", fingering:  [1, 3, 3, 2, 1, 1] }, // cima-esquerda
    ],
  },

  {
    id: "roda4",
    chords: [
      { label: "Db", fingering:  [-1, 4, 6, 6, 6, 4] }, // topo
      { label: "Ab", fingering:  [4, 6, 6, 5, 4, 4] }, // cima-direita
      { label: "Ebm", fingering: [-1, 6, 8, 8, 7, 6] }, // baixo-direita
      { label: "Bbm", fingering: [-1, 1, 3, 3, 2, 1] }, // base
      { label: "Fm", fingering:  [1, 3, 3, 1, 1, 1] }, // baixo-esquerda
      { label: "Gb", fingering:  [2, 4, 4, 3, 2, 2] }, // cima-esquerda
    ],
  },

  {
    id: "roda5",
    chords: [
      { label: "Eb", fingering: [-1, 6, 8, 8, 8, 6] }, // topo
      { label: "Bb", fingering: [-1, 1, 3, 3, 3, 1] }, // cima-direita
      { label: "Fm", fingering: [1, 3, 3, 1, 1, 1] }, // baixo-direita
      { label: "Cm", fingering: [-1, 3, 5, 5, 4, 3] }, // base
      { label: "Gm", fingering: [3, 5, 5, 3, 3, 3] }, // baixo-esquerda
      { label: "Ab", fingering: [4, 6, 6, 5, 4, 4] }, // cima-esquerda
    ],
  },

  {
    id: "custom",
    chords: [
      { label: "D7M", fingering: [-1, -1, 0, 2, 2, 2] }, // topo
      { label: "?", fingering: PLACEHOLDER }, // cima-direita
      { label: "?", fingering: PLACEHOLDER }, // baixo-direita
      { label: "?", fingering: PLACEHOLDER }, // base
      { label: "?", fingering: PLACEHOLDER }, // baixo-esquerda
      { label: "?", fingering: PLACEHOLDER }, // cima-esquerda
    ],
  },
];
