// ─── GuitarView — desenho do violão inteiro (construído por camadas) ─────────
const GuitarView = {
  // Silhueta do corpo (Bézier), simétrica em torno de cy. Reusada p/ fill e contorno.
  _bodyShape() {
    const cy = VIOLAO_GEO.cy;
    const bh = 198;  // meia-altura do bojo inferior
    const fh = 37;   // meia-altura no encontro com a escala
    beginShape();
    vertex(520, cy - fh * 1.5);
    bezierVertex(545, cy - bh * 0.66, 575, cy - bh * 0.82, 620, cy - bh * 0.83);
    bezierVertex(690, cy - bh * 0.85, 705, cy - bh * 0.60, 720, cy - bh * 0.55);
    bezierVertex(740, cy - bh * 0.50, 775, cy - bh * 0.95, 850, cy - bh);
    bezierVertex(940, cy - bh * 1.04, 1062, cy - bh * 0.66, 1062, cy);
    bezierVertex(1062, cy + bh * 0.66, 940, cy + bh * 1.04, 850, cy + bh);
    bezierVertex(775, cy + bh * 0.95, 740, cy + bh * 0.50, 720, cy + bh * 0.55);
    bezierVertex(705, cy + bh * 0.60, 690, cy + bh * 0.85, 620, cy + bh * 0.83);
    bezierVertex(575, cy + bh * 0.82, 545, cy + bh * 0.66, 520, cy + fh * 1.5);
    endShape(CLOSE);
  },

  _drawBody() {
    const cy = VIOLAO_GEO.cy;
    push();
    // gradiente vertical de madeira via canvas API subjacente
    const g = drawingContext.createLinearGradient(0, cy - 198, 0, cy + 198);
    g.addColorStop(0,   "#d9a25e");
    g.addColorStop(0.5, "#c98a44");
    g.addColorStop(1,   "#a96e2f");
    drawingContext.fillStyle = g;
    stroke(94, 61, 28);
    strokeWeight(3);
    this._bodyShape();

    // veio da madeira: linhas curvas translúcidas
    stroke(120, 80, 40, 40);
    strokeWeight(1);
    noFill();
    for (let k = -3; k <= 3; k++) {
      const yy = cy + k * 26;
      curve(560, yy - 8, 640, yy, 940, yy, 1040, yy - 8);
    }

    // filete (binding) claro por dentro da borda
    noFill();
    stroke(240, 217, 168, 130);
    strokeWeight(1.2);
    this._bodyShape();
    pop();
  },

  draw() {
    this._drawBody();
    // (escala, boca, cavalete, cabeça entram nas próximas tarefas)
  },
};
