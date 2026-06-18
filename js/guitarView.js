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
    fill(255); // garante _doFill=true; o fillStyle abaixo sobrepõe a cor pelo gradiente
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

  _drawSoundhole() {
    const cx = 855, cy = VIOLAO_GEO.cy, r = 75;
    push();
    // anel externo (madeira mais escura)
    noFill();
    stroke(122, 90, 48);
    strokeWeight(9);
    ellipse(cx, cy, (r + 8) * 2);
    // buraco escuro
    noStroke();
    const g = drawingContext.createRadialGradient(cx, cy, r * 0.55, cx, cy, r);
    g.addColorStop(0,    "#0d0905");
    g.addColorStop(0.85, "#1c130a");
    g.addColorStop(1,    "#3a2614");
    fill(255); // garante _doFill=true; o fillStyle abaixo sobrepõe pela cor do gradiente
    drawingContext.fillStyle = g;
    ellipse(cx, cy, r * 2);
    // rosácea: anel de pontinhos
    fill(231, 207, 154, 180);
    const rr = r + 14;
    for (let a = 0; a < TWO_PI; a += TWO_PI / 36) {
      ellipse(cx + rr * cos(a), cy + rr * sin(a), 3.2);
    }
    pop();
  },

  _drawBridge() {
    const cy = VIOLAO_GEO.cy, bx = 965;
    push();
    rectMode(CENTER);
    // base do cavalete
    fill(42, 26, 13);
    stroke(74, 48, 24);
    strokeWeight(2);
    rect(bx, cy, 60, 126, 8);
    // pininhos onde as cordas ancoram
    noStroke();
    fill(228, 220, 200);
    for (let i = 0; i < 6; i++) {
      ellipse(bx + 8, activeView.stringY(i), 6);
    }
    pop();
  },

  _drawFretboard() {
    const cy = VIOLAO_GEO.cy, fh = 37;
    const x0 = VIOLAO_GEO.fbX0, x1 = VIOLAO_GEO.fbX1;
    push();
    rectMode(CORNER);
    // escala (madeira escura) com gradiente próprio
    const g = drawingContext.createLinearGradient(0, cy - fh, 0, cy + fh);
    g.addColorStop(0, "#3b2415");
    g.addColorStop(1, "#24160c");
    fill(255); // garante _doFill=true; o fillStyle abaixo sobrepõe pela cor do gradiente
    drawingContext.fillStyle = g;
    stroke(26, 15, 7);
    strokeWeight(2);
    rect(x0, cy - fh, x1 - x0, fh * 2);

    // trastes
    stroke(202, 167, 102);
    strokeWeight(2);
    for (let f = 1; f <= VIOLAO_GEO.numFrets; f++) {
      const x = activeView.fretX(f);
      line(x, cy - fh, x, cy + fh);
    }

    // marcadores de posição (casas 3, 5, 7)
    noStroke();
    fill(231, 207, 154, 200);
    [3, 5, 7].forEach((f) => {
      ellipse(activeView.fretX(f - 0.5), cy, 8);
    });

    // pestana (nut)
    noStroke();
    fill(232, 221, 200);
    rect(VIOLAO_GEO.fbX0 - 4, cy - fh - 2, 7, fh * 2 + 4, 2);
    pop();
  },

  _drawHeadstock() {
    const cy = VIOLAO_GEO.cy, fh = 37;
    push();
    // pá da cabeça (madeira escura), levemente flarada
    fill(58, 36, 20);
    stroke(28, 17, 8);
    strokeWeight(2);
    beginShape();
    vertex(118, cy - fh * 0.95);
    bezierVertex(90, cy - fh, 60, cy - fh, 38, cy - fh * 0.92);
    bezierVertex(24, cy - fh * 0.86, 24, cy + fh * 0.86, 38, cy + fh * 0.92);
    bezierVertex(60, cy + fh, 90, cy + fh, 118, cy + fh * 0.95);
    endShape(CLOSE);

    // tarraxas: 3 de cada lado, cinza metálico
    const pegYs = [cy - 22, cy, cy + 22];
    for (const py of pegYs) {
      for (const px of [55, 100]) {
        fill(207, 210, 214);
        stroke(125, 128, 133);
        strokeWeight(1.5);
        ellipse(px, py, 12);
      }
    }
    pop();
  },

  draw() {
    this._drawHeadstock();
    this._drawFretboard();
    this._drawBody();
    this._drawSoundhole();
    this._drawBridge();
  },
};
