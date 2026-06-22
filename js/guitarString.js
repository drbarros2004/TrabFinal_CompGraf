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

  stringColor(fret, elapsed) {
    if (!this.isRinging) {
      const muted = fret < 0 && !activeView.showStringMarks;
      return muted ? color(...COLORS.stringMuted) : color(...COLORS.string);
    }
    const flashAmt = constrain(elapsed / 0.08, 0, 1);
    return lerpColor(color(255, 255, 240), color(...COLORS.stringActive), flashAmt);
  }

  waveVertices(xStart, x1, elapsed) {
    const y   = activeView.stringY(this.index);
    const amp = this.amplitude * activeView.ampScale;
    const L   = x1 - xStart;
    const pts = [];
    // onda estacionária: sin(πx/L) × e^(-decayRate·t) × cos(oscFreq·t)
    for (let n = 0; n <= STRING_VERTICES; n++) {
      const x      = xStart + (n / STRING_VERTICES) * L;
      const offset = amp
        * sin(PI * (x - xStart) / L)
        * exp(-this.decayRate * elapsed)
        * cos(this.oscFreq * elapsed);
      pts.push([x, y + offset]);
    }
    return pts;
  }

  draw(fret = 0) {
    const y       = activeView.stringY(this.index);
    const x0      = activeView.stringX0;
    const x1      = activeView.stringX1;
    const xStart  = fret > 0 ? activeView.fretX(fret - 0.5) : x0;
    const elapsed = this.isRinging ? (millis() - this.pluckTime) / 1000 : 0;

    strokeWeight(STRING_WIDTHS[this.index]);

    if (!this.isRinging) {
      stroke(this.stringColor(fret, elapsed));
      line(x0, y, x1, y);
      return;
    }

    if (xStart > x0) {
      stroke(...COLORS.string);
      line(x0, y, xStart, y);
    }

    stroke(this.stringColor(fret, elapsed));
    noFill();
    beginShape();
    for (const [vx, vy] of this.waveVertices(xStart, x1, elapsed)) {
      vertex(vx, vy);
    }
    endShape();
  }
}
