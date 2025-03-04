const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "assets-fb.png";

// general settings
let gamePlaying = false;
const gravity = 0.3;
const speed = 4.5;
const size = [51, 36];
const jump = -9.5;
const cTenth = (canvas.width / 10);

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipe;

// pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

// congratulatory message variables
let showCongrats = false; // Controla se a mensagem de parabéns será exibida
let congratsTimeout;      // Para esconder a mensagem após um tempo

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
  // make the pipe and bird moving 
  index++;

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background first part 
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // background second part
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // pipe display
  if (gamePlaying){
    pipes.map(pipe => {
      // pipe moving
      pipe[0] -= speed;

      // top pipe
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // bottom pipe
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // give 1 point & create new pipe
      if(pipe[0] <= -pipeWidth){
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);

        // Se atingir 10 pontos, exibir a mensagem de parabéns
        if (currentScore === 10 && !showCongrats) {
            showCongrats = true;
            clearTimeout(congratsTimeout); // Garantir que não acumule timeouts
            congratsTimeout = setTimeout(() => {
                showCongrats = false; // Esconde a mensagem após 3 segundos
            }, 3000);
        }

        pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
      }
    
      // if hit the pipe, end
      if ([
        pipe[0] <= cTenth + size[0], 
        pipe[0] + pipeWidth >= cTenth, 
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
      }
    })
  }
  // draw bird
  if (gamePlaying) {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);
      // text accueil
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText('Click to play', 90, 535);
    ctx.font = "bold 30px courier";
  }

  // Mostrar mensagem de parabéns se aplicável
  if (showCongrats) {
    // Configuração do fundo semi-transparente geral
    const padding = 20; // Margem entre o texto e o fundo
    const boxMargin = 50; // Margem extra para o fundo geral
    const textX = canvas.width / 2;
    const textY = (canvas.height / 3) + boxMargin;

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Fundo semi-transparente
    ctx.fillRect(boxMargin, textY - 40, canvas.width - (2 * boxMargin), 150);

    // Definir propriedades do texto
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    const text = "🎉    Você chegou em 10 pontos no Hugo Bird!!!! \n Diga pra ele: 'eu gosto de batata frita'🎉";

    // Dividir texto em linhas
    const lines = text.split("\n");
    const lineHeight = 30; // Altura entre linhas

    // Calcular largura máxima para fundo preto
    const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width));

    // Desenhar fundo preto para o texto com margem maior
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; // Fundo preto semi-transparente
    ctx.fillRect(
        textX - maxWidth / 2 - padding,
        textY - padding,
        maxWidth + 2 * padding,
        lines.length * lineHeight + 2 * padding
    );

    // Renderizar texto linha por linha
    ctx.fillStyle = "#fff"; // Texto branco
    lines.forEach((line, i) => {
        ctx.fillText(line.trim(), textX, textY + i * lineHeight);
    });
}



  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  // tell the browser to perform anim
  window.requestAnimationFrame(render);
}
const passwordPrompt = document.getElementById('passwordPrompt');
const passwordInput = document.getElementById('passwordInput');
const submitPassword = document.getElementById('submitPassword');
const errorMessage = document.getElementById('errorMessage');

// Verificar senha
submitPassword.addEventListener('click', () => {
  if (passwordInput.value === "StarWars123") {
    passwordPrompt.style.display = "none";
    document.addEventListener('click', () => gamePlaying = true);
    window.onclick = () => flight = jump;
  } else {
    errorMessage.style.display = "block";
  }
});
// launch setup
setup();
img.onload = render;
