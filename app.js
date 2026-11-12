/**
 * Simulador de Prova - Estilo Anhanguera / Kroton
 * Funcionalidades: Prova de 12 questões, navegação idêntica ao modelo,
 * cronômetro, barra de progresso, feedback de acertos e erros,
 * drawer lateral com gerenciador de simulado, cadastro de questões e histórico.
 */

// ==========================================
// ESTADO GLOBAL DA APLICAÇÃO
// ==========================================
const EXAM_LENGTH = 12;

let questionBank = [];
let currentExamQuestions = [];
let userAnswers = {}; // { [questionIndex]: "A" | "B" | "C" | "D" | "E" }
let currentQuestionIndex = 0;
let selectedSubject = "all";

let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

let examMetadata = {
  title: "Simulado de Avaliação — Professora Jamile",
  date: new Date().toISOString().split("T")[0] // AAAA-MM-DD
};

// ==========================================
// ELEMENTOS DO DOM
// ==========================================
const dom = {
  // Seleção de disciplina
  subjectSelectionScreen: document.getElementById("subjectSelectionScreen"),
  // Header
  headerExamTitle: document.getElementById("headerExamTitle"),
  headerExamDate: document.getElementById("headerExamDate"),
  btnOpenSidebar: document.getElementById("btnOpenSidebar"),
  historyCounterBadge: document.getElementById("historyCounterBadge"),
  btnThemeToggle: document.getElementById("btnThemeToggle"),

  // Tela da Questão
  currentQuestionTitle: document.getElementById("currentQuestionTitle"),
  currentQuestionStatement: document.getElementById("currentQuestionStatement"),
  currentQuestionOptions: document.getElementById("currentQuestionOptions"),
  btnPrev: document.getElementById("btnPrev"),
  btnNext: document.getElementById("btnNext"),
  btnFinish: document.getElementById("btnFinish"),

  // Card Lateral "Questões da Prova"
  questionBubblesGrid: document.getElementById("questionBubblesGrid"),
  progressBarFill: document.getElementById("progressBarFill"),
  examTimerText: document.getElementById("examTimerText"),
  answeredCountText: document.getElementById("answeredCountText"),

  // Barra Lateral (Drawer)
  sidebarDrawer: document.getElementById("sidebarDrawer"),
  sidebarOverlay: document.getElementById("sidebarOverlay"),
  btnCloseSidebar: document.getElementById("btnCloseSidebar"),
  tabButtons: document.querySelectorAll(".tab-button"),
  tabPanes: document.querySelectorAll(".tab-pane"),

  // Formulário Configuração do Simulado
  formExamSettings: document.getElementById("formExamSettings"),
  inputExamTitle: document.getElementById("inputExamTitle"),
  inputExamDate: document.getElementById("inputExamDate"),
  btnNewRandomExam: document.getElementById("btnNewRandomExam"),
  totalBankQuestionsCount: document.getElementById("totalBankQuestionsCount"),
  btnResetToDefaultBank: document.getElementById("btnResetToDefaultBank"),
  btnLoadScreenshotDemo: document.getElementById("btnLoadScreenshotDemo"),

  // Formulário Nova Questão & Importação em Lote
  bankCounterInTab: document.getElementById("bankCounterInTab"),
  btnSubtabBulk: document.getElementById("btnSubtabBulk"),
  btnSubtabSingle: document.getElementById("btnSubtabSingle"),
  paneBulkImport: document.getElementById("paneBulkImport"),
  paneSingleImport: document.getElementById("paneSingleImport"),
  inputJsonFile: document.getElementById("inputJsonFile"),
  fileChosenName: document.getElementById("fileChosenName"),
  dropzoneBox: document.getElementById("dropzoneBox"),
  bulkQuestionsTextarea: document.getElementById("bulkQuestionsTextarea"),
  btnLoadJsonTemplate: document.getElementById("btnLoadJsonTemplate"),
  btnLoadTextTemplate: document.getElementById("btnLoadTextTemplate"),
  checkAppendBank: document.getElementById("checkAppendBank"),
  checkStartExamImmediately: document.getElementById("checkStartExamImmediately"),
  bulkStatusBox: document.getElementById("bulkStatusBox"),
  btnProcessBulkImport: document.getElementById("btnProcessBulkImport"),
  btnExportCurrentBank: document.getElementById("btnExportCurrentBank"),
  formAddQuestion: document.getElementById("formAddQuestion"),
  newQuestionStatement: document.getElementById("newQuestionStatement"),
  newOptionA: document.getElementById("newOptionA"),
  newOptionB: document.getElementById("newOptionB"),
  newOptionC: document.getElementById("newOptionC"),
  newOptionD: document.getElementById("newOptionD"),
  newOptionE: document.getElementById("newOptionE"),
  newCorrectAnswer: document.getElementById("newCorrectAnswer"),
  newExplanation: document.getElementById("newExplanation"),

  // Histórico
  historyListContainer: document.getElementById("historyListContainer"),
  btnClearHistory: document.getElementById("btnClearHistory"),

  // Modais
  confirmFinishModal: document.getElementById("confirmFinishModal"),
  confirmFinishMessage: document.getElementById("confirmFinishMessage"),
  btnCancelFinish: document.getElementById("btnCancelFinish"),
  btnConfirmFinish: document.getElementById("btnConfirmFinish"),

  resultsModal: document.getElementById("resultsModal"),
  btnCloseResults: document.getElementById("btnCloseResults"),
  resultScoreNumber: document.getElementById("resultScoreNumber"),
  resultScorePercent: document.getElementById("resultScorePercent"),
  resultExamTitle: document.getElementById("resultExamTitle"),
  resultExamSubtitle: document.getElementById("resultExamSubtitle"),
  resultPerformancePill: document.getElementById("resultPerformancePill"),
  statCorrectCount: document.getElementById("statCorrectCount"),
  statWrongCount: document.getElementById("statWrongCount"),
  statTimeSpent: document.getElementById("statTimeSpent"),
  btnStartNewFromResults: document.getElementById("btnStartNewFromResults"),
  btnViewHistoryFromResults: document.getElementById("btnViewHistoryFromResults"),
  resultsDetailedReviewList: document.getElementById("resultsDetailedReviewList"),

  // Toast
  toastNotification: document.getElementById("toastNotification")
};

// ==========================================
// UTILITÁRIOS E SEGURANÇA
// ==========================================

// Prevenção de XSS ao renderizar textos inseridos por usuários
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Converte links e formata quebras de linha com segurança
function formatStatementText(text) {
  const safeText = escapeHtml(text);
  // Converte URLs válidas iniciadas por http:// ou https:// em links seguros
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return safeText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

// Formatação de data brasileira (DD/MM/AAAA)
function formatBrazilianDate(isoDateStr) {
  if (!isoDateStr) return "";
  const parts = isoDateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDateStr;
}

// Formatação de segundos em HH:MM:SS
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Exibe mensagem Toast amigável
function showToast(message, duration = 3000) {
  dom.toastNotification.textContent = message;
  dom.toastNotification.classList.add("show");
  setTimeout(() => {
    dom.toastNotification.classList.remove("show");
  }, duration);
}

// ==========================================
// GERENCIAMENTO DO BANCO E METADADOS
// ==========================================

function loadBankAndMetadata() {
  questionBank = getInitialQuestions();

  // Carrega metadados do simulado
  const savedMeta = localStorage.getItem("anhanguera_exam_meta");
  if (savedMeta) {
    try {
      examMetadata = { ...examMetadata, ...JSON.parse(savedMeta) };
    } catch (e) {
      console.error("Erro ao carregar metadados", e);
    }
  }

  updateHeaderMetadata();
  updateBankCounters();
}

function updateBankCounters() {
  if (dom.totalBankQuestionsCount) dom.totalBankQuestionsCount.textContent = questionBank.length;
  const ptCount = questionBank.filter(q => q.subject === "Português").length;
  const mtCount = questionBank.filter(q => q.subject === "Matemática").length;
  const categoryCount = document.getElementById("categoryBankCount");
  if (categoryCount) categoryCount.textContent = `Português: ${ptCount} • Matemática: ${mtCount}`;
  if (dom.bankCounterInTab) dom.bankCounterInTab.textContent = `Banco: ${questionBank.length}`;
}

function updateHeaderMetadata() {
  dom.headerExamTitle.textContent = examMetadata.title;
  dom.headerExamDate.textContent = `Data: ${formatBrazilianDate(examMetadata.date)}`;
  dom.inputExamTitle.value = examMetadata.title;
  dom.inputExamDate.value = examMetadata.date;
}

function saveMetadata() {
  localStorage.setItem("anhanguera_exam_meta", JSON.stringify(examMetadata));
  updateHeaderMetadata();
}

// ==========================================
// INICIALIZAÇÃO DO SIMULADO DE 12 QUESTÕES
// ==========================================

function showSubjectSelection() {
  pauseTimer();
  if (dom.subjectSelectionScreen) dom.subjectSelectionScreen.classList.remove("hidden");
  document.querySelector(".exam-container").classList.add("hidden");
  localStorage.removeItem("anhanguera_current_exam_state");
}

function startExam(subject = "all") {
  selectedSubject = subject;
  const filtered = subject === "all" ? questionBank : questionBank.filter(q => q.subject === subject);
  if (filtered.length < EXAM_LENGTH) {
    showToast("Ainda não há 12 questões disponíveis nessa disciplina.");
    return;
  }
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  currentExamQuestions = shuffled.slice(0, EXAM_LENGTH);
  userAnswers = {};
  currentQuestionIndex = 0;
  timerSeconds = 0;
  examMetadata.title = subject === "all"
    ? "Simulado de Avaliação — Professora Jamile — Português e Matemática"
    : "Simulado de Avaliação — Professora Jamile — " + subject;
  saveMetadata();
  if (dom.subjectSelectionScreen) dom.subjectSelectionScreen.classList.add("hidden");
  document.querySelector(".exam-container").classList.remove("hidden");
  saveActiveExamState();
  initTimer();
  renderActiveQuestion();
  renderBubbles();
  updateProgressBar();
}

function generateNewRandomExam() {
  closeSidebar();
  showSubjectSelection();
}

function saveActiveExamState() {
  const state = {
    questions: currentExamQuestions,
    answers: userAnswers,
    currentIndex: currentQuestionIndex,
    timerSeconds: timerSeconds
  };
  localStorage.setItem("anhanguera_current_exam_state", JSON.stringify(state));
}

// ==========================================
// CRONÔMETRO
// ==========================================

function initTimer() {
  if (timerInterval) clearInterval(timerInterval);
  isTimerRunning = true;
  dom.examTimerText.textContent = formatTime(timerSeconds);

  timerInterval = setInterval(() => {
    if (isTimerRunning) {
      timerSeconds++;
      dom.examTimerText.textContent = formatTime(timerSeconds);
      if (timerSeconds % 5 === 0) {
        saveActiveExamState();
      }
    }
  }, 1000);
}

function pauseTimer() {
  isTimerRunning = false;
}

function resumeTimer() {
  isTimerRunning = true;
}

// ==========================================
// RENDERIZAÇÃO DA QUESTÃO ATIVA E OPÇÕES
// ==========================================

function renderActiveQuestion() {
  if (!currentExamQuestions || currentExamQuestions.length === 0) return;

  const q = currentExamQuestions[currentQuestionIndex];
  if (!q) return;

  // Atualiza título da questão (ex: "Questão 4")
  dom.currentQuestionTitle.textContent = `Questão ${currentQuestionIndex + 1}`;

  // Atualiza texto do enunciado com suporte a links
  dom.currentQuestionStatement.innerHTML = formatStatementText(q.statement);

  // Renderiza opções A, B, C, D, E
  dom.currentQuestionOptions.innerHTML = "";
  const selectedAnswer = userAnswers[currentQuestionIndex];

  q.options.forEach((opt) => {
    const isSelected = selectedAnswer === opt.id;

    const row = document.createElement("div");
    row.className = `option-row ${isSelected ? "selected" : ""}`;
    row.setAttribute("data-option-id", opt.id);

    row.innerHTML = `
      <span class="option-letter">${opt.id}.</span>
      <div class="option-pill">
        <div class="custom-radio">
          <div class="radio-dot"></div>
        </div>
        <span class="option-text">${escapeHtml(opt.text)}</span>
      </div>
    `;

    row.addEventListener("click", () => {
      selectOption(opt.id);
    });

    dom.currentQuestionOptions.appendChild(row);
  });

  // Atualiza botões Anterior e Próxima
  dom.btnPrev.disabled = currentQuestionIndex === 0;
  dom.btnNext.disabled = currentQuestionIndex === EXAM_LENGTH - 1;

  // Atualiza as bolinhas da barra lateral
  renderBubbles();
}

function selectOption(optionId) {
  userAnswers[currentQuestionIndex] = optionId;
  saveActiveExamState();
  renderActiveQuestion();
  renderBubbles();
  updateProgressBar();
}

// ==========================================
// RENDERIZAÇÃO DAS BOLINHAS (PAINEL DIREITO)
// ==========================================

function renderBubbles() {
  // A navegação numerada foi removida da interface.
  // Mantém a função para compatibilidade com os pontos que atualizam o simulado.
  return;
}

function updateProgressBar() {
  const answeredCount = Object.keys(userAnswers).length;
  const percent = (answeredCount / EXAM_LENGTH) * 100;
  dom.progressBarFill.style.width = `${percent}%`;
  dom.answeredCountText.textContent = answeredCount;
}

// ==========================================
// NAVEGAÇÃO ENTRE QUESTÕES
// ==========================================

dom.btnPrev.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    saveActiveExamState();
    renderActiveQuestion();
    renderBubbles();
  }
});

dom.btnNext.addEventListener("click", () => {
  if (currentQuestionIndex < EXAM_LENGTH - 1) {
    currentQuestionIndex++;
    saveActiveExamState();
    renderActiveQuestion();
    renderBubbles();
  }
});

// ==========================================
// FINALIZAÇÃO DA PROVA E FEEDBACK
// ==========================================

dom.btnFinish.addEventListener("click", () => {
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = EXAM_LENGTH - answeredCount;

  if (unansweredCount > 0) {
    dom.confirmFinishMessage.textContent = `Você respondeu ${answeredCount} de 12 questões. Ainda restam ${unansweredCount} sem resposta. Deseja realmente finalizar?`;
  } else {
    dom.confirmFinishMessage.textContent = `Você respondeu todas as 12 questões. Deseja concluir a avaliação e ver seu resultado?`;
  }

  dom.confirmFinishModal.classList.add("active");
});

dom.btnCancelFinish.addEventListener("click", () => {
  dom.confirmFinishModal.classList.remove("active");
});

dom.btnConfirmFinish.addEventListener("click", () => {
  dom.confirmFinishModal.classList.remove("active");
  finishExamAndShowResults();
});

function finishExamAndShowResults() {
  pauseTimer();

  // Cálculo de pontuação
  let correctCount = 0;
  currentExamQuestions.forEach((q, index) => {
    if (userAnswers[index] === q.correctAnswer) {
      correctCount++;
    }
  });

  const wrongCount = EXAM_LENGTH - correctCount;
  const scorePercent = ((correctCount / EXAM_LENGTH) * 100).toFixed(1);
  const isPassed = correctCount >= 7; // Anhanguera geralmente aprova com >= 60%

  const examResultRecord = {
    id: "result-" + Date.now(),
    title: examMetadata.title,
    date: examMetadata.date,
    finishedAt: new Date().toISOString(),
    durationSeconds: timerSeconds,
    durationFormatted: formatTime(timerSeconds),
    totalQuestions: EXAM_LENGTH,
    correctCount: correctCount,
    wrongCount: wrongCount,
    scorePercent: scorePercent,
    isPassed: isPassed,
    questionsSnapshot: currentExamQuestions,
    answersSnapshot: { ...userAnswers }
  };

  // Salva no histórico
  saveExamToHistory(examResultRecord);

  // Limpa prova em andamento
  localStorage.removeItem("anhanguera_current_exam_state");

  // Exibe tela/modal de resultados
  displayResultsModal(examResultRecord);
}

function displayResultsModal(record) {
  dom.resultScoreNumber.textContent = `${record.correctCount} / ${record.totalQuestions}`;
  dom.resultScorePercent.textContent = `${record.scorePercent}% de Acerto`;
  dom.resultExamTitle.textContent = record.title;
  dom.resultExamSubtitle.textContent = `Finalizado em ${formatBrazilianDate(record.date)} • Duração: ${record.durationFormatted}`;

  if (record.isPassed) {
    dom.resultPerformancePill.textContent = "Aprovado! Excelente aproveitamento";
    dom.resultPerformancePill.className = "performance-pill passed";
  } else {
    dom.resultPerformancePill.textContent = "Atenção: Necessário revisar os conteúdos";
    dom.resultPerformancePill.className = "performance-pill failed";
  }

  dom.statCorrectCount.textContent = record.correctCount;
  dom.statWrongCount.textContent = record.wrongCount;
  dom.statTimeSpent.textContent = record.durationFormatted;

  // Monta a revisão detalhada questão por questão
  dom.resultsDetailedReviewList.innerHTML = "";

  record.questionsSnapshot.forEach((q, idx) => {
    const userChoice = record.answersSnapshot[idx];
    const isCorrect = userChoice === q.correctAnswer;

    // Encontra o texto das opções
    const userOptionObj = q.options.find((o) => o.id === userChoice);
    const correctOptionObj = q.options.find((o) => o.id === q.correctAnswer);

    const userText = userOptionObj ? `${userChoice}. ${userOptionObj.text}` : "Não respondida";
    const correctText = correctOptionObj ? `${q.correctAnswer}. ${correctOptionObj.text}` : q.correctAnswer;

    const card = document.createElement("div");
    card.className = `review-item-card ${isCorrect ? "is-correct" : "is-wrong"}`;

    card.innerHTML = `
      <div class="review-item-header">
        <span class="review-item-title">Questão ${idx + 1}</span>
        <span class="review-status-tag ${isCorrect ? "correct" : "wrong"}">
          ${isCorrect ? "✓ Acertou" : "✗ Errou"}
        </span>
      </div>
      <div class="review-statement">${formatStatementText(q.statement)}</div>
      <div class="review-answers-box">
        <div class="user-chosen-line ${isCorrect ? "correct-text" : "wrong-text"}">
          <span>Sua resposta:</span> <strong>${escapeHtml(userText)}</strong>
        </div>
        ${
          !isCorrect
            ? `<div class="correct-answer-line"><span>Gabarito correto:</span> <strong>${escapeHtml(correctText)}</strong></div>`
            : ""
        }
      </div>
      ${
        q.explanation
          ? `<div class="review-explanation"><strong>Comentário do Professor:</strong> ${escapeHtml(q.explanation)}</div>`
          : ""
      }
    `;

    dom.resultsDetailedReviewList.appendChild(card);
  });

  dom.resultsModal.classList.add("active");
}

dom.btnCloseResults.addEventListener("click", () => {
  dom.resultsModal.classList.remove("active");
});

dom.btnStartNewFromResults.addEventListener("click", () => {
  dom.resultsModal.classList.remove("active");
  generateNewRandomExam();
});

dom.btnViewHistoryFromResults.addEventListener("click", () => {
  dom.resultsModal.classList.remove("active");
  openSidebar();
  switchTab("tab-history");
});

// ==========================================
// GERENCIAMENTO DO HISTÓRICO
// ==========================================

function getHistory() {
  const data = localStorage.getItem("anhanguera_history");
  if (data) {
    try {
      return JSON.parse(data) || [];
    } catch (e) {
      console.error("Erro ao ler histórico", e);
    }
  }
  return [];
}

function saveExamToHistory(record) {
  const history = getHistory();
  history.unshift(record); // adiciona no início
  localStorage.setItem("anhanguera_history", JSON.stringify(history));
  updateHistoryUI();
}

function updateHistoryUI() {
  const history = getHistory();
  dom.historyCounterBadge.textContent = history.length;

  if (history.length === 0) {
    dom.historyListContainer.innerHTML = `
      <div class="empty-history-notice">
        Nenhum simulado finalizado até o momento.<br>
        Resolva um simulado de 12 questões para registrar seu progresso!
      </div>
    `;
    return;
  }

  dom.historyListContainer.innerHTML = "";

  history.forEach((item) => {
    const card = document.createElement("div");
    card.className = "history-item-card";

    const dt = new Date(item.finishedAt);
    const timeFormatted = dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    card.innerHTML = `
      <div class="history-item-top">
        <span class="history-item-title">${escapeHtml(item.title)}</span>
        <span class="history-score-pill ${item.isPassed ? "passed" : "failed"}">
          ${item.correctCount}/12 (${item.scorePercent}%)
        </span>
      </div>
      <div class="history-item-meta">
        <span>📅 ${formatBrazilianDate(item.date)} às ${timeFormatted}</span>
        <span>⏱️ Duração: ${item.durationFormatted}</span>
      </div>
      <button class="btn-view-history-detail" data-id="${item.id}">Ver Gabarito Completo</button>
    `;

    const btnView = card.querySelector(".btn-view-history-detail");
    btnView.addEventListener("click", () => {
      displayResultsModal(item);
    });

    dom.historyListContainer.appendChild(card);
  });
}

dom.btnClearHistory.addEventListener("click", () => {
  if (confirm("Deseja realmente apagar todo o histórico de simulados resolvidos?")) {
    localStorage.removeItem("anhanguera_history");
    updateHistoryUI();
    showToast("Histórico limpo com sucesso!");
  }
});

// ==========================================
// BARRA LATERAL (DRAWER) E ABAS
// ==========================================

function openSidebar() {
  dom.sidebarDrawer.classList.add("active");
  dom.sidebarOverlay.classList.add("active");
  updateHistoryUI();
}

function closeSidebar() {
  dom.sidebarDrawer.classList.remove("active");
  dom.sidebarOverlay.classList.remove("active");
}

dom.btnOpenSidebar.addEventListener("click", openSidebar);
dom.btnCloseSidebar.addEventListener("click", closeSidebar);
dom.sidebarOverlay.addEventListener("click", closeSidebar);

// Troca de Abas
dom.tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabTarget = btn.getAttribute("data-tab");
    switchTab(tabTarget);
  });
});

function switchTab(tabId) {
  dom.tabButtons.forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-tab") === tabId);
  });
  dom.tabPanes.forEach((p) => {
    p.classList.toggle("active", p.id === tabId);
  });
}

// Salvar Dados do Simulado (Título e Data)
dom.formExamSettings.addEventListener("submit", (e) => {
  e.preventDefault();
  examMetadata.title = dom.inputExamTitle.value.trim() || "Simulado de Prova";
  examMetadata.date = dom.inputExamDate.value || new Date().toISOString().split("T")[0];
  saveMetadata();
  showToast("Dados do simulado atualizados com sucesso!");
});

// Botão Sortear Novo Simulado
dom.btnNewRandomExam.addEventListener("click", () => {
  generateNewRandomExam();
});

["Português", "Matemática", "all"].forEach(subject => {
  const btn = document.querySelector(`[data-subject="${subject}"]`);
  if (btn) btn.addEventListener("click", () => startExam(subject));
});

// Restaurar Banco de Questões Padrão
dom.btnResetToDefaultBank.addEventListener("click", () => {
  if (confirm("Deseja restaurar o banco de questões padrão de fábrica? Questões adicionais manuais serão reiniciadas.")) {
    localStorage.removeItem("anhanguera_question_bank");
    questionBank = getInitialQuestions();
    updateBankCounters();
    showToast("Banco de questões padrão restaurado!");
  }
});

// Carregar Exemplo Idêntico à Imagem
if (dom.btnLoadScreenshotDemo) {
  dom.btnLoadScreenshotDemo.addEventListener("click", () => {
    loadScreenshotDemoState();
  });
}

function loadScreenshotDemoState() {
  questionBank = getInitialQuestions();
  currentExamQuestions = questionBank.slice(0, EXAM_LENGTH);

  // Respostas exatamente iguais às mostradas na foto
  userAnswers = {
    0: "A", // 1A
    1: "C", // 2C
    2: "D", // 3D
    3: "A", // 4A (Questão da foto: homonímia, marcada A)
    4: "E", // 5E
    5: "D", // 6D
    6: "D", // 7D
    7: "A", // 8A
    8: "B", // 9B
    9: "A", // 10A
    10: "A", // 11A
    11: "B"  // 12B
  };

  currentQuestionIndex = 3; // Questão 4 ativa
  timerSeconds = 872; // ~14m 32s

  saveActiveExamState();
  initTimer();
  renderActiveQuestion();
  renderBubbles();
  updateProgressBar();
  closeSidebar();
  showToast("Estado idêntico à imagem carregado com sucesso!");
}

// ==========================================
// CADASTRO DE NOVAS QUESTÕES NO BANCO
// ==========================================

dom.formAddQuestion.addEventListener("submit", (e) => {
  e.preventDefault();

  const statement = dom.newQuestionStatement.value.trim();
  const optA = dom.newOptionA.value.trim();
  const optB = dom.newOptionB.value.trim();
  const optC = dom.newOptionC.value.trim();
  const optD = dom.newOptionD.value.trim();
  const optE = dom.newOptionE.value.trim();
  const correctAnswer = dom.newCorrectAnswer.value;
  const explanation = dom.newExplanation.value.trim();

  if (!statement || !optA || !optB || !optC || !optD || !optE || !correctAnswer) {
    alert("Por favor, preencha todos os campos obrigatórios (enunciado, opções A-E e o gabarito).");
    return;
  }

  const newQuestion = {
    id: "custom-" + Date.now(),
    subject: document.getElementById("newQuestionSubject")?.value || "Português",
    topic: "Cadastro manual",
    statement: statement,
    options: [
      { id: "A", text: optA },
      { id: "B", text: optB },
      { id: "C", text: optC },
      { id: "D", text: optD },
      { id: "E", text: optE }
    ],
    correctAnswer: correctAnswer,
    explanation: explanation || "Gabarito oficial: Alternativa " + correctAnswer
  };

  // Salva no banco
  questionBank.unshift(newQuestion);
  localStorage.setItem("anhanguera_question_bank", JSON.stringify(questionBank));

  updateBankCounters();
  dom.formAddQuestion.reset();

  showToast("Nova questão cadastrada com sucesso no banco!");
});

// ==========================================
// IMPORTAÇÃO DE QUESTÕES EM LOTE (JSON / TEXTO)
// ==========================================

// Alternância entre abas "Em Massa" e "Manual"
if (dom.btnSubtabBulk && dom.btnSubtabSingle) {
  dom.btnSubtabBulk.addEventListener("click", () => {
    dom.btnSubtabBulk.classList.add("active");
    dom.btnSubtabSingle.classList.remove("active");
    dom.paneBulkImport.classList.add("active");
    dom.paneSingleImport.classList.remove("active");
  });

  dom.btnSubtabSingle.addEventListener("click", () => {
    dom.btnSubtabSingle.classList.add("active");
    dom.btnSubtabBulk.classList.remove("active");
    dom.paneSingleImport.classList.add("active");
    dom.paneBulkImport.classList.remove("active");
  });
}

// Upload de arquivo JSON / TXT
if (dom.inputJsonFile) {
  dom.inputJsonFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      dom.fileChosenName.textContent = `Arquivo carregado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      const reader = new FileReader();
      reader.onload = (event) => {
        dom.bulkQuestionsTextarea.value = event.target.result;
        validateAndPreviewBulkInput(event.target.result);
      };
      reader.readAsText(file);
    }
  });
}

// Drag & Drop no dropzone
if (dom.dropzoneBox) {
  dom.dropzoneBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    dom.dropzoneBox.classList.add("dragover");
  });
  dom.dropzoneBox.addEventListener("dragleave", () => {
    dom.dropzoneBox.classList.remove("dragover");
  });
  dom.dropzoneBox.addEventListener("drop", (e) => {
    e.preventDefault();
    dom.dropzoneBox.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      dom.fileChosenName.textContent = `Arquivo carregado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      const reader = new FileReader();
      reader.onload = (event) => {
        dom.bulkQuestionsTextarea.value = event.target.result;
        validateAndPreviewBulkInput(event.target.result);
      };
      reader.readAsText(file);
    }
  });
}

// Modelos de exemplo: JSON e Texto
const SAMPLE_JSON_TEMPLATE = [
  {
    "statement": "Na comunicação empresarial e acadêmica, a clareza e a concisão são elementos fundamentais. Considerando as funções da linguagem descritas por Roman Jakobson, avalie as afirmativas:\nI) A função referencial tem como foco o contexto.\nII) A função emotiva enfatiza o emissor.\nEstá correto o que se afirma em:",
    "options": [
      { "id": "A", "text": "apenas I e II." },
      { "id": "B", "text": "apenas I." },
      { "id": "C", "text": "apenas II." },
      { "id": "D", "text": "nenhuma das alternativas." },
      { "id": "E", "text": "todas as afirmativas." }
    ],
    "correctAnswer": "A",
    "explanation": "Tanto a função referencial quanto a emotiva foram descritas corretamente."
  },
  {
    "statement": "No contexto da gestão ambiental e desenvolvimento sustentável, qual das seguintes práticas NÃO faz parte do conceito dos 5Rs?",
    "options": [
      { "id": "A", "text": "Repensar" },
      { "id": "B", "text": "Recusar" },
      { "id": "C", "text": "Reduzir" },
      { "id": "D", "text": "Rentabilizar" },
      { "id": "E", "text": "Reciclar" }
    ],
    "correctAnswer": "D",
    "explanation": "Rentabilizar não integra o rol tradicional dos 5Rs (Repensar, Recusar, Reduzir, Reutilizar e Reciclar)."
  }
];

const SAMPLE_TEXT_TEMPLATE = `Questão 1: Na comunicação empresarial e acadêmica, a clareza e a concisão são elementos fundamentais.
A) apenas I e II.
B) apenas I.
C) apenas II.
D) nenhuma das alternativas.
E) todas as afirmativas.
Gabarito: A
Explicação: Tanto a função referencial quanto a emotiva foram descritas corretamente.

Questão 2: No contexto da gestão ambiental e desenvolvimento sustentável, qual das seguintes práticas NÃO faz parte do conceito dos 5Rs?
A) Repensar
B) Recusar
C) Reduzir
D) Rentabilizar
E) Reciclar
Gabarito: D
Explicação: Rentabilizar não integra os 5Rs da sustentabilidade.`;

if (dom.btnLoadJsonTemplate) {
  dom.btnLoadJsonTemplate.addEventListener("click", () => {
    dom.bulkQuestionsTextarea.value = JSON.stringify(SAMPLE_JSON_TEMPLATE, null, 2);
    validateAndPreviewBulkInput(dom.bulkQuestionsTextarea.value);
    showToast("Modelo JSON de exemplo carregado!");
  });
}

if (dom.btnLoadTextTemplate) {
  dom.btnLoadTextTemplate.addEventListener("click", () => {
    dom.bulkQuestionsTextarea.value = SAMPLE_TEXT_TEMPLATE;
    validateAndPreviewBulkInput(dom.bulkQuestionsTextarea.value);
    showToast("Modelo em texto de exemplo carregado!");
  });
}

// Analisador inteligente (Parser de JSON e Texto)
function parseQuestionsFromInput(inputStr) {
  if (!inputStr || !inputStr.trim()) {
    return { success: false, error: "Nenhum conteúdo fornecido. Cole o JSON/texto ou selecione um arquivo." };
  }

  const raw = inputStr.trim();

  // 1. Tenta interpretar como JSON
  try {
    const parsed = JSON.parse(raw);
    let items = [];

    if (Array.isArray(parsed)) {
      items = parsed;
    } else if (parsed && typeof parsed === "object") {
      if (Array.isArray(parsed.questions)) items = parsed.questions;
      else if (Array.isArray(parsed.questoes)) items = parsed.questoes;
      else if (Array.isArray(parsed.banco)) items = parsed.banco;
      else if (parsed.statement || parsed.enunciado) items = [parsed];
    }

    if (items.length > 0) {
      const normalized = [];
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const statement = (it.statement || it.enunciado || it.pergunta || it.question || it.texto || "").trim();
        if (!statement) continue;

        let options = [];
        const rawOpts = it.options || it.alternativas || it.opcoes || [];

        if (Array.isArray(rawOpts)) {
          options = rawOpts.map((opt, idx) => {
            const letter = ["A", "B", "C", "D", "E"][idx] || String.fromCharCode(65 + idx);
            if (typeof opt === "string") {
              return { id: letter, text: opt.trim() };
            } else if (opt && typeof opt === "object") {
              return {
                id: (opt.id || opt.letra || letter).toString().trim().toUpperCase(),
                text: (opt.text || opt.texto || opt.descricao || "").toString().trim()
              };
            }
            return { id: letter, text: String(opt || "") };
          });
        } else if (rawOpts && typeof rawOpts === "object") {
          options = Object.keys(rawOpts).map((key) => ({
            id: key.trim().toUpperCase(),
            text: String(rawOpts[key]).trim()
          }));
        }

        if (options.length < 2) continue;

        let correctAnswer = (it.correctAnswer || it.gabarito || it.resposta || it.correta || "A").toString().trim().toUpperCase();
        if (correctAnswer.length > 1) {
          const matchLetter = correctAnswer.match(/[A-E]/);
          correctAnswer = matchLetter ? matchLetter[0] : "A";
        }

        const explanation = (it.explanation || it.explicacao || it.comentario || it.justificativa || "").trim();

        normalized.push({
          id: "bulk-json-" + Date.now() + "-" + (i + 1),
          subject: it.subject || it.disciplina || "Português",
          topic: it.topic || it.tema || "Geral",
          type: it.type || "multiple_choice",
          statement: statement,
          options: options,
          correctAnswer: correctAnswer,
          explanation: explanation || `Gabarito oficial: Alternativa ${correctAnswer}`
        });
      }

      if (normalized.length > 0) {
        return { success: true, count: normalized.length, questions: normalized, format: "JSON" };
      }
    }
  } catch (e) {
    // Não é JSON válido, continuaremos com o analisador de texto
  }

  // 2. Analisador de Texto Comum
  const lines = raw.split(/\r?\n/);
  const questionsList = [];

  let curStatementLines = [];
  let curOptions = {};
  let curGabarito = null;
  let curExplanationLines = [];
  let currentMode = "statement"; // "statement" | "options" | "explanation"
  let lastOptionLetter = null;

  function flushCurrentQuestion() {
    const statement = curStatementLines.join("\n").trim();
    const optKeys = Object.keys(curOptions);

    if (statement && optKeys.length >= 2) {
      // Ordena alternativas A, B, C, D, E
      const sortedOptions = ["A", "B", "C", "D", "E"]
        .filter((k) => curOptions[k] !== undefined)
        .map((k) => ({ id: k, text: curOptions[k] }));

      // Se houver outras chaves não-padrão
      optKeys.forEach((k) => {
        if (!["A", "B", "C", "D", "E"].includes(k)) {
          sortedOptions.push({ id: k, text: curOptions[k] });
        }
      });

      let gabarito = curGabarito || "A";
      const explanation = curExplanationLines.join("\n").trim();

      questionsList.push({
        id: "bulk-txt-" + Date.now() + "-" + (questionsList.length + 1),
        statement: statement,
        options: sortedOptions,
        correctAnswer: gabarito,
        explanation: explanation || `Gabarito oficial: Alternativa ${gabarito}`
      });
    }

    curStatementLines = [];
    curOptions = {};
    curGabarito = null;
    curExplanationLines = [];
    currentMode = "statement";
    lastOptionLetter = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      if (currentMode === "statement" && curStatementLines.length > 0) {
        curStatementLines.push("");
      }
      continue;
    }

    // Detecta início de nova questão explícita (ex: "Questão 2:", "2.", "Questão 03 -")
    const newQMatch = trimmed.match(/^(?:Quest[aã]o\s*\d+|\d+[\.\)\-])\s*[:\.\-]?\s*(.*)/i);
    if (newQMatch && Object.keys(curOptions).length >= 2) {
      flushCurrentQuestion();
      if (newQMatch[1]) {
        curStatementLines.push(newQMatch[1].trim());
      }
      currentMode = "statement";
      continue;
    }

    // Detecta Gabarito (ex: "Gabarito: A", "Resposta: C", "Gabarito oficial: B")
    const gabMatch = trimmed.match(/^(?:Gabarito|Resposta|Correta|Alternativa\s*Correta)[\s:.-]*([A-Ea-e])/i);
    if (gabMatch) {
      curGabarito = gabMatch[1].toUpperCase();
      currentMode = "gabarito";
      continue;
    }

    // Detecta Explicação / Comentário (ex: "Explicação: ...", "Comentário: ...")
    const expMatch = trimmed.match(/^(?:Explica[cç][aã]o|Coment[aá]rio|Justificativa)[\s:.-]*(.*)/i);
    if (expMatch) {
      if (expMatch[1]) curExplanationLines.push(expMatch[1].trim());
      currentMode = "explanation";
      continue;
    }

    // Detecta Alternativa (ex: "A) texto...", "A. texto...", "A - texto...")
    const optMatch = trimmed.match(/^([A-Ea-e])[\.\)\-\:]\s*(.+)/);
    if (optMatch) {
      const letter = optMatch[1].toUpperCase();
      curOptions[letter] = optMatch[2].trim();
      currentMode = "options";
      lastOptionLetter = letter;
      continue;
    }

    // Continuação de linha anterior
    if (currentMode === "explanation") {
      curExplanationLines.push(trimmed);
    } else if (currentMode === "options" && lastOptionLetter) {
      curOptions[lastOptionLetter] += " " + trimmed;
    } else {
      curStatementLines.push(trimmed);
    }
  }

  flushCurrentQuestion();

  if (questionsList.length > 0) {
    return { success: true, count: questionsList.length, questions: questionsList, format: "Texto Formatado" };
  }

  return {
    success: false,
    error: "Não foi possível identificar questões válidas no texto colado. Verifique se as alternativas estão identificadas com A), B), C), D), E) e o Gabarito com 'Gabarito: X', ou use o botão 'Exemplo JSON'."
  };
}

// Validação em tempo real ao digitar ou carregar arquivo
function validateAndPreviewBulkInput(text) {
  if (!dom.bulkStatusBox) return;

  if (!text || !text.trim()) {
    dom.bulkStatusBox.style.display = "none";
    return;
  }

  const result = parseQuestionsFromInput(text);
  dom.bulkStatusBox.style.display = "block";

  if (result.success) {
    dom.bulkStatusBox.className = "bulk-status-box success";
    dom.bulkStatusBox.innerHTML = `
      <strong>✓ ${result.count} questão(ões) identificada(s)</strong> com formato <em>${result.format}</em>.<br>
      Clique em <strong>"Adicionar Todas as Questões ao Banco"</strong> para confirmar.
    `;
  } else {
    dom.bulkStatusBox.className = "bulk-status-box error";
    dom.bulkStatusBox.innerHTML = `<strong>Atenção:</strong> ${result.error}`;
  }
}

if (dom.bulkQuestionsTextarea) {
  dom.bulkQuestionsTextarea.addEventListener("input", (e) => {
    validateAndPreviewBulkInput(e.target.value);
  });
}

// Botão Executar Importação em Massa
if (dom.btnProcessBulkImport) {
  dom.btnProcessBulkImport.addEventListener("click", () => {
    const rawText = dom.bulkQuestionsTextarea.value;
    const result = parseQuestionsFromInput(rawText);

    if (!result.success) {
      alert(result.error);
      return;
    }

    const append = dom.checkAppendBank ? dom.checkAppendBank.checked : true;
    const startImmediately = dom.checkStartExamImmediately ? dom.checkStartExamImmediately.checked : false;

    if (append) {
      questionBank = [...result.questions, ...questionBank];
    } else {
      if (confirm(`Atenção: Isso substituirá as ${questionBank.length} questões atuais pelas ${result.count} novas questões. Deseja continuar?`)) {
        questionBank = [...result.questions];
      } else {
        return;
      }
    }

    // Salva no LocalStorage
    localStorage.setItem("anhanguera_question_bank", JSON.stringify(questionBank));
    updateBankCounters();

    // Feedback
    showToast(`Sucesso! ${result.count} questões adicionadas ao banco.`);
    dom.bulkQuestionsTextarea.value = "";
    if (dom.fileChosenName) dom.fileChosenName.textContent = "Nenhum arquivo selecionado";
    if (dom.bulkStatusBox) dom.bulkStatusBox.style.display = "none";

    // Se marcado para iniciar simulado imediatamente com as novas questões
    if (startImmediately) {
      if (result.questions.length >= EXAM_LENGTH) {
        currentExamQuestions = result.questions.slice(0, EXAM_LENGTH);
      } else {
        const needed = EXAM_LENGTH - result.questions.length;
        const remainder = questionBank.filter((q) => !result.questions.some((rq) => rq.id === q.id));
        currentExamQuestions = [...result.questions, ...remainder.slice(0, needed)];
      }

      userAnswers = {};
      currentQuestionIndex = 0;
      timerSeconds = 0;

      saveActiveExamState();
      initTimer();
      renderActiveQuestion();
      renderBubbles();
      updateProgressBar();
      closeSidebar();
      showToast(`Simulado iniciado com as novas questões importadas!`);
    }
  });
}

// Exportar Banco Atual (.JSON)
if (dom.btnExportCurrentBank) {
  dom.btnExportCurrentBank.addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questionBank, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `banco_questoes_anhanguera_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Download do banco de questões iniciado!");
  });
}

// ==========================================
// ATALHOS DE TECLADO
// ==========================================
document.addEventListener("keydown", (e) => {
  // Ignora atalhos caso o usuário esteja digitando em campos de formulário
  const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
  if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
    return;
  }

  // Tecla ESC para fechar gavetas ou modais
  if (e.key === "Escape") {
    closeSidebar();
    dom.confirmFinishModal.classList.remove("active");
    dom.resultsModal.classList.remove("active");
    return;
  }

  // Se algum modal ou gaveta estiver visível, não processa atalhos de questão
  if (
    dom.confirmFinishModal.classList.contains("active") ||
    dom.resultsModal.classList.contains("active") ||
    dom.sidebarDrawer.classList.contains("active")
  ) {
    return;
  }

  const key = e.key.toUpperCase();
  if (["A", "B", "C", "D", "E"].includes(key)) {
    selectOption(key);
  } else if (["1", "2", "3", "4", "5"].includes(key)) {
    const numMap = { "1": "A", "2": "B", "3": "C", "4": "D", "5": "E" };
    selectOption(numMap[key]);
  } else if (e.key === "ArrowLeft") {
    dom.btnPrev.click();
  } else if (e.key === "ArrowRight") {
    dom.btnNext.click();
  }
});


// ==========================================
// MODO ESCURO
// ==========================================
const THEME_STORAGE_KEY = "simulados_theme";

function applySavedTheme(theme) {
  const dark = theme === "dark";
  document.body.classList.toggle("dark-mode", dark);
  if (dom.btnThemeToggle) {
    dom.btnThemeToggle.innerHTML = dark ? "☀️ <span>Modo claro</span>" : "🌙 <span>Modo escuro</span>";
    dom.btnThemeToggle.setAttribute("aria-label", dark ? "Ativar modo claro" : "Ativar modo escuro");
    dom.btnThemeToggle.title = dark ? "Ativar modo claro" : "Ativar modo escuro";
  }
}

function initializeThemeToggle() {
  applySavedTheme(localStorage.getItem(THEME_STORAGE_KEY) || "light");
  if (dom.btnThemeToggle) {
    dom.btnThemeToggle.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applySavedTheme(nextTheme);
    });
  }
}

// ==========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initializeThemeToggle();
  loadBankAndMetadata();
  showSubjectSelection();
  updateHistoryUI();
});
