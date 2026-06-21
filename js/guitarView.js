// ─── GuitarView — desenho do violão inteiro (construído por camadas) ─────────
const GuitarView = {
  // Pontos da silhueta do corpo, partilhados entre o traçado p5 e o path do canvas.
  _bodyPoints() {
    const cy = VIOLAO_GEO.cy;
    // Dreadnought: ombro superior largo, cintura suave, bojo inferior maior.
    // O lado do braço (esquerda) é quase reto, mas levemente curvo — sem parede.
    // Cintura mais rasa e com tangente horizontal no vale → "buraco" mais suave.
    return {
      start: [550, cy - 100],
      curves: [
        [590, cy - 140, 640, cy - 172, 700, cy - 170],  // ombro → bojo superior (topo)
        [745, cy - 168, 770, cy - 150, 788, cy - 150],  // entra na cintura (mais suave)
        [812, cy - 150, 895, cy - 218, 965, cy - 218],  // sai da cintura → bojo inferior
        [1065, cy - 218, 1138, cy - 128, 1132, cy],      // arredonda até a ponta
        [1138, cy + 128, 1065, cy + 218, 965, cy + 218], // bojo inferior (base)
        [895, cy + 218, 812, cy + 150, 788, cy + 150],   // cintura (base, mais suave)
        [770, cy + 150, 745, cy + 168, 700, cy + 170],   // → bojo superior (base)
        [640, cy + 172, 590, cy + 140, 550, cy + 100],   // → ombro inferior
        [516, cy + 58, 516, cy - 58, 550, cy - 100],     // lado do braço: quase reto, curvo
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
    if (!this._tex) this._tex = this._makeWoodTexture(640, 456, [216, 170, 110], [150, 100, 55]);
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
    image(this._topTex(), 508, cy - 228, 668, 456);
    // luz vinda de cima + sombra embaixo
    const g = ctx.createLinearGradient(0, cy - 228, 0, cy + 228);
    g.addColorStop(0,    'rgba(255,246,222,0.28)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.0)');
    g.addColorStop(1,    'rgba(55,32,12,0.40)');
    ctx.fillStyle = g;
    ctx.fillRect(508, cy - 228, 668, 456);
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
    const cx = 795, cy = VIOLAO_GEO.cy, r = 72;
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
    const cy = VIOLAO_GEO.cy, bx = VIOLAO_GEO.x1;  // nos pinos, onde as cordas terminam
    push();
    rectMode(CENTER);
    noStroke();

    // bloco marrom com os 6 pinos (proporcionalmente maior que o rastilho)
    const blockW = 32, blockX = bx;
    fill(30, 18, 9);
    rect(blockX, cy, blockW, 116, 3);
    fill(216, 206, 186);
    for (let i = 0; i < 6; i++) ellipse(blockX, activeView.stringY(i), 6);

    // rastilho (saddle) claro, colado à esquerda do bloco (lado da boca)
    const saddleW = 8;
    const saddleX = blockX - blockW / 2 - saddleW / 2;  // encostado no bloco
    fill(228, 219, 199);
    rect(saddleX, cy, saddleW, 84, 1);
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
    const nutX = VIOLAO_GEO.fbX0;
    const H = 58;                 // meia-altura da pá (maior → cordas saem para fora)
    const postY = 42;             // |Δy| do poste: além das cordas (span±30) → leque p/ fora
    // poste de cada corda [x, dir]: cordas de cima → tarraxas da direita p/ esquerda
    // na linha de cima; cordas de baixo → da direita p/ esquerda na linha de baixo.
    const posts = [
      [138, -1], [98, -1], [58, -1],   // cordas 1,2,3 (de cima)
      [58,  1], [98,  1], [138,  1],   // cordas 4,5,6 (de baixo)
    ];
    push();

    // pá da cabeça (madeira escura), comprida e levemente flarada
    fill(46, 28, 15);
    stroke(24, 14, 7);
    strokeWeight(2);
    beginShape();
    vertex(nutX, cy - H + 5);
    bezierVertex(132, cy - H - 9, 56, cy - H - 9, 26, cy - H * 0.6);
    bezierVertex(16, cy - H * 0.36, 16, cy + H * 0.36, 26, cy + H * 0.6);
    bezierVertex(56, cy + H + 9, 132, cy + H + 9, nutX, cy + H - 5);
    endShape(CLOSE);

    // cordas: da pestana até o seu poste (em leque, como num violão real)
    const frets = (typeof menu !== 'undefined' && menu) ? menu.getActiveFingering() : null;
    strokeWeight(1.6);
    for (let i = 0; i < 6; i++) {
      const [px, dir] = posts[i];
      const muted = frets && frets[i] < 0;
      stroke(...(muted ? COLORS.stringMuted : COLORS.string));
      line(nutX, activeView.stringY(i), px, cy + dir * postY);
    }

    // tarraxas: poste metálico na face + botão (chave) para fora
    rectMode(CENTER);
    for (const [px, dir] of posts) {
      const py   = cy + dir * postY;
      const btnY = cy + dir * (H + 14);
      stroke(120, 122, 126);
      strokeWeight(3);
      line(px, py, px, btnY);           // eixo poste→botão
      noStroke();
      fill(200, 202, 206);
      ellipse(px, py, 10, 10);          // poste (corda enrola aqui)
      fill(120, 122, 126);
      ellipse(px, py, 4, 4);
      stroke(70, 50, 30);
      strokeWeight(1);
      fill(232, 224, 205);
      rect(px, btnY, 11, 18, 3);        // botão/chave para fora
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
