// ─── Strummer — detecção de cruzamento mouse × corda ────────────────────────
const Strummer = {
  _lastTrigger: new Array(6).fill(0),

  update(strings, activeChord) {
    if (typeof CustomChordBuilder !== "undefined" && CustomChordBuilder.active) return; // não toca durante o construtor
    if (!activeChord) return;  // roda custom vazia

    for (let i = 0; i < 6; i++) {
      const y   = activeView.stringY(i);
      const now = millis();

      const crossed =
        ((pmouseY <= y && mouseY > y) || (pmouseY >= y && mouseY < y)) &&
        mouseX >= activeView.stringX0 && mouseX <= activeView.stringX1;

      if (crossed && mouseIsPressed && now - this._lastTrigger[i] > STRUM_COOLDOWN_MS) {
        const muted = activeChord.fingering[i] === -1;

        // Bloqueio: corda abafada fica totalmente inerte (sem vibração e sem som)
        if (typeof MuteBlock !== "undefined" && MuteBlock.enabled && muted) {
          this._lastTrigger[i] = now;
          continue;
        }

        const dy  = abs(mouseY - pmouseY);
        const vel = constrain(dy / 60, 0.15, 1.0);
        strings[i].pluck(vel);

        const note = activeChord.notes[i];
        if (note) AudioEngine.playNote(i, note, vel);  // null = sem nota (custom abafada)

        this._lastTrigger[i] = now;
      }
    }
  },
};
