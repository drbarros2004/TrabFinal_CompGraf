# Simulador de Violão 2D

Trabalho final de Computação Gráfica: um violão interativo em **p5.js** com som
real via **Tone.js**. Escolha um acorde no menu radial e arraste o mouse sobre as
cordas para tocar — cada corda vibra como uma onda estacionária amortecida.

## Como rodar

Sem build nem dependências locais (p5 e Tone vêm por CDN). Basta servir a pasta:

```bash
python -m http.server 5173
```

e abrir <http://localhost:5173>. Também roda colando os arquivos no editor online do p5.js.

## Controles

| Ação | Comando |
|------|---------|
| Tocar | arrastar o mouse sobre as cordas |
| Trocar acorde na roda | ← / → ou A / D |
| Trocar de roda | ↑ / ↓, W / S ou scroll |
| Selecionar acorde direto | teclas 1–6 |
| Alternar visualização (braço / violão) | V |
| Ajuda | H ou ? |

## Estrutura

| Arquivo | Papel |
|---------|-------|
| `js/config.js` | constantes, geometria, paleta, física |
| `js/chords.js` | rodas de acordes e digitações |
| `js/guitarString.js` | física e desenho da corda |
| `js/audio.js` | sampler Tone.js + cadeia anti-clipping |
| `js/strummer.js` | detecção do dedilhado |
| `js/radialMenu.js` | menu radial de acordes |
| `js/views.js`, `js/guitarView.js` | modos de visualização (Strategy) |
| `js/sketch.js` | `setup`/`draw`, eventos e transformação de coordenadas |
