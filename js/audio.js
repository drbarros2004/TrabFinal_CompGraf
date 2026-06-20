// ─── AudioEngine — Sampler com amostras reais de violão acústico ─────────────
const AudioEngine = {
  _ready:        false,
  _initializing: false,
  _sampler:      null,
  _ringing:      new Array(6).fill(null),

  async init() {
    if (this._ready || this._initializing || this._sampler) return;
    this._initializing = true;
    try {
      await Tone.start();
      this._sampler = new Tone.Sampler({
        urls: {
          E2: "E2.mp3",
          A2: "A2.mp3",
          D3: "D3.mp3",
          G3: "G3.mp3",
          B3: "B3.mp3",
          E4: "E4.mp3",
        },
        baseUrl: "https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-acoustic/",
        release: AUDIO.releaseSec, // fade suave no triggerRelease (troca de acorde)
        onload: () => {
          this._ready = true;
          console.log("[AudioEngine] Sampler pronto — guitar-acoustic");
        },
      }).toDestination();
    } catch (e) {
      this._sampler = null;
      console.warn("[AudioEngine] falha ao inicializar Tone.js:", e);
    } finally {
      this._initializing = false;
    }
  },

  playNote(stringIndex, noteName, velocity) {
    if (!this._ready) return;
    if (stringIndex < 0 || stringIndex > 5) {
      console.warn("[AudioEngine] índice de corda inválido:", stringIndex);
      return;
    }
    try {
      const v = Math.max(0, Math.min(1, velocity));
      this._sampler.triggerAttack(noteName, Tone.now(), v);
      this._ringing[stringIndex] = noteName;
    } catch (e) {
      console.warn("[AudioEngine] playNote falhou:", { stringIndex, noteName, velocity }, e);
    }
  },

  // Ao trocar de acorde: silencia só as cordas cuja nota mudou (ou virou abafada);
  // notas comuns aos dois acordes continuam soando.
  reconcile(fingering) {
    if (!this._ready || !fingering) return;
    for (let i = 0; i < 6; i++) {
      const newNote = fingering[i] < 0 ? null : noteForString(i, fingering[i]);
      const cur = this._ringing[i];
      if (cur && cur !== newNote) {
        try { this._sampler.triggerRelease(cur, Tone.now()); } catch (e) {}
        this._ringing[i] = null;
        if (typeof strings !== 'undefined' && strings[i]) strings[i].isRinging = false;
      }
    }
  },
};
