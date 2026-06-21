// ─── Strummer — detecção de cruzamento mouse × corda ────────────────────────
const Strummer = {
  _lastTrigger: new Array(6).fill(0),

  update(strings, activeChord) {
    if (!activeChord) return;  // roda custom vazia

    for (let i = 0; i < 6; i++) {
      const y   = activeView.stringY(i);
      const now = millis();

      // Cruzamento do segmento de mouse com a linha horizontal da corda i,
      // dentro da extensão tocável da view ativa.
      const crossed =
        ((pmouseY <= y && mouseY > y) || (pmouseY >= y && mouseY < y)) &&
        mouseX >= activeView.stringX0 && mouseX <= activeView.stringX1;

      if (crossed && mouseIsPressed && now - this._lastTrigger[i] > STRUM_COOLDOWN_MS) {
        // Corda abafada (×) nunca soa nem vibra.
        if (activeChord.fingering[i] === -1) {
          this._lastTrigger[i] = now;
          continue;
        }

        const dy  = abs(mouseY - pmouseY);
        const vel = constrain(dy / 60, 0.15, 1.0);
        strings[i].pluck(vel);

        const note = noteForString(i, activeChord.fingering[i]);
        if (note) AudioEngine.playNote(i, note, vel);

        this._lastTrigger[i] = now;
      }
    }
  },
};
