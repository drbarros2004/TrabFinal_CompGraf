// ─── MuteBlock — bloqueio das cordas abafadas do acorde ativo ────────────────
const MuteBlock = {
  enabled: false,
  x: 280, y: 520, w: 230, h: 34,   // pílula ao lado do ToggleButton de vista

  toggle() { this.enabled = !this.enabled; },

  hit(mx, my) {
    return mx >= this.x && mx <= this.x + this.w &&
           my >= this.y && my <= this.y + this.h;
  },

  // Retorna true se o clique foi consumido
  handleClick(mx, my) {
    if (!this.hit(mx, my)) return false;
    this.toggle();
    return true;
  },

  draw() {
    push();
    rectMode(CORNER);
    noStroke();
    fill(this.enabled ? color(...COLORS.menuActive) : color(28, 28, 28));
    rect(this.x, this.y, this.w, this.h, 8);
    fill(this.enabled ? color(28, 20, 16) : color(...COLORS.hint));
    textAlign(CENTER, CENTER);
    textSize(13);
    text(`Bloquear abafadas: ${this.enabled ? "ON" : "OFF"}  (B)`,
         this.x + this.w / 2, this.y + this.h / 2);
    noFill();
    stroke(94, 61, 28);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 8);
    pop();
  },
};
