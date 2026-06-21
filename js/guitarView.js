// ─── GuitarView — desenho do violão inteiro (construído por camadas) ─────────
const GuitarView = {
  // Pontos da silhueta do corpo, partilhados entre o traçado p5 e o path do canvas.
  _bodyPoints() {
    const cy = VIOLAO_GEO.cy;
    // Dreadnought: ombro superior largo, cintura suave, bojo inferior maior.
    // O lado do braço (esquerda) é quase reto, mas levemente curvo — sem parede.
    return {
      start: [515, cy - 95],
      curves: [
        [555, cy - 130, 600, cy - 156, 660, cy - 155],  // ombro → bojo superior (topo)
        [710, cy - 150, 725, cy - 120, 740, cy - 120],  // entra na cintura (topo)
        [775, cy - 120, 840, cy - 200, 905, cy - 200],  // bojo inferior (topo)
        [1000, cy - 200, 1072, cy - 120, 1065, cy],      // arredonda até a ponta
        [1072, cy + 120, 1000, cy + 200, 905, cy + 200], // bojo inferior (base)
        [840, cy + 200, 775, cy + 120, 740, cy + 120],   // sai da cintura (base)
        [725, cy + 120, 710, cy + 150, 660, cy + 155],   // bojo superior (base)
        [600, cy + 156, 555, cy + 130, 515, cy + 95],    // → ombro inferior
        [486, cy + 55, 486, cy - 55, 515, cy - 95],      // lado do braço: quase reto, curvo
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
    image(this._topTex(), 480, cy - 215, 610, 430);
    // luz vinda de cima + sombra embaixo
    const g = ctx.createLinearGradient(0, cy - 205, 0, cy + 205);
    g.addColorStop(0,    'rgba(255,246,222,0.28)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.0)');
    g.addColorStop(1,    'rgba(55,32,12,0.40)');
    ctx.fillStyle = g;
    ctx.fillRect(480, cy - 215, 610, 430);
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

    // trastes (só os que cabem dentro da escala; comprimem perto da boca)
    stroke(202, 167, 102);
    strokeWeight(2);
    for (let f = 1; f <= VIOLAO_GEO.numFrets; f++) {
      const x = activeView.fretX(f);
      if (x > x1) break;
      line(x, cy - VIOLAO_GEO.fh, x, cy + VIOLAO_GEO.fh);
    }

    // marcadores de posição (casas 3,5,7,9,12,15,17,19)
    noStroke();
    fill(231, 207, 154, 200);
    [3, 5, 7, 9, 12, 15, 17, 19].forEach((f) => {
      const xm = activeView.fretX(f - 0.5);
      if (xm <= x1) ellipse(xm, cy, 8);
    });

    // pestana (nut)
    noStroke();
    fill(232, 221, 200);
    rect(VIOLAO_GEO.fbX0 - 4, cy - VIOLAO_GEO.fh - 2, 7, VIOLAO_GEO.fh * 2 + 4, 2);
    pop();
  },

  _drawHeadstock() {
    const cy = VIOLAO_GEO.cy;
    const fh = VIOLAO_GEO.fh;
    push();

    // pá da cabeça (madeira escura), levemente flarada
    fill(46, 28, 15);
    stroke(24, 14, 7);
    strokeWeight(2);
    beginShape();
    vertex(120, cy - fh + 2);
    bezierVertex(96, cy - fh - 6, 44, cy - fh - 6, 22, cy - fh * 0.7);
    bezierVertex(14, cy - fh * 0.45, 14, cy + fh * 0.45, 22, cy + fh * 0.7);
    bezierVertex(44, cy + fh + 6, 96, cy + fh + 6, 120, cy + fh - 2);
    endShape(CLOSE);

    // tarraxas: 3 em cima, 3 embaixo, com os botões (chaves) para fora
    rectMode(CENTER);
    for (const x of [50, 75, 100]) {
      for (const dir of [-1, 1]) {        // -1 = topo, +1 = base
        const postY = cy + dir * (fh - 13); // poste na face, perto da borda
        const btnY  = cy + dir * (fh + 13); // botão além da borda (para fora)
        // eixo ligando poste ao botão
        stroke(120, 122, 126);
        strokeWeight(3);
        line(x, postY, x, btnY);
        // poste metálico onde a corda enrola
        noStroke();
        fill(200, 202, 206);
        ellipse(x, postY, 9, 9);
        fill(120, 122, 126);
        ellipse(x, postY, 4, 4);
        // botão/chave para fora (creme)
        stroke(70, 50, 30);
        strokeWeight(1);
        fill(232, 224, 205);
        rect(x, btnY, 10, 16, 3);
      }
    }
    pop();
  },

  draw() {
    this._drawBody();
    this._drawSoundhole();
    this._drawHeadstock();
    this._drawFretboard();  // por cima do corpo e da rosácea, até a boca
    this._drawBridge();
  },
};
