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

  draw() {
    const y  = activeView.stringY(this.index);
    const x0 = activeView.stringX0;
    const x1 = activeView.stringX1;
    const L  = x1 - x0;
    const dt = (millis() - this.t0) / 1000;

    strokeWeight(STRING_WIDTHS[this.index]);

    if (!this.isRinging) {
      stroke(...COLORS.string);
      line(x0, y, x1, y);
      return;
    }

    const amp        = this.A * activeView.ampScale;
    const flashAmt   = constrain((millis() - this.t0) / 80, 0, 1);
    const flashColor = lerpColor(color(255, 255, 240), color(...COLORS.stringActive), flashAmt);
    stroke(flashColor);
    noFill();
    beginShape();
    for (let n = 0; n <= STRING_VERTICES; n++) {
      const x = x0 + (n / STRING_VERTICES) * L;
      const offset = amp
        * sin(PI * (x - x0) / L)
        * exp(-this.lambda * dt)
        * cos(this.omega * dt);
      vertex(x, y + offset);
    }
    endShape();
  }
}
