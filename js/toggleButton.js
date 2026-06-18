// ─── ToggleButton — pílula de dois rótulos (Braço / Violão) ─────────────────
const ToggleButton = {
  x: 80, y: 520, w: 180, h: 34,

  draw() {
    push();
    rectMode(CORNER);
    textAlign(CENTER, CENTER);
    textSize(13);
    const segs = [["Braço", "braco"], ["Violão", "violao"]];
    const halfW = this.w / 2;

    for (let i = 0; i < 2; i++) {
      const sx     = this.x + i * halfW;
      const active = activeView.name === segs[i][1];
      noStroke();
      fill(active ? color(...COLORS.menuActive) : color(28, 28, 28));
      // cantos arredondados só nas extremidades externas (tl, tr, br, bl)
      if (i === 0) rect(sx, this.y, halfW, this.h, 8, 0, 0, 8);
      else         rect(sx, this.y, halfW, this.h, 0, 8, 8, 0);
      fill(active ? color(28, 20, 16) : color(...COLORS.hint));
      text(segs[i][0], sx + halfW / 2, this.y + this.h / 2);
    }

    // contorno em tom de madeira
    noFill();
    stroke(94, 61, 28);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 8);
    pop();
  },

  hit(mx, my) {
    return mx >= this.x && mx <= this.x + this.w &&
           my >= this.y && my <= this.y + this.h;
  },

  // Retorna true se o clique foi consumido (e portanto não deve virar strum)
  handleClick(mx, my) {
    if (!this.hit(mx, my)) return false;
    activeView = (activeView === VIEWS.braco) ? VIEWS.violao : VIEWS.braco;
    return true;
  },
};
