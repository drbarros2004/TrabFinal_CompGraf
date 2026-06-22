// ─── Strummer — detecção de cruzamento mouse × corda ────────────────────────
const Strummer = {
  _lastTrigger: new Array(6).fill(0),
  strumSpeed: 0,   // velocidade vertical suavizada do ponteiro (px/ms)

  update(strings, activeChord) {
    if (!activeChord) return;  // roda custom vazia

    // mouse em coordenadas lógicas do design (a tela é escalada para caber na janela)
    const mX = lx(mouseX),  mY = ly(mouseY);
    const pX = lx(pmouseX), pY = ly(pmouseY);

    // Velocidade vertical suavizada, em px/ms (independente de framerate).
    // Decai para 0 quando o mouse não está pressionado.
    const inst = mouseIsPressed ? abs(mY - pY) / max(deltaTime, 1) : 0;
    this.strumSpeed = lerp(this.strumSpeed, inst, STRUM_DYNAMICS.smoothing);

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

        // Mesma intensidade para todas as cordas do gesto → strum coerente.
        const vel = this._strumVelocity();
        strings[i].pluck(vel);

        const note = noteForString(i, activeChord.fingering[i]);
        if (note) AudioEngine.playNote(i, note, vel);

        this._lastTrigger[i] = now;
      }
    }
  },

  // Mapeia a velocidade suavizada do ponteiro para intensidade 0..1,
  // com piso audível e curva perceptual que separa batidas fracas de fortes.
  _strumVelocity() {
    const d       = STRUM_DYNAMICS;
    const clamped = constrain((this.strumSpeed - d.slowSpeed) / (d.fastSpeed - d.slowSpeed), 0, 1);
    return d.minVel + (1 - d.minVel) * pow(clamped, d.curve);
  },
};
