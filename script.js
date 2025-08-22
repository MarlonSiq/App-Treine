let currentCategory = localStorage.getItem("currentCategory") || 'números';
let currentDifficulty = localStorage.getItem("currentDifficulty") || 'easy';
let ultimaDificuldadeValida = 'easy'; // começa com easy como fallback
let currentNumber;
let lastNumber = null;
let correctAnswers = 0;
let incorrectAnswers = 0;

const bancoDeDados = {
  'números': números,
  'matemática': matemática,
  'data': data,
  'hora': hora
};

// ============================
// CATEGORIA / DIFICULDADE
// ============================


function setCategory(category, evitarNovaRodada = false) {
  currentCategory = category;
  document.getElementById("categoriaTexto").textContent = category;

  verificarSeTemDificuldade(category);

  if (!evitarNovaRodada) newRound();
  localStorage.setItem("currentCategory", currentCategory);
}

function setDifficulty(dificuldade, evitarNovoRound = false) {
  currentDifficulty = dificuldade;
  localStorage.setItem("currentDifficulty", dificuldade);
  ultimaDificuldadeValida = dificuldade; // salva a última válida
  if (!evitarNovoRound) newRound(true);
}

// ============================
// SEM DIFICULDADE
// ============================

function verificarSeTemDificuldade(category) {
  const blocoDificuldade = document.querySelector(".container-dificuldades");
  const blocoDific = document.querySelector(".cont-dificuldades-Inv");

  const semDificuldade = ['hora', 'data'];

  if (semDificuldade.includes(category)) {
    blocoDificuldade.style.display = "none";
    blocoDific.style.display = "flex";

    // Salva a dificuldade atual antes de forçar 'easy'
    ultimaDificuldadeValida = currentDifficulty;

    // Força para o modo easy
    currentDifficulty = 'easy';
    localStorage.setItem("currentDifficulty", "easy");
    ativar2(document.querySelector(".difficulty-button[data-difficulty='easy']"));
  } else {
    blocoDificuldade.style.display = "grid";
    blocoDific.style.display = "none";

    // Restaura dificuldade anterior, se existir
    if (ultimaDificuldadeValida && ultimaDificuldadeValida !== 'easy') {
      setDifficulty(ultimaDificuldadeValida, true);
      ativar2(document.querySelector(`.difficulty-button[data-difficulty='${ultimaDificuldadeValida}']`));
    }
  }
}

// ============================
// NOVA RODADA
// ============================

function newRound(forceNovo = false) {
  const categoria = bancoDeDados[currentCategory];
  const dataset = categoria ? categoria[currentDifficulty] : null;

  if (!dataset) {
    console.warn(`Categoria ou dificuldade inválida: ${currentCategory} / ${currentDifficulty}`);
    return;
  }

  const keys = Object.keys(dataset);
  if (keys.length === 0) return;

  // Se não for forçado e já existe número salvo, só mostra ele
  const salvo = localStorage.getItem("numeroAtual");
  if (!forceNovo && salvo && keys.includes(salvo)) {
    currentNumber = salvo;
    document.getElementById("numberDisplay").innerText = currentNumber;
    return;
  }

  let novoNumero;
  do {
    novoNumero = keys[Math.floor(Math.random() * keys.length)];
  } while (novoNumero === currentNumber && keys.length > 1);

  currentNumber = novoNumero;
  localStorage.setItem("numeroAtual", currentNumber);
  document.getElementById("numberDisplay").innerText = currentNumber;
}

// ============================
// Textos FEEDBACK
// ============================

const mensagensCorretas = [
  "Acertou!",
  "Mandou bem!",
  "Isso aí!",
  "Boa!",
  "Top demais!",
  "Você é brabo(a)!",
  "Two words: PARA-BÉNS!",
  "Tá voando!",
  "Só sucesso!",
  "A lenda acertou!",
  "This is the way. -Mandalorian",
  "Expecto ACERTO!",
  "Acertou, miserávi!"
];

const mensagensIncorretas = [
  "Errou... mas tudo bem!",
  "Quase!",
  "Não foi dessa vez.",
  "Tenta de novo!",
  "Respira e tenta outra vez.",
  "Ops, confere aí!",
  "Chutou e passou longe",
  "Errar faz parte!",
  "Não foi dessa vez!",
  "Incorreto!",
  "Oops!",
  "Resposta errada!",
  "Sem choro: Errou!",
  "Triste com T de tentativa",
  "Dá zero pra ele!"
];

let ultimaMensagemCorreta = "";
let ultimaMensagemIncorreta = "";

// ============================
// CHECAR RESPOSTA
// ============================

function checkAnswer() {
  const input = document.getElementById("answer");
  const userAnswerOriginal = input.value.trim();
  const respostaUsuario = userAnswerOriginal; // agora sim, definida corretamente
  const userAnswer = userAnswerOriginal.toLowerCase().replace(/[\s]+/g, " ");

  const respostaCorreta = bancoDeDados[currentCategory][currentDifficulty][currentNumber];

  // Função para limpar variações
  function normalizarTexto(texto) {
    return texto
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\bequals\b/g, "is")
      .replace(/\band\b/g, "plus")
      .replace(/[^\w\s]/g, "")
      .trim();
  }

  const respostaNormalizada = normalizarTexto(userAnswer);

  let foiCorreta;
  if (Array.isArray(respostaCorreta)) {
    foiCorreta = respostaCorreta.some(
      r => normalizarTexto(r) === respostaNormalizada
    );
  } else {
    foiCorreta = normalizarTexto(respostaCorreta) === respostaNormalizada;
  }

  const feedback = document.getElementById("feedback");

  if (foiCorreta) {
    correctAnswers++;

    let msg;
    do {
      msg = mensagensCorretas[Math.floor(Math.random() * mensagensCorretas.length)];
    } while (msg === ultimaMensagemCorreta && mensagensCorretas.length > 1);

    ultimaMensagemCorreta = msg;

    feedback.innerText = msg;
    feedback.classList.remove("feedback-incorreto");
    feedback.classList.add("feedback-correto");
    
  } else {
    incorrectAnswers++;

    let msg;
    do {
      msg = mensagensIncorretas[Math.floor(Math.random() * mensagensIncorretas.length)];
    } while (msg === ultimaMensagemIncorreta && mensagensIncorretas.length > 1);

    ultimaMensagemIncorreta = msg;

    feedback.innerText = msg;
    feedback.classList.remove("feedback-correto");
    feedback.classList.add("feedback-incorreto");
    
    const numberDisplay = document.getElementById("numberDisplay");
numberDisplay.classList.add("erro-temporario");

setTimeout(() => {
  numberDisplay.classList.remove("erro-temporario");
}, 500);

  }

  // Salvar histórico completo e visual simples
  salvarNoStorage(currentNumber, respostaUsuario, respostaCorreta, foiCorreta);
  atualizarContadores();
  carregarHistoricoVisual();
  carregarHistoricoCompleto(); // ← isso atualiza o histórico novo em tempo real

  input.value = '';
  newRound(true);
}
// ============================
// COMPARAR RESPOSTAS
// ============================
function compararRespostasVisual(correta, usuario) {
  const container = document.createElement("div");
  container.classList.add("comparacao-visual");

  const corretaLimpa = (correta || "").toLowerCase().trim();
  const usuarioLimpo = (usuario || "").toLowerCase().trim();

  const maxLen = Math.max(corretaLimpa.length, usuarioLimpo.length);

  for (let i = 0; i < maxLen; i++) {
    const span = document.createElement("span");
    const letraCerta = corretaLimpa[i] || "";
    const letraUser = usuarioLimpo[i] || "";

    if (letraCerta === letraUser) {
      span.textContent = letraUser;
      span.classList.add("certo");
    } else {
      span.textContent = letraUser || "_";
      span.classList.add("erro");
    }

    container.appendChild(span);
  }

  return container;
}
// ============================
// CONTADORES
// ============================

function atualizarContadores() {
  document.getElementById("correctCount").innerText = correctAnswers;
  document.getElementById("incorrectCount").innerText = incorrectAnswers;

  const c2 = document.getElementById("correctCount2");
  const i2 = document.getElementById("incorrectCount2");
  if (c2 && i2) {
    c2.innerText = correctAnswers;
    i2.innerText = incorrectAnswers;
  }

  const c3 = document.getElementById("correctCount3");
  const i3 = document.getElementById("incorrectCount3");
  if (c3 && i3) {
    c3.innerText = correctAnswers;
    i3.innerText = incorrectAnswers;
  }
  
  localStorage.setItem("correctAnswers", correctAnswers);
  localStorage.setItem("incorrectAnswers", incorrectAnswers);
}

// ============================
// HISTÓRICO - SALVAR / MOSTRAR / LIMPAR
// ============================

/* function salvarNoStorage(numero, respostaUsuario, respostaCorreta, isCorrect) {
  // Salvar no histórico completo
  let historicoCompleto = JSON.parse(localStorage.getItem("historicoCompleto")) || [];
  historicoCompleto.push({
    numero,
    respostaUsuario,
    respostaCorreta,
    foiCorreta: isCorrect,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem("historicoCompleto", JSON.stringify(historicoCompleto)); */
  
  function salvarNoStorage(numero, respostaUsuario, respostaCorreta, foiCorreta) {

  let historicoCompleto = JSON.parse(localStorage.getItem("historicoCompleto")) || [];
  historicoCompleto.push({
  desafio: currentNumber, // genérico para qualquer categoria
  respostaUsuario,
  respostaCorreta: Array.isArray(respostaCorreta)
    ? `${respostaCorreta[0]}`
    : respostaCorreta,
  foiCorreta,
  timestamp: new Date().toISOString()
});
     localStorage.setItem("historicoCompleto", JSON.stringify(historicoCompleto));



  // Salvar no histórico visual (só info básica)
  let historicoVisual = JSON.parse(localStorage.getItem("historicoVisual")) || [];
  historicoVisual.push({
    respostaCorreta: Array.isArray(respostaCorreta)
    ? `${respostaCorreta[0]} (e variações)`
    : respostaCorreta,
    /* respostaCorreta: respostaCorreta,     */
  foiCorreta,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem("historicoVisual", JSON.stringify(historicoVisual));
}


localStorage.setItem("currentCategory", currentCategory);
localStorage.setItem("currentDifficulty", currentDifficulty);


function carregarHistoricoVisual() {
  const container = document.getElementById("respostaVisual");
  if (!container) return;

  container.innerHTML = "";

  const historicoVisual = JSON.parse(localStorage.getItem('historicoVisual')) || [];

  historicoVisual.slice(-4).reverse().forEach(entry => {
    const bloco = document.createElement("div");
    bloco.classList.add("history-block", entry.foiCorreta ? "correct-block" : "incorrect-block");
    bloco.textContent = entry.respostaCorreta;
    container.appendChild(bloco);
  });
}



function carregarHistoricoCompleto() {
  const container = document.getElementById("historicoCompletoPainel");
  if (!container) return;

  container.innerHTML = ""; // limpa antes de exibir de novo

  const historicoCompleto = JSON.parse(localStorage.getItem("historicoCompleto")) || [];

  if (historicoCompleto.length === 0) {
    container.innerHTML = "<p>Nenhum histórico disponível.</p>";
    return;
  }
  

historicoCompleto.slice().reverse().forEach(item => {
  const linha = document.createElement("div");
  linha.classList.add("linha-historico");
  linha.classList.add(item.foiCorreta ? "correta" : "incorreta");

  // Termo/Desafio
  const divNumero = document.createElement("div");
  divNumero.innerHTML = `<strong>Termo:</strong> `;
  divNumero.appendChild(document.createTextNode(item.desafio));

  // Resposta do usuário
  const divResposta = document.createElement("div");
  divResposta.innerHTML = `<strong>Sua resposta:</strong> `;
  divResposta.appendChild(document.createTextNode(item.respostaUsuario || '[vazio]'));

  // Correção com destaque visual das diferenças
  const divCorreta = document.createElement("div");
  divCorreta.innerHTML = `<strong>Correto:</strong> `;
  divCorreta.appendChild(document.createTextNode(item.respostaCorreta));

  /* // Comparação visual
  const visual = compararRespostasVisual(item.respostaCorreta, item.respostaUsuario); */

  // Resultado
  const divResultado = document.createElement("div");
  divResultado.innerHTML = `<strong>Resultado:</strong> ${item.foiCorreta ? 'Correto' : 'Errado'}`;

  // Data
  const divData = document.createElement("div");
  const data = new Date(item.timestamp);
  const dataFormatada = data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  divData.textContent = dataFormatada;
  divData.style.fontSize = "12px";
  divData.style.opacity = "0.7";
  divData.style.marginTop = "10px";

  // Adicionando tudo à linha
  linha.appendChild(divNumero);
  linha.appendChild(divResposta);
  linha.appendChild(divCorreta);
   // Só adiciona a comparação visual se a resposta estiver errada
  if (!item.foiCorreta) {
    const visual = compararRespostasVisual(item.respostaCorreta, item.respostaUsuario);
    linha.appendChild(visual);
  }

  linha.appendChild(divResultado);
  linha.appendChild(divData);

  // Inserir na interface
  container.appendChild(linha);
});


}
function reiniciarHistorico() {
  localStorage.removeItem("historicoVisual");
  localStorage.removeItem("historicoCompleto");
  localStorage.removeItem("historicoRespostas");
  localStorage.removeItem("correctAnswers");
  localStorage.removeItem("incorrectAnswers");
  localStorage.removeItem("numeroAtual");

  correctAnswers = 0;
  incorrectAnswers = 0;
  atualizarContadores();
  carregarHistoricoVisual();
  carregarHistoricoCompleto();
  document.getElementById("feedback").innerText = "";

  newRound();
}


function reiniciarSite() {
    localStorage.removeItem("historicoVisual");
    localStorage.removeItem("historicoCompleto");
  localStorage.removeItem("historicoRespostas");
  localStorage.removeItem("correctAnswers");
  localStorage.removeItem("incorrectAnswers");
  localStorage.removeItem("numeroAtual");
  localStorage.removeItem("currentCategory");
  localStorage.removeItem("currentDifficulty");
  localStorage.removeItem("painelHistoricoEstado");

  correctAnswers = 0;
  incorrectAnswers = 0;
  atualizarContadores();
  carregarHistoricoVisual();
  document.getElementById("feedback").innerText = "";

    
  location.reload();
}

// ============================
// BOTÕES HISTORICO COMPLETO
// ============================

document.addEventListener("DOMContentLoaded", function () {
  const btnAbrir = document.querySelector(".bttn-hst-open");
  const btnFechar = document.querySelector(".bttn-hst-close");
  const painel = document.querySelector(".painel-historico");

  function toggleHistorico() {
    const isAtivo = painel.style.display === "flex";

    const novoEstado = isAtivo ? "fechado" : "aberto";
    localStorage.setItem("painelHistoricoEstado", novoEstado);

    painel.style.display = isAtivo ? "none" : "flex";
    btnAbrir.style.display = isAtivo ? "flex" : "none";
    btnFechar.style.display = isAtivo ? "none" : "flex";
  }

  if (btnAbrir && btnFechar && painel) {
    // Recupera o estado salvo
    const estadoSalvo = localStorage.getItem("painelHistoricoEstado") || "fechado";

    if (estadoSalvo === "aberto") {
      painel.style.display = "flex";
      btnAbrir.style.display = "none";
      btnFechar.style.display = "flex";
    } else {
      painel.style.display = "none";
      btnAbrir.style.display = "flex";
      btnFechar.style.display = "none";
    }

    btnAbrir.addEventListener("click", toggleHistorico);
    btnFechar.addEventListener("click", toggleHistorico);
  }
});

// ============================
// DEV MODE
// ============================
const params = new URLSearchParams(window.location.search);
const isDev = params.get("devmode") === "1";
// ============================
// ATIVAR BOTÕES
// ============================

/* function ativar(elemento) {
  document.querySelectorAll(".option, .option-mob, .difficulty-button").forEach(op => op.classList.remove("active"));
  elemento.classList.add("active");
} */
function ativar(elemento) {   
document.querySelectorAll(".option, .option-mob").forEach(op => {     op.classList.remove("active");   });   elemento.classList.add("active"); } 

function ativar2(elemento) {
  const botoes = document.querySelectorAll(".difficulty-button");
  if (!botoes.length || !elemento) return; // se não tiver botões ou o elemento for nulo, sai fora

  botoes.forEach(op => {
    op.classList.remove("active2");
  });

  elemento.classList.add("active2");
}
// ============================
// START / STOP GAME
// ============================

function startGame() {
  correctAnswers = 0;
  incorrectAnswers = 0;
  atualizarContadores();
  gameRunning = true;
  newRound();
}

function stopGame() {
  gameRunning = false;
  document.getElementById("feedback").innerText = "Game Over!";
}

// ============================
// TEMA
// ============================
function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.getAttribute("data-theme") === "dark";

  const newTheme = isDark ? "light" : "dark";
  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Atualiza TODOS os ícones (em todos os botões)
  document.querySelectorAll(".icon-light").forEach(el => {
    el.style.display = newTheme === "dark" ? "none" : "flex";
  });

  document.querySelectorAll(".icon-dark").forEach(el => {
    el.style.display = newTheme === "dark" ? "flex" : "none";
  });
}

// ============================
// ONLOAD
// ============================
window.onload = function () {
  // === TEMA ===
  const savedTheme = localStorage.getItem("theme") || "light";
  const root = document.documentElement;
  root.setAttribute("data-theme", savedTheme);

  const isDark = savedTheme === "dark";
  document.querySelectorAll(".icon-light").forEach(el => {
    el.style.display = isDark ? "none" : "flex";
  });

  document.querySelectorAll(".icon-dark").forEach(el => {
    el.style.display = isDark ? "flex" : "none";
  });

  // === ENTER ===
  const inputResposta = document.getElementById("answer");
  if (inputResposta) {
    inputResposta.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        checkAnswer();
      }
    });
  }

  // === CATEGORIA/DIFICULDADE INICIAIS ===
  const savedCategory = localStorage.getItem("currentCategory") || "números";
  const savedDifficulty = localStorage.getItem("currentDifficulty") || "easy";


setCategory(savedCategory, true);     // true = não iniciar nova rodada
setDifficulty(savedDifficulty, true);

newRound(); // aqui sim, inicia a rodada com base no número salvo

  // === HISTÓRICO / CONTADORES ===
  carregarHistoricoVisual();
  correctAnswers = parseInt(localStorage.getItem('correctAnswers')) || 0;
  incorrectAnswers = parseInt(localStorage.getItem('incorrectAnswers')) || 0;
  atualizarContadores();

  // === Ativar botão da categoria salva ===
  document.querySelectorAll(".option, .option-mob").forEach(btn => {
  const texto = btn.textContent.toLowerCase().trim();
  if (texto === savedCategory) {
    btn.classList.add("active");
  }
});
  document.querySelectorAll(".difficulty-button").forEach(btn => {
  if (btn.textContent.toLowerCase().includes(savedDifficulty)) {
    ativar2(btn);
  }
});
};

carregarHistoricoVisual();
carregarHistoricoCompleto();