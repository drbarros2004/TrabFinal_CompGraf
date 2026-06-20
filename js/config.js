// ─── Canvas ────────────────────────────────────────────────────────────────
const CANVAS_W = 1200;
const CANVAS_H = 600;

// ─── Paleta — tons escuros com acento cálido ───────────
const COLORS = {
  bg:           [18,  18,  18],   // fundo quase preto
  string:       [180, 155, 110],  // cordas: dourado envelhecido
  stringActive: [255, 210, 100],  // corda tocada: amarelo quente
  menuRing:     [60,  60,  60],   // anel do menu radial
  menuActive:   [200, 130, 60],   // acorde ativo: laranja
  menuText:     [220, 210, 195],  // texto do menu
  hint:         [100, 100, 100],  // texto auxiliar
};

// ─── Braço do violão ────────────────────────────────────────────────────────
const NECK = {
  xStart: 80,    // nut (esquerda)
  xEnd:   920,   // bridge (direita)
  yTop:   120,   // y da corda 6 (mais grave, topo)
  yBot:   480,   // y da corda 1 (mais aguda, base)
};

// y de cada corda: índice 0 = corda 6 (grave, topo) → índice 5 = corda 1 (aguda, base)
function stringY(i) {
  return NECK.yTop + i * ((NECK.yBot - NECK.yTop) / 5);
}

// Espessura visual de cada corda (0 = mais grossa)
const STRING_WIDTHS = [3.5, 2.8, 2.2, 1.6, 1.2, 0.9];

// ─── Física da onda estacionária ────────────────────────────────────────────
// lambda = taxa de amortecimento; omega = freq. visual de oscilação
const STRING_PHYSICS = [
  { lambda: 2.5, omega: 8  },   // corda 6 (E2) — mais lenta/grossa
  { lambda: 2.8, omega: 9  },   // corda 5 (A2)
  { lambda: 3.2, omega: 11 },   // corda 4 (D3)
  { lambda: 3.6, omega: 13 },   // corda 3 (G3)
  { lambda: 4.0, omega: 15 },   // corda 2 (B3)
  { lambda: 4.5, omega: 18 },   // corda 1 (E4) — mais rápida/fina
];

const STRING_VERTICES = 60;          // nº de vértices internos p/ suavidade
const AMPLITUDE_REST_THRESHOLD = 0.5; // px abaixo do qual a corda "repousa"
const STRUM_COOLDOWN_MS = 70;        // ms mínimos entre dois toques na mesma corda

// ─── Áudio ─────────────────────────────────────────────────────────────────
const AUDIO = {
  minDb: -12,    // volume mínimo (movimento lento)
  maxDb:  0,     // volume máximo (movimento rápido)
  releaseSec: 0.6, // fade ao trocar de acorde: dissipa em vez de cortar seco
};

// ─── Menu radial ────────────────────────────────────────────────────────────
const RADIAL = {
  cx:     1100, // centro x (canto superior direito)
  cy:     110,  // centro y
  r:      75,   // raio do anel de rótulos
  dotR:   6,    // raio dos pontos
};

// ─── Indicador de rodas (dots abaixo do menu radial) ─────────────────────────
const WHEEL_DOTS = {
  gap:        18,   // espaçamento horizontal entre dots
  yOffset:    28,   // distância abaixo da borda inferior do anel
  rActive:    7,    // raio do dot da roda ativa
  rInactive:  4,    // raio dos demais
};

// ─── Braço — trastes ────────────────────────────────────────────────────────
const NUM_FRETS    = 7;
const STRING_NAMES = ["E", "A", "D", "G", "B", "E"]; // índice 0 = corda 6 (E2)

// x do traste f (0 = nut, NUM_FRETS = bridge); aceita float para posição intermédia
function fretX(f) {
  return NECK.xStart + f * (NECK.xEnd - NECK.xStart) / NUM_FRETS;
}

// ─── Escala de amplitude por view ────────────────────────────────────────────
// Espaçamento entre cordas do modo braço atual = base de referência (ampScale 1).
const BRACO_STRING_SPACING = (NECK.yBot - NECK.yTop) / 5; // = 72

// Amplitude visual proporcional ao espaçamento: cordas mais juntas vibram com
// menor deslocamento, evitando que a onda invada a corda vizinha.
function ampScaleForSpacing(spacing) {
  return spacing / BRACO_STRING_SPACING;
}
