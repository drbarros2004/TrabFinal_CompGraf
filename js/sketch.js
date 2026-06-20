// ─── sketch.js — orquestração principal ─────────────────────────────────────
let strings   = [];
let menu;
let cnv;

function setup() {
  cnv = createCanvas(CANVAS_W, CANVAS_H);
  textFont('monospace');

  for (let i = 0; i < 6; i++) {
    strings.push(new GuitarString(i));
  }
  menu = new RadialMenu();
}

function draw() {
  background(...COLORS.bg);

  // 1. Detectar strums (atualiza física + dispara áudio)
  Strummer.update(strings, menu.getActiveChord());

  // 2. Desenhar o cenário da view ativa (braço simples OU violão inteiro)
  activeView.drawBackground();

  // 3. Desenhar cada corda
  for (const s of strings) {
    s.update();
    s.draw();
  }

  // 3.5. Dedilhado do acorde ativo
  _drawFingering();

  // 4. Menu radial
  menu.draw();

  // 4.5. Botão de alternância de view
  ToggleButton.draw();
  MuteBlock.draw();

  // 5. HUD / dicas
  _drawHUD();
}

function keyPressed() {
  AudioEngine.init(); // libera áudio no primeiro gesto

  if (keyCode === LEFT_ARROW)  menu.navigate(-1);
  if (keyCode === RIGHT_ARROW) menu.navigate(+1);
  if (keyCode === UP_ARROW)    menu.navigateWheel(-1);
  if (keyCode === DOWN_ARROW)  menu.navigateWheel(+1);

  if (key === 'b' || key === 'B') MuteBlock.toggle();
  if (key >= '1' && key <= '9') menu.selectByNumber(int(key));
}

function mousePressed() {
  AudioEngine.init(); // libera áudio no primeiro gesto
  if (MuteBlock.handleClick(mouseX, mouseY)) return;
  if (ToggleButton.handleClick(mouseX, mouseY)) return;
}

// ─── Helpers de render ───────────────────────────────────────────────────────
function _drawNeck() {
  push();

  // Trastes (linhas verticais entre yTop e yBot)
  for (let f = 0; f <= NUM_FRETS; f++) {
    const x = fretX(f);
    if (f === 0) {
      stroke(130); strokeWeight(3); // nut mais espesso
    } else {
      stroke(55);  strokeWeight(1.5);
    }
    line(x, NECK.yTop - 8, x, NECK.yBot + 8);
  }

  // Marcadores de posição (pontos no espaço *antes* do traste 3 e do traste 5)
  // fretX(f - 0.5) = ponto médio entre o traste f-1 e o traste f
  noStroke();
  fill(45);
  const markerY = (NECK.yTop + NECK.yBot) / 2;
  [3, 5].forEach(f => {
    ellipse(fretX(f - 0.5), markerY, 10, 10);
  });

  // Nomes das cordas à esquerda do nut
  fill(...COLORS.hint);
  textAlign(CENTER, CENTER);
  textSize(11);
  for (let i = 0; i < 6; i++) {
    text(STRING_NAMES[i], NECK.xStart - 52, stringY(i)); // x=28, bem afastado dos indicadores
  }

  pop();
}

function _drawFingering() {
  const frets = menu.getActiveFingering();
  if (!frets) return;   // roda custom vazia

  push();
  for (let i = 0; i < 6; i++) {
    const f = frets[i];
    const y = activeView.stringY(i);

    if (f === -1) {
      // Corda abafada: × à esquerda da pestana
      noStroke();
      fill(...COLORS.hint);
      textAlign(CENTER, CENTER);
      textSize(13);
      text("×", activeView.nutX - 25, y);

    } else if (f === 0) {
      // Corda solta: círculo vazio à esquerda da pestana
      noFill();
      stroke(...COLORS.menuText);
      strokeWeight(1.5);
      ellipse(activeView.nutX - 25, y, 9, 9);

    } else {
      // Corda pressionada: ponto laranja no centro do traste
      noStroke();
      fill(...COLORS.menuActive);
      ellipse(activeView.fretX(f - 0.5), y, 14, 14);
    }
  }
  pop();
}

function _drawHUD() {
  push();
  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(12);

  // Indicador de carregamento enquanto samples baixam
  if (AudioEngine._sampler && !AudioEngine._ready) {
    fill(200, 160, 60);
    text("Carregando samples de áudio...", NECK.xStart, CANVAS_H - 14);
  } else {
    fill(...COLORS.hint);
    text("← → / 1-7: acorde   |   ↑ ↓: campo   |   B: bloquear abafadas   |   +: criar acorde (roda custom)   |   arraste nas cordas: tocar",
         NECK.xStart, CANVAS_H - 14);
  }
  pop();
}
