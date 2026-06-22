// ─── Strummer — detecção de cruzamento mouse × corda ────────────────────────
const Strummer = {
  _lastTrigger: new Array(6).fill(0),
  strumSpeed: 0,

  update(strings, activeChord) {
    if (!activeChord) return;

    const mX = lx(mouseX),  mY = ly(mouseY);
    const pY = ly(pmouseY);

    const inst = mouseIsPressed ? abs(mY - pY) / max(deltaTime, 1) : 0;
    this.strumSpeed = lerp(this.strumSpeed, inst, STRUM_DYNAMICS.smoothing);

    for (let i = 0; i < 6; i++) {
      const y   = activeView.stringY(i);
      const now = millis();

      if (this.crossedString(y, pY, mY, mX) && mouseIsPressed && now - this._lastTrigger[i] > STRUM_COOLDOWN_MS) {
        if (activeChord.fingering[i] === -1) {
          this._lastTrigger[i] = now;
          continue;
        }

        const vel = this.velocityFromSpeed(this.strumSpeed);
        strings[i].pluck(vel);

        const note = noteForString(i, activeChord.fingering[i]);
        if (note) AudioEngine.playNote(i, note, vel);

        this._lastTrigger[i] = now;
      }
    }
  },

  crossedString(y, prevY, currY, currX) {
    const verticalCross = (prevY <= y && currY > y) || (prevY >= y && currY < y);
    const inPlayRange   = currX >= activeView.stringX0 && currX <= activeView.stringX1;
    return verticalCross && inPlayRange;
  },

  velocityFromSpeed(speed) {
    const d       = STRUM_DYNAMICS;
    const clamped = constrain((speed - d.slowSpeed) / (d.fastSpeed - d.slowSpeed), 0, 1);
    return d.minVel + (1 - d.minVel) * pow(clamped, d.curve);
  },
};
