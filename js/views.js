// ─── Views — geometria parametrizada por modo de visualização ────────────────
// Contrato: ver docs/superpowers/plans/2026-06-18-vista-grafica-violao.md

// Geometria do modo "violão completo" (zoom A: boca inteira visível, span ~60px)
const VIOLAO_GEO = {
  cy:       300,            // linha central das cordas
  span:     60,             // distância vertical total das 6 cordas
  x0:       44,             // (legado) início da cabeça
  x1:       985,            // fim das cordas (nos pinos do cavalete)
  fbX0:     135,            // início da escala (pestana)
  fbX1:     703,            // fim da escala — estende sobre o corpo até a boca
  scaleLen: 820,            // comprimento de escala (nut→cavalete) p/ espaçamento real
  numFrets: 20,             // trastes desenhados; comprimem perto da boca
  fh:       37,             // meia-altura da escala/cabeça
};

// x do traste f no modo violão, com espaçamento REAL: os trastes comprimem
// conforme se aproximam do corpo/boca. d(f) = S · (1 − 2^(−f/12)).
function violaoFretX(f) {
  return VIOLAO_GEO.fbX0 + VIOLAO_GEO.scaleLen * (1 - Math.pow(2, -f / 12));
}

const VIEWS = {
  // Modo atual — wrapper fino sobre as constantes existentes (pixel-idêntico).
  braco: {
    name:      "braco",
    stringY:   (i) => stringY(i),
    stringX0:  NECK.xStart,
    stringX1:  NECK.xEnd,
    nutX:      NECK.xStart,
    markerX:   NECK.xStart - 25,   // x dos marcadores × / ○ (à esquerda da pestana)
    showStringMarks: true,         // mostra × (abafada) e ○ (solta)
    fingerDotD: 20,                // diâmetro da bolinha de digitação
    fretX:     (f) => fretX(f),
    numFrets:  NUM_FRETS,
    ampScale:  1,
    menuPos:   { cx: 1085, cy: 290, r: RADIAL.r, dotR: RADIAL.dotR },
    drawBackground: () => _drawNeck(),   // _drawNeck() definido em sketch.js
  },

  // Modo gráfico — geometria realista + violão inteiro desenhado.
  violao: {
    name:      "violao",
    stringY:   (i) => VIOLAO_GEO.cy - VIOLAO_GEO.span / 2 + i * (VIOLAO_GEO.span / 5),
    stringX0:  VIOLAO_GEO.fbX0,   // corda vibrante começa na pestana; cabeça desenha o resto
    stringX1:  VIOLAO_GEO.x1,
    nutX:      VIOLAO_GEO.fbX0,
    markerX:   VIOLAO_GEO.fbX0 + 18,  // (não usado: marcas ocultas nesta view)
    showStringMarks: false,           // sem × / ○; abafadas ficam acinzentadas
    fingerDotD: 15,                   // bolinhas menores nesta view
    fretX:     (f) => violaoFretX(f),
    numFrets:  VIOLAO_GEO.numFrets,
    ampScale:  ampScaleForSpacing(VIOLAO_GEO.span / 5), // 12/72 ≈ 0.167
    menuPos:   { cx: 330, cy: 110, r: 70, dotR: 6 },
    drawBackground: () => GuitarView.draw(),  // GuitarView definido em guitarView.js
  },
};

// Ponteiro para a view ativa (alterado pela tecla V).
let activeView = VIEWS.braco;
