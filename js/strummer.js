// ─── Strummer — detecção de cruzamento mouse × corda ────────────────────────
const Strummer = {
  _lastTrigger: new Array(6).fill(0),

  update(strings, activeChord) {
    if (!activeChord) return;  // roda custom vazia

    // mouse em coordenadas lógicas do design (a tela é escalada para caber na janela)
    const mX = lx(mouseX),  mY = ly(mouseY);
    const pX = lx(pmouseX), pY = ly(pmouseY);

    for (let i = 0; i < 6; i++) {
      const y   = activeView.stringY(i);
      const now = millis();

      // Cruzamento do segmento de mouse com a linha horizontal da corda i,
      // dentro da extensão tocável da view ativa.
      const crossed =
        ((pY <= y && mY > y) || (pY >= y && mY < y)) &&
        mX >= activeView.stringX0 && mX <= activeView.stringX1;

      if (crossed && mouseIsPressed && now - this._lastTrigger[i] > STRUM_COOLDOWN_MS) {
        // Corda abafada (×) nunca soa nem vibra.
        if (activeChord.fingering[i] === -1) {
          this._lastTrigger[i] = now;
          continue;
        }

        const dy  = abs(mY - pY);
        const vel = constrain(dy / 60, 0.15, 1.0);
        strings[i].pluck(vel);

        const note = noteForString(i, activeChord.fingering[i]);
        if (note) AudioEngine.playNote(i, note, vel);

        this._lastTrigger[i] = now;
      }
    }
  },
};
