// ─── sketch.js — orquestração principal ─────────────────────────────────────
let strings   = [];
let menu;
let cnv;
let helpOpen = false;
const HELP_BTN = { x: 30, y: 30, r: 15 };

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

  // 1. Detectar strums (só quando o card de ajuda está fechado)
  if (!helpOpen) Strummer.update(strings, menu.getActiveChord());

  // 2. Desenhar o cenário da view ativa (braço simples OU violão inteiro)
  activeView.drawBackground();

  // 3. Desenhar cada corda
  const frets = menu.getActiveFingering();
  for (let i = 0; i < strings.length; i++) {
    strings[i].update();
    strings[i].draw(frets ? frets[i] : 0);
  }

  // 3.5. Dedilhado do acorde ativo
  _drawFingering();

  // 4. Menu radial
  menu.draw();

  // 5. HUD / dicas
  _drawHUD();

  // 6. Ajuda
  _drawHelpButton();
  if (helpOpen) _drawHelpCard();
}

function keyPressed() {
  AudioEngine.init(); // libera áudio no primeiro gesto

  if (key === 'h' || key === 'H' || key === '?') { helpOpen = !helpOpen; return; }
  if (keyCode === ESCAPE) { helpOpen = false; return; }

  // Setas ou WASD (W=cima, A=esquerda, S=baixo, D=direita)
  const k = (key || '').toLowerCase();
  if (keyCode === LEFT_ARROW  || k === 'a') menu.navigate(-1);
  if (keyCode === RIGHT_ARROW || k === 'd') menu.navigate(+1);
  if (keyCode === UP_ARROW    || k === 'w') menu.navigateWheel(-1);
  if (keyCode === DOWN_ARROW  || k === 's') menu.navigateWheel(+1);

  if (key === 'v' || key === 'V') {
    activeView = (activeView === VIEWS.braco) ? VIEWS.violao : VIEWS.braco;
  }
  if (key >= '1' && key <= '9') menu.selectByNumber(int(key));

  // Troca de acorde: silencia só as notas que mudaram
  AudioEngine.reconcile(menu.getActiveFingering());
}

function mousePressed() {
  AudioEngine.init(); // libera áudio no primeiro gesto
  if (dist(mouseX, mouseY, HELP_BTN.x, HELP_BTN.y) <= HELP_BTN.r) {
    helpOpen = !helpOpen;
    return;
  }
  if (helpOpen) helpOpen = false; // clique fora fecha (sem tocar corda)
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
  [3, 5, 7].forEach(f => {
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
      // Corda abafada: × à esquerda da pestana (só onde as marcas são mostradas)
      if (activeView.showStringMarks) {
        noStroke();
        fill(...COLORS.hint);
        textAlign(CENTER, CENTER);
        textSize(13);
        text("×", activeView.markerX, y);
      }

    } else if (f === 0) {
      // Corda solta: círculo vazio junto à pestana (só onde as marcas são mostradas)
      if (activeView.showStringMarks) {
        noFill();
        stroke(...COLORS.menuText);
        strokeWeight(1.5);
        ellipse(activeView.markerX, y, 9, 9);
      }

    } else {
      // Corda pressionada: ponto laranja no centro do traste
      noStroke();
      fill(...COLORS.menuActive);
      const d = activeView.fingerDotD;
      ellipse(activeView.fretX(f - 0.5), y, d, d);
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
    text("?: ajuda   |   ← → / 1-6: acorde   |   ↑ ↓: roda   |   V: braço/violão   |   arraste nas cordas: tocar",
         NECK.xStart, CANVAS_H - 14);
  }
  pop();
}

function _drawHelpButton() {
  push();
  noFill();
  stroke(...COLORS.hint);
  strokeWeight(1.5);
  ellipse(HELP_BTN.x, HELP_BTN.y, HELP_BTN.r * 2);
  noStroke();
  fill(...COLORS.hint);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("?", HELP_BTN.x, HELP_BTN.y - 1);
  pop();
}

function _drawHelpCard() {
  push();
  // escurece o fundo
  noStroke();
  fill(10, 10, 10, 205);
  rect(0, 0, CANVAS_W, CANVAS_H);

  // painel central
  const w = 580, h = 300;
  const x = (CANVAS_W - w) / 2, y = (CANVAS_H - h) / 2;
  fill(28, 28, 28);
  stroke(...COLORS.menuActive);
  strokeWeight(1.5);
  rect(x, y, w, h, 12);

  // título
  noStroke();
  textAlign(CENTER, TOP);
  fill(...COLORS.menuActive);
  textSize(22);
  textStyle(BOLD);
  text("Simulador de Violão", CANVAS_W / 2, y + 26);
  textStyle(NORMAL);

  // o que é
  fill(...COLORS.menuText);
  textAlign(LEFT, TOP);
  textSize(14);
  const tx = x + 40;
  let ty = y + 74;
  text("Toque os acordes do campo harmônico e veja", tx, ty); ty += 22;
  text("(e ouça) as cordas vibrarem.", tx, ty); ty += 38;

  // como jogar
  fill(...COLORS.hint); textSize(12);
  text("COMO JOGAR", tx, ty); ty += 24;
  fill(...COLORS.menuText); textSize(14);
  const lh = 28;
  text("← →  ou  1-6    trocar de acorde", tx, ty); ty += lh;
  text("↑ ↓             trocar de campo (roda)", tx, ty); ty += lh;
  text("V               alterna braço / violão", tx, ty); ty += lh;
  text("arraste o mouse sobre as cordas para tocar", tx, ty);

  // rodapé
  fill(...COLORS.hint); textSize(12);
  textAlign(CENTER, TOP);
  text("clique em qualquer lugar ou Esc para fechar", CANVAS_W / 2, y + h - 28);
  pop();
}
