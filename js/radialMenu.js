// ─── RadialMenu ──────────────────────────────────────────────────────────────
class RadialMenu {
  constructor() {
    this.wheelIndex = 0;
    this.chordIndex = WHEELS.map(() => 0);  // índice de acorde por roda
  }

  getActiveWheel()  { return WHEELS[this.wheelIndex]; }

  getActiveChord() {
    const w = this.getActiveWheel();
    if (w.chords.length === 0) return null;
    return w.chords[this.chordIndex[this.wheelIndex]];
  }

  getActiveFingering() {
    const c = this.getActiveChord();
    return c ? c.fingering : null;
  }

  navigate(dir) {                    // ←/→ : acorde dentro da roda
    const w = this.getActiveWheel();
    if (w.chords.length === 0) return;
    const n = w.chords.length;
    this.chordIndex[this.wheelIndex] = (this.chordIndex[this.wheelIndex] + dir + n) % n;
  }

  navigateWheel(dir) {               // ↑/↓ : troca de roda
    this.wheelIndex = (this.wheelIndex + dir + WHEELS.length) % WHEELS.length;
  }

  selectByNumber(n) {                // teclas 1..9
    const w = this.getActiveWheel();
    if (n >= 1 && n <= w.chords.length) this.chordIndex[this.wheelIndex] = n - 1;
  }

  // True se (mx,my) está dentro do miolo da roda (usado p/ abrir o construtor)
  hitCenter(mx, my) {
    const { cx, cy, r } = activeView.menuPos;
    return dist(mx, my, cx, cy) < r * 0.55;
  }

  draw() {
    const { cx, cy, r, dotR } = activeView.menuPos;

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
