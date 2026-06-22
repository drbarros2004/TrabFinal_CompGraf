// ─── GuitarString — física da onda estacionária ────────────────────────────
class GuitarString {
  constructor(index) {
    this.index     = index;
    this.decayRate = STRING_PHYSICS[index].decayRate;
    this.oscFreq   = STRING_PHYSICS[index].oscFreq;
    this.amplitude = 0;
    this.pluckTime = 0;
    this.isRinging = false;
  }

  pluck(velocity) {
    this.amplitude = constrain(velocity * 28, 4, 28);
    this.pluckTime = millis();
    this.isRinging = true;
  }

  update() {
    if (!this.isRinging) return;
    const elapsed = (millis() - this.pluckTime) / 1000;
    if (this.amplitude * exp(-this.decayRate * elapsed) < AMPLITUDE_REST_THRESHOLD) {
      this.isRinging = false;
    }
  }

  draw(fret = 0) {
    const y      = activeView.stringY(this.index);
    const x0     = activeView.stringX0;
    const x1     = activeView.stringX1;
    const xStart = fret > 0 ? activeView.fretX(fret - 0.5) : x0;

    strokeWeight(STRING_WIDTHS[this.index]);

    if (!this.isRinging) {
      const muted = fret < 0 && !activeView.showStringMarks;
      stroke(...(muted ? COLORS.stringMuted : COLORS.string));
      line(x0, y, x1, y);
      return;
    }

    const elapsed    = (millis() - this.pluckTime) / 1000;
    const amp        = this.amplitude * activeView.ampScale;
    const flashAmt   = constrain(elapsed / 0.08, 0, 1);
    const flashColor = lerpColor(color(255, 255, 240), color(...COLORS.stringActive), flashAmt);

    if (xStart > x0) {
      stroke(...COLORS.string);
      line(x0, y, xStart, y);
    }

    const Lvib = x1 - xStart;
    stroke(flashColor);
    noFill();
    beginShape();
    for (let n = 0; n <= STRING_VERTICES; n++) {
      const x      = xStart + (n / STRING_VERTICES) * Lvib;
      const offset = amp
        * sin(PI * (x - xStart) / Lvib)
        * exp(-this.decayRate * elapsed)
        * cos(this.oscFreq * elapsed);
      vertex(x, y + offset);
    }
    endShape();
  }
}
