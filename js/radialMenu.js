// ─── RadialMenu ──────────────────────────────────────────────────────────────
class RadialMenu {
  constructor() {
    this.activeIndex   = 0;
    this._colors       = null;  // p5.Color atual de cada item (lerp)
    this._targetColors = null;  // alvo do lerp — atualizado ao trocar acorde
  }

  getActiveChord() {
    return CHORDS[CHORD_ORDER[this.activeIndex]];
  }

  navigate(dir) { // dir = -1 (esq) ou +1 (dir)
    this.activeIndex = (this.activeIndex + dir + CHORD_ORDER.length) % CHORD_ORDER.length;
    if (this._targetColors) this._updateTargetColors();
  }

  selectByNumber(n) { // tecla 1–7
    if (n >= 1 && n <= 7) {
      this.activeIndex = n - 1;
      if (this._targetColors) this._updateTargetColors();
    }
  }

  _updateTargetColors() {
    for (let i = 0; i < CHORD_ORDER.length; i++) {
      this._targetColors[i] = color(...(i === this.activeIndex ? COLORS.menuActive : COLORS.menuRing));
    }
  }

  draw() {
    const { cx, cy, r, dotR } = RADIAL;

    // Inicializar arrays de cores na primeira execução (color() não está disponível antes de setup())
    if (!this._colors) {
      this._colors       = Array.from({ length: CHORD_ORDER.length }, (_, i) =>
        color(...(i === this.activeIndex ? COLORS.menuActive : COLORS.menuRing))
      );
      this._targetColors = Array.from({ length: CHORD_ORDER.length }, (_, i) =>
        color(...(i === this.activeIndex ? COLORS.menuActive : COLORS.menuRing))
      );
    }

    // Lerp frame-rate independent: k = 1 - 0.005^(dt/1000) — converge suavemente ~200ms
    const k = 1 - Math.pow(0.005, deltaTime / 1000);
    for (let i = 0; i < CHORD_ORDER.length; i++) {
      this._colors[i] = lerpColor(this._colors[i], this._targetColors[i], k);
    }

    push();
    noFill();

    // Anel de fundo
    stroke(...COLORS.menuRing);
    strokeWeight(1);
    ellipse(cx, cy, r * 2, r * 2);

    // Rótulos e pontos
    for (let i = 0; i < CHORD_ORDER.length; i++) {
      const angle = -HALF_PI + i * (TWO_PI / CHORD_ORDER.length);
      const px = cx + r * cos(angle);
      const py = cy + r * sin(angle);
      const isActive = i === this.activeIndex;

      fill(this._colors[i]);
      noStroke();
      ellipse(px, py, dotR * 2);

      textAlign(CENTER, CENTER);
      textSize(isActive ? 14 : 12);
      text(CHORD_ORDER[i], px + cos(angle) * 18, py + sin(angle) * 18);
    }

    // Nome do acorde ativo no centro
    fill(...COLORS.menuActive);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    textStyle(BOLD);
    text(this.getActiveChord().label, cx, cy);
    textStyle(NORMAL);

    pop();
  }
}
