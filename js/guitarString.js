// ─── GuitarString — física da onda estacionária ────────────────────────────
class GuitarString {
  constructor(index) {
    this.index  = index;
    this.lambda = STRING_PHYSICS[index].lambda;
    this.omega  = STRING_PHYSICS[index].omega;
    this.A      = 0;
    this.t0     = 0;
    this.isRinging = false;
  }

  pluck(velocity) {
    this.A  = constrain(velocity * 28, 4, 28);
    this.t0 = millis();
    this.isRinging = true;
  }

  update() {
    if (!this.isRinging) return;
    const dt = (millis() - this.t0) / 1000;
    if (this.A * exp(-this.lambda * dt) < AMPLITUDE_REST_THRESHOLD) {
      this.isRinging = false;
    }
  }

  draw(fret = 0) {
    const y  = activeView.stringY(this.index);
    const x0 = activeView.stringX0;
    const x1 = activeView.stringX1;
    // corda solta (0) ou abafada: vibra do início; presa: vibra a partir do dedo
    // (centro da casa, onde a bolinha é desenhada) — fica melhor visualmente
    const xStart = fret > 0 ? activeView.fretX(fret - 0.5) : x0;

    strokeWeight(STRING_WIDTHS[this.index]);

    if (!this.isRinging) {
      stroke(...COLORS.string);
      line(x0, y, x1, y);
      return;
    }

    const dt         = (millis() - this.t0) / 1000;
    const amp        = this.A * activeView.ampScale;
    const flashAmt   = constrain((millis() - this.t0) / 80, 0, 1);
    const flashColor = lerpColor(color(255, 255, 240), color(...COLORS.stringActive), flashAmt);

    // segmento parado à esquerda do dedo (não vibra)
    if (xStart > x0) {
      stroke(...COLORS.string);
      line(x0, y, xStart, y);
    }

    // segmento vibrante: nós em xStart e x1
    const Lvib = x1 - xStart;
    stroke(flashColor);
    noFill();
    beginShape();
    for (let n = 0; n <= STRING_VERTICES; n++) {
      const x = xStart + (n / STRING_VERTICES) * Lvib;
      const offset = amp
        * sin(PI * (x - xStart) / Lvib)
        * exp(-this.lambda * dt)
        * cos(this.omega * dt);
      vertex(x, y + offset);
    }
    endShape();
  }
}
