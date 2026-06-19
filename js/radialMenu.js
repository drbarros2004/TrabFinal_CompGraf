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
    const wheel  = this.getActiveWheel();
    const chords = wheel.chords;
    const isCustomEmpty = wheel.id === "custom" && chords.length === 0;

    push();

    // Anel de fundo
    noFill();
    stroke(...COLORS.menuRing);
    strokeWeight(1);
    if (isCustomEmpty) drawingContext.setLineDash([5, 5]);
    ellipse(cx, cy, r * 2, r * 2);
    drawingContext.setLineDash([]);

    if (isCustomEmpty) {
      // Estado vazio: "+" central que abre o construtor
      noStroke();
      fill(...COLORS.menuActive);
      textAlign(CENTER, CENTER);
      textSize(34);
      text("+", cx, cy - 6);
      textSize(11);
      fill(...COLORS.hint);
      text("adicionar", cx, cy + 16);
    } else {
      const n      = chords.length;
      const active = this.chordIndex[this.wheelIndex];

      // Rótulos e pontos
      for (let i = 0; i < n; i++) {
        const angle = -HALF_PI + i * (TWO_PI / n);
        const px = cx + r * cos(angle);
        const py = cy + r * sin(angle);
        const isActive = i === active;

        noStroke();
        fill(...(isActive ? COLORS.menuActive : COLORS.menuRing));
        ellipse(px, py, dotR * 2);

        fill(...(isActive ? COLORS.menuActive : COLORS.menuText));
        textAlign(CENTER, CENTER);
        textSize(isActive ? 14 : 12);
        text(chords[i].label, px + cos(angle) * 18, py + sin(angle) * 18);
      }

      // Nome do acorde ativo no centro
      fill(...COLORS.menuActive);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(20);
      textStyle(BOLD);
      text(chords[active].label, cx, cy);
      textStyle(NORMAL);
    }

    // ── Dots de roda (abaixo do anel) ──
    const dotsY = cy + r + WHEEL_DOTS.yOffset;
    const total = (WHEELS.length - 1) * WHEEL_DOTS.gap;
    const startX = cx - total / 2;
    for (let i = 0; i < WHEELS.length; i++) {
      const isActive = i === this.wheelIndex;
      fill(...(isActive ? COLORS.menuActive : COLORS.menuRing));
      noStroke();
      ellipse(startX + i * WHEEL_DOTS.gap, dotsY,
              (isActive ? WHEEL_DOTS.rActive : WHEEL_DOTS.rInactive) * 2);
    }

    // Nome da roda + posição
    fill(...COLORS.hint);
    textAlign(CENTER, CENTER);
    textSize(11);
    text(`${wheel.name} · ${this.wheelIndex + 1}/${WHEELS.length}`, cx, dotsY + 16);

    pop();
  }
}
