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
  // Roda 1 — exemplo no formato da imagem (campo de B). Ajuste os fingerings.
  {
    id: "roda1",
    chords: [
      { label: "B",   fingering: PLACEHOLDER }, // topo
      { label: "F#",  fingering: PLACEHOLDER }, // cima-direita
      { label: "C#m", fingering: PLACEHOLDER }, // baixo-direita
      { label: "G#m", fingering: PLACEHOLDER }, // base
      { label: "D#m", fingering: PLACEHOLDER }, // baixo-esquerda
      { label: "E",   fingering: PLACEHOLDER }, // cima-esquerda
    ],
  },

  // Roda 2 — preencha com a roda exata do jogo.
  {
    id: "roda2",
    chords: [
      { label: "?", fingering: PLACEHOLDER }, // topo
      { label: "?", fingering: PLACEHOLDER }, // cima-direita
      { label: "?", fingering: PLACEHOLDER }, // baixo-direita
      { label: "?", fingering: PLACEHOLDER }, // base
      { label: "?", fingering: PLACEHOLDER }, // baixo-esquerda
      { label: "?", fingering: PLACEHOLDER }, // cima-esquerda
    ],
  },

  // Roda 3 — preencha com a roda exata do jogo.
  {
    id: "roda3",
    chords: [
      { label: "?", fingering: PLACEHOLDER }, // topo
      { label: "?", fingering: PLACEHOLDER }, // cima-direita
      { label: "?", fingering: PLACEHOLDER }, // baixo-direita
      { label: "?", fingering: PLACEHOLDER }, // base
      { label: "?", fingering: PLACEHOLDER }, // baixo-esquerda
      { label: "?", fingering: PLACEHOLDER }, // cima-esquerda
    ],
  },

  // Roda 4 — preencha com a roda exata do jogo.
  {
    id: "roda4",
    chords: [
      { label: "?", fingering: PLACEHOLDER }, // topo
      { label: "?", fingering: PLACEHOLDER }, // cima-direita
      { label: "?", fingering: PLACEHOLDER }, // baixo-direita
      { label: "?", fingering: PLACEHOLDER }, // base
      { label: "?", fingering: PLACEHOLDER }, // baixo-esquerda
      { label: "?", fingering: PLACEHOLDER }, // cima-esquerda
    ],
  },

  // Roda 5 — preencha com a roda exata do jogo.
  {
    id: "roda5",
    chords: [
      { label: "?", fingering: PLACEHOLDER }, // topo
      { label: "?", fingering: PLACEHOLDER }, // cima-direita
      { label: "?", fingering: PLACEHOLDER }, // baixo-direita
      { label: "?", fingering: PLACEHOLDER }, // base
      { label: "?", fingering: PLACEHOLDER }, // baixo-esquerda
      { label: "?", fingering: PLACEHOLDER }, // cima-esquerda
    ],
  },

  // Roda 6 — customizada (seus próprios acordes).
  {
    id: "custom",
    chords: [
      { label: "?", fingering: PLACEHOLDER }, // topo
      { label: "?", fingering: PLACEHOLDER }, // cima-direita
      { label: "?", fingering: PLACEHOLDER }, // baixo-direita
      { label: "?", fingering: PLACEHOLDER }, // base
      { label: "?", fingering: PLACEHOLDER }, // baixo-esquerda
      { label: "?", fingering: PLACEHOLDER }, // cima-esquerda
    ],
  },
];
