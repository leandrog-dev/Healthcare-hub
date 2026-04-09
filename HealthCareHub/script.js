// ================= CONFIG =================
const integrantes = ["Leandro Gabriel"];

// ================= MENU =================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ================= HERO =================
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number[data-target]');

    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        let current = 0;
        const increment = target / 100;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                number.textContent = target;
                clearInterval(timer);
            } else {
                number.textContent = Math.floor(current);
            }
        }, 30);
    });
}

// ================= IMC =================
function initCalculadoraIMC() {
    const form = document.getElementById('imcForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const peso = parseFloat(document.getElementById('peso').value);
        const altura = parseFloat(document.getElementById('altura').value) / 100;

        if (!peso || !altura) {
            alert('Preencha corretamente!');
            return;
        }

        const imc = (peso / (altura * altura)).toFixed(1);

        document.getElementById('imcValor').textContent = imc;

        let status = '';
        let cor = '';

        if (imc < 18.5) {
            status = 'Magreza';
            cor = '#f59e0b';
        } else if (imc < 25) {
            status = 'Normal';
            cor = '#10b981';
        } else if (imc < 30) {
            status = 'Sobrepeso';
            cor = '#f97316';
        } else {
            status = 'Obesidade';
            cor = '#ef4444';
        }

        document.getElementById('imcStatus').textContent = status;
        document.getElementById('imcStatus').style.background = cor;

        document.getElementById('resultadoIMC').classList.remove('hidden');
    });
}

// ================= DICAS =================
function initDicas() {
    const dicas = [
        { titulo: 'Hidrate-se', imagem: '🥤', conteudo: 'Beba 2L de água por dia.' },
        { titulo: 'Caminhe', imagem: '🚶‍♂️', conteudo: '30 min por dia.' },
        { titulo: 'Durma bem', imagem: '😴', conteudo: '7-9 horas.' },
        { titulo: 'Evite açúcar', imagem: '🍬', conteudo: 'Reduza doces.' },
        { titulo: 'Saúde mental', imagem: '🧠', conteudo: 'Controle o estresse.' },
        { titulo: 'Treino de força', imagem: '💪', conteudo: '2x por semana.' },
        { titulo: 'Sem celular', imagem: '📵', conteudo: 'Evite antes de dormir.' },
        { titulo: 'Coma frutas', imagem: '🍎', conteudo: 'Todos os dias.' },
        { titulo: 'Gratidão', imagem: '🙏', conteudo: 'Melhora o bem-estar.' }
    ];

    const grid = document.getElementById('dicasGrid');
    if (!grid) return;

    grid.innerHTML = dicas.map(d => `
        <div class="dica-card">
            <div style="font-size:2rem">${d.imagem}</div>
            <h3>${d.titulo}</h3>
            <p>${d.conteudo}</p>
        </div>
    `).join('');
}

// ================= QUIZ COMPLETO =================
let quizAtual = 0;
let pontuacao = 0;
let respostas = {};

const perguntasQuiz = [
    { pergunta: "Qual é a recomendação diária de água?", opcoes: ["1L", "2-3L", "5L", "Nenhuma"], correta: 1, explicacao: "2-3 litros por dia." },
    { pergunta: "Tempo  de exercício semanal recomendado?", opcoes: ["30min", "75min", "150min", "500min"], correta: 2, explicacao: "150 minutos semanais." },
    { pergunta: "Vitamina C?", opcoes: ["Banana", "Laranja", "Maçã", "Pera"], correta: 1, explicacao: "Laranja tem bastante vitamina C." },
    { pergunta: "Horas de sono?", opcoes: ["4h", "6h", "7-9h", "12h"], correta: 2, explicacao: "7-9 horas ideais." },
    { pergunta: "Qual hábito melhora a saúde?", opcoes: ["Comer fast food todo dia", "Não dormir", "Praticar exercícios", "comer sem limites"], correta: 2, explicacao: "Praticar exercícios" },
    { pergunta: "Caminhada ajuda em?", opcoes: ["Engordar", "Coração", "Dormir mal", "Nada"], correta: 1, explicacao: "Melhora cardiovascular." },
    { pergunta: "Fibras ajudam?", opcoes: ["Colesterol", "Digestão", "Fadiga", "Sono"], correta: 1, explicacao: "Melhora digestão." },
    { pergunta: "Postura previne?", opcoes: ["Dor nas costas", "Sono", "Visão turva", "Nada"], correta: 0, explicacao: "Evita dores." },
    { pergunta: "Água ajuda em?", opcoes: ["Engordar", "Funções do corpo", "Ter diabete", "Indigestão"], correta: 1, explicacao: "Funções do corpo" },
    { pergunta: "Check-up é mais recomendado para qual faixa etária?", opcoes: ["Adultos", "Idosos", "Crianças", "Adolescentes"], correta: 1, explicacao: "idosos." },
    { pergunta: "Açúcar em excesso causa?", opcoes: ["Saúde", "Diabetes", "Energia", "Nada"], correta: 1, explicacao: "Pode causar diabetes." },
    { pergunta: "Exercícios ajudam em?", opcoes: ["Estresse", "Coração", "Saúde", "Todas corretas"], correta: 3, explicacao: "Todas corretas." }
];

function initQuiz() {
    if (!document.getElementById('quizContent')) return;
    renderizarPergunta();
}

function renderizarPergunta() {
    const p = perguntasQuiz[quizAtual];

    document.getElementById('perguntaTexto').textContent = p.pergunta;

    const container = document.getElementById('opcoesContainer');
    container.innerHTML = p.opcoes.map((op, i) =>
        `<div class="opcao" data-indice="${i}">${op}</div>`
    ).join('');

    atualizarProgresso();
}

function atualizarProgresso() {
    const progresso = ((quizAtual + 1) / perguntasQuiz.length) * 100;
    document.getElementById('progressFill').style.width = progresso + '%';
    document.getElementById('progressText').textContent =
        `Pergunta ${quizAtual + 1} de ${perguntasQuiz.length}`;
}

function proximaPergunta() {
    const selecionada = document.querySelector('.opcao.selecionada');
    if (!selecionada) return alert('Selecione uma opção!');

    const indice = parseInt(selecionada.dataset.indice);
    respostas[quizAtual] = indice;

    if (indice === perguntasQuiz[quizAtual].correta) pontuacao++;

    quizAtual++;

    if (quizAtual < perguntasQuiz.length) {
        renderizarPergunta();
    } else {
        mostrarResultado();
    }
}

function mostrarResultado() {
    document.getElementById('quizContent').classList.add('hidden');
    document.getElementById('quizFinal').classList.remove('hidden');

    const porcentagem = Math.round((pontuacao / perguntasQuiz.length) * 100);

    document.getElementById('resultadoFinal').textContent =
        `Você fez ${porcentagem}%`;

    document.getElementById('pontuacaoTexto').textContent =
        `Acertou ${pontuacao} de ${perguntasQuiz.length}`;

    const lista = document.getElementById('acertosLista');
    lista.innerHTML = perguntasQuiz.map((p, i) => {
        const ok = respostas[i] === p.correta ? '✅' : '❌';
        return `<div><strong>${p.pergunta}</strong> ${ok}<br><small>${p.explicacao}</small></div>`;
    }).join('');
}

function reiniciarQuiz() {
    quizAtual = 0;
    pontuacao = 0;
    respostas = {};
    document.getElementById('quizContent').classList.remove('hidden');
    document.getElementById('quizFinal').classList.add('hidden');
    renderizarPergunta();
}

// clique opções + botão próxima
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('opcao')) {
        document.querySelectorAll('.opcao').forEach(o => o.classList.remove('selecionada'));
        e.target.classList.add('selecionada');
    }

    if (e.target.id === 'btnProxima') {
        proximaPergunta();
    }
});

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    setActiveMenu();

    const page = window.location.pathname;

    if (page.includes('index')) animateNumbers();
    if (page.includes('calculadora-imc')) initCalculadoraIMC();
    if (page.includes('dicas')) initDicas();
    if (page.includes('quiz')) initQuiz();
});