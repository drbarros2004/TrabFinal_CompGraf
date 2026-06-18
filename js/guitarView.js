// ─── GuitarView — desenho do violão inteiro (construído por camadas) ─────────
// Stub inicial: faixa de referência mostrando a região da escala e do corpo.
// As camadas reais (corpo, boca, braço, cabeça) entram nas tarefas seguintes.
const GuitarView = {
  draw() {
    push();
    rectMode(CORNER);
    noStroke();
    // placeholder da escala
    fill(40, 28, 18);
    rect(VIOLAO_GEO.fbX0, VIOLAO_GEO.cy - 40, VIOLAO_GEO.fbX1 - VIOLAO_GEO.fbX0, 80);
    // placeholder do corpo
    fill(60, 42, 24);
    ellipse(850, VIOLAO_GEO.cy, 420, 380);
    pop();
  },
};
