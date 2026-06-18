// ─── Strummer — detecção de cruzamento mouse × corda ────────────────────────
const Strummer = {
  _lastTrigger: new Array(6).fill(0),

  // Chamado em draw() com as 6 cordas e o acorde ativo
  update(strings, activeChord) {
    for (let i = 0; i < 6; i++) {
      const y   = activeView.stringY(i);
      const now = millis();

      // Cruzamento do segmento de mouse com a linha horizontal da corda i,
      // dentro da extensão tocável da view ativa.
      const crossed =
        ((pmouseY <= y && mouseY > y) || (pmouseY >= y && mouseY < y)) &&
        mouseX >= activeView.stringX0 && mouseX <= activeView.stringX1;

      if (crossed && mouseIsPressed && now - this._lastTrigger[i] > STRUM_COOLDOWN_MS) {
        const dy  = abs(mouseY - pmouseY);
        const vel = constrain(dy / 60, 0.15, 1.0);
        strings[i].pluck(vel);
        AudioEngine.playNote(i, activeChord.notes[i], vel);
        this._lastTrigger[i] = now;
      }
    }
  },
};
