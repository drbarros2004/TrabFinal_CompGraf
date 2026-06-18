// ─── Views — geometria parametrizada por modo de visualização ────────────────
// Contrato: ver docs/superpowers/plans/2026-06-18-vista-grafica-violao.md

// Geometria do modo "violão completo" (zoom A: boca inteira visível, span ~60px)
const VIOLAO_GEO = {
  cy:       300,            // linha central das cordas
  span:     60,             // distância vertical total das 6 cordas
  x0:       44,             // início das cordas (nas tarraxas)
  x1:       965,            // fim das cordas (no cavalete)
  fbX0:     120,            // início da escala (pestana)
  fbX1:     520,            // fim da escala (encontro com o corpo)
  numFrets: 9,
  fh:       37,             // meia-altura da escala/cabeça
};

const VIEWS = {
  // Modo atual — wrapper fino sobre as constantes existentes (pixel-idêntico).
  braco: {
    name:      "braco",
    stringY:   (i) => stringY(i),
    stringX0:  NECK.xStart,
    stringX1:  NECK.xEnd,
    nutX:      NECK.xStart,
    fretX:     (f) => fretX(f),
    numFrets:  NUM_FRETS,
    ampScale:  1,
    menuPos:   { cx: RADIAL.cx, cy: RADIAL.cy, r: RADIAL.r, dotR: RADIAL.dotR },
    drawBackground: () => _drawNeck(),   // _drawNeck() definido em sketch.js
  },

  // Modo gráfico — geometria realista + violão inteiro desenhado.
  violao: {
    name:      "violao",
    stringY:   (i) => VIOLAO_GEO.cy - VIOLAO_GEO.span / 2 + i * (VIOLAO_GEO.span / 5),
    stringX0:  VIOLAO_GEO.x0,
    stringX1:  VIOLAO_GEO.x1,
    nutX:      VIOLAO_GEO.fbX0,
    fretX:     (f) => VIOLAO_GEO.fbX0 + f * (VIOLAO_GEO.fbX1 - VIOLAO_GEO.fbX0) / VIOLAO_GEO.numFrets,
    numFrets:  VIOLAO_GEO.numFrets,
    ampScale:  ampScaleForSpacing(VIOLAO_GEO.span / 5), // 12/72 ≈ 0.167
    menuPos:   { cx: 200, cy: 110, r: 70, dotR: 6 },
    drawBackground: () => GuitarView.draw(),  // GuitarView definido em guitarView.js
  },
};

// Ponteiro para a view ativa (trocado pelo ToggleButton).
let activeView = VIEWS.braco;
