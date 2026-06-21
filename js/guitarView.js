// ─── GuitarView — desenho do violão inteiro (construído por camadas) ─────────
const GuitarView = {
  // Pontos da silhueta do corpo, partilhados entre o traçado p5 e o path do canvas.
  _bodyPoints() {
    const cy = VIOLAO_GEO.cy;
    // meia-alturas: junta do braço, bojo superior, cintura, bojo inferior
    return {
      start: [520, cy - 68],
      curves: [
        [560, cy - 90,  600, cy - 150, 660, cy - 150],  // bojo superior (topo)
        [715, cy - 150, 735, cy - 120, 775, cy - 120],  // entra na cintura
        [815, cy - 120, 850, cy - 190, 905, cy - 190],  // bojo inferior (topo)
        [995, cy - 190, 1075, cy - 110, 1070, cy],       // arredonda até a ponta
        [1075, cy + 110, 995, cy + 190, 905, cy + 190],  // bojo inferior (base)
        [850, cy + 190, 815, cy + 120, 775, cy + 120],  // sai da cintura
        [735, cy + 120, 715, cy + 150, 660, cy + 150],  // bojo superior (base)
        [600, cy + 150, 560, cy + 90,  520, cy + 68],   // volta à junta do braço
      ],
    };
  },

  // Traça a silhueta no p5 (para contorno/stroke).
  _bodyShape() {
    const p = this._bodyPoints();
    beginShape();
    vertex(p.start[0], p.start[1]);
    for (const c of p.curves) bezierVertex(c[0], c[1], c[2], c[3], c[4], c[5]);
    endShape(CLOSE);
  },

  // Traça a silhueta no contexto canvas (para clip/fill com textura).
  _traceBody(ctx) {
    const p = this._bodyPoints();
    ctx.beginPath();
    ctx.moveTo(p.start[0], p.start[1]);
    for (const c of p.curves) ctx.bezierCurveTo(c[0], c[1], c[2], c[3], c[4], c[5]);
    ctx.closePath();
  },

  // Gera uma textura de madeira num buffer offscreen (sem asset externo).
  _makeWoodTexture(w, h, base, streak) {
    const g = createGraphics(w, h);
    g.background(base[0], base[1], base[2]);
    g.noFill();
    g.strokeWeight(1);
    // veio horizontal (corre ao longo do tampo, paralelo às cordas)
    const nLines = floor(h / 2.5);
    for (let i = 0; i < nLines; i++) {
      const y = (i / nLines) * h;
      const a = 22 + 46 * noise(i * 0.35);
      g.stroke(streak[0], streak[1], streak[2], a);
      g.beginShape();
      for (let x = -4; x <= w + 4; x += 10) {
        const wob = (noise(i * 0.18, x * 0.012) - 0.5) * 9;
        g.vertex(x, y + wob);
      }
      g.endShape();
    }
    // leve escurecimento nas bordas (topo/base)
    g.noStroke();
    for (let y = 0; y < h; y++) {
      const t = abs(y / h - 0.5) * 2;
      g.stroke(40, 24, 10, t * 28);
      g.line(0, y, w, y);
    }
    return g;
  },

  _topTex() {
    if (!this._tex) this._tex = this._makeWoodTexture(600, 430, [216, 170, 110], [150, 100, 55]);
    return this._tex;
  },

  _drawBody() {
    const cy = VIOLAO_GEO.cy;
    const ctx = drawingContext;
    push();

    // sombra projetada sob o corpo
    ctx.save();
    this._traceBody(ctx);
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 34;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#1a120a';
    ctx.fill();
    ctx.restore();

    // preenchimento por textura (recorte na silhueta)
    ctx.save();
    this._traceBody(ctx);
    ctx.clip();
    image(this._topTex(), 500, cy - 215, 600, 430);
    // luz vinda de cima + sombra embaixo
    const g = ctx.createLinearGradient(0, cy - 205, 0, cy + 205);
    g.addColorStop(0,    'rgba(255,246,222,0.28)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.0)');
    g.addColorStop(1,    'rgba(55,32,12,0.40)');
    ctx.fillStyle = g;
    ctx.fillRect(500, cy - 215, 600, 430);
    ctx.restore();

    // contorno escuro + filete (binding) claro por dentro
    noFill();
    stroke(74, 48, 24);
    strokeWeight(3);
    this._bodyShape();
    stroke(240, 225, 185, 160);
    strokeWeight(1.3);
    this._bodyShape();
    pop();
  },

  _drawSoundhole() {
    const cx = 755, cy = VIOLAO_GEO.cy, r = 75;
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
    const cy = VIOLAO_GEO.cy, bx = 945;
    push();
    rectMode(CENTER);
    // base do cavalete
    fill(36, 22, 11);
    stroke(20, 12, 6);
    strokeWeight(1.5);
    rect(bx, cy, 80, 150, 6);
    // rastilho (saddle) claro, do lado da boca
    noStroke();
    fill(225, 215, 195);
    rect(bx - 20, cy, 6, 132, 2);
    // tie block + furos das cordas
    fill(24, 14, 7);
    rect(bx + 16, cy, 30, 132, 3);
    fill(210, 200, 180);
    for (let i = 0; i < 6; i++) ellipse(bx + 16, activeView.stringY(i), 5);
    pop();
  },

  _drawFretboard() {
    const cy = VIOLAO_GEO.cy;
    const x0 = VIOLAO_GEO.fbX0, x1 = VIOLAO_GEO.fbX1;
    push();
    rectMode(CORNER);
    // escala (madeira escura) com gradiente próprio
    const g = drawingContext.createLinearGradient(0, cy - VIOLAO_GEO.fh, 0, cy + VIOLAO_GEO.fh);
    g.addColorStop(0, "#3b2415");
    g.addColorStop(1, "#24160c");
    fill(255); // garante _doFill=true; o fillStyle abaixo sobrepõe pela cor do gradiente
    drawingContext.fillStyle = g;
    stroke(26, 15, 7);
    strokeWeight(2);
    rect(x0, cy - VIOLAO_GEO.fh, x1 - x0, VIOLAO_GEO.fh * 2);

    // trastes
    stroke(202, 167, 102);
    strokeWeight(2);
    for (let f = 1; f <= VIOLAO_GEO.numFrets; f++) {
      const x = activeView.fretX(f);
      line(x, cy - VIOLAO_GEO.fh, x, cy + VIOLAO_GEO.fh);
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
    rect(VIOLAO_GEO.fbX0 - 4, cy - VIOLAO_GEO.fh - 2, 7, VIOLAO_GEO.fh * 2 + 4, 2);
    pop();
  },

  _drawHeadstock() {
    const cy = VIOLAO_GEO.cy;
    push();
    // pá da cabeça (madeira escura), levemente flarada
    fill(58, 36, 20);
    stroke(28, 17, 8);
    strokeWeight(2);
    beginShape();
    vertex(118, cy - VIOLAO_GEO.fh * 0.95);
    bezierVertex(90, cy - VIOLAO_GEO.fh, 60, cy - VIOLAO_GEO.fh, 38, cy - VIOLAO_GEO.fh * 0.92);
    bezierVertex(24, cy - VIOLAO_GEO.fh * 0.86, 24, cy + VIOLAO_GEO.fh * 0.86, 38, cy + VIOLAO_GEO.fh * 0.92);
    bezierVertex(60, cy + VIOLAO_GEO.fh, 90, cy + VIOLAO_GEO.fh, 118, cy + VIOLAO_GEO.fh * 0.95);
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
