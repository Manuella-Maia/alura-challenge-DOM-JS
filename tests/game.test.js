const { JSDOM } = require('jsdom'); //biblioteca que permite simular a logica do html e os eventos DOM
const path = require('path');
const fs = require('fs');

// ler html do index.html
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

let dom;

const elementsFake = () => ({
    quadrado: document.querySelectorAll('.quadrado'),
    teclado: document.querySelector('.teclado'),
    btnReset: document.querySelector('.bntReset'),
    areaReset: document.querySelector('.area-butao-reset')
})

beforeEach(() => {
    jest.resetModules();// limpa as variaveis do script.js para cada teste começar
    
    dom = new JSDOM(html);// cria o simulador com html / carrega os elementos do index.js
    global.document = dom.window.document;
    global.window = dom.window;

    
    const script = require('../resources/script/app.js');// não dispara fetch nem init()
    global.adcionarLetra = script.adcionarLetra;
    global.apagarLetra = script.apagarLetra;
    global.handleKeyAction = script.handleKeyAction; 
    global.Toastify = () => ({showToast: () => {}});
})

describe('Adicionar letras nos quadrados', () => {

    test('deve exibir a letra H no primeiro quadrado quando a função for chamada', () => {
        const { quadrado } = elementsFake();

        adcionarLetra('H',0, null, {}, quadrado);

        expect(quadrado[0].textContent).toBe('H');
    })

    test('não deve adicionar a letra quando a posição maxima for ultrapassada', () => {
        const { quadrado } = elementsFake();
        
        adcionarLetra('F', 5, null, {},  quadrado);// conferir logica aqui

        expect(quadrado[0].textContent).toBe('');
    })

})

describe('Remover letra do quadrado', () => {

    test('deve remover a letra quando a tecla BACKSPACE for pressionada', () => {
        const { quadrado } = elementsFake();
        const posicao = 5;

        adcionarLetra("S", posicao, null, {}, quadrado);

        apagarLetra("S", posicao, null, {}, quadrado);

        expect(quadrado[posicao].textContent).toBe("");
    })

    test('não deve remover uma letra se o index/posicao da letra for menor que 0', () => {
        const { quadrado } = elementsFake();
        const posicao = 5;

        adcionarLetra("S", posicao, null, {}, quadrado);

        apagarLetra("S", -1, null, {},  quadrado);

        expect(quadrado[posicao].textContent).toBe("S");// tem que ser diferente de um espaço vazio
    })
})

describe('Simular teclado', () => {// corrgit logica de eventos keydow e click atualizados

    test('deve exibir "A" no quadrado quando a tecla "a" for pressionada', () => {
        const { quadrado } = elementsFake();
        const elements = elementsFake();

        let estado = {
            linhaAtual: 0,
            indexLetra: 0,
            palavraDaVez: 'SABER',
        }

        handleKeyAction("A", estado, {}, null, elements)
        
        expect(quadrado[0].textContent).toBe('A');
    })

    test('deve avançar o indexLetra quando uma tecla (a - z) for pressionada', () => {
        const { quadrado } = elementsFake();
        const elements = elementsFake();

        let estado = {
            linhaAtual: 0,
            indexLetra: 0,
            palavraDaVez: 'SABER',
        }

        estado = handleKeyAction("B", estado, {}, null, elements)// encadeia os estados para o indexLetra aumentar/inteirar
        estado = handleKeyAction("C", estado, {}, null, elements)

        expect(quadrado[0].textContent).toBe('B');
        expect(quadrado[1].textContent).toBe('C');
    })
})

describe('Mapeamento de teclas para elementos do teclado virtual', () => {
    
    test('deve salvar o elemento do botão no objButtons com a tecla como chave', () => {
        const { quadrado } = elementsFake();
        const objButtons = {};
        const tecla = "A"
        const button = document.querySelector(`[value=${tecla}]`);

        adcionarLetra(tecla, 0, button, objButtons, quadrado);
        
        expect(objButtons[tecla]).toBe(button);
    })

    test('deve apagar o elemento do botão e a tecla no objButtons', () => {
        const { quadrado } = elementsFake();
        const objButtons = {};
        const tecla = "D";
        const button = document.querySelector(`[value=${tecla}]`);

        objButtons[tecla] = button;

        apagarLetra(tecla, 0, button, objButtons, quadrado);
        
        expect(objButtons[tecla]).toBeUndefined();
    })
})

describe('Verificar encerramento do jogo', () => {
    test('deve atualizar jogoEncerrado para true, encerrando a lógica do handleKeyAction quando o palpite for correto', () => {
        const { quadrado, areaReset } = elementsFake();
        const elements = elementsFake();

        const estado = {
            linhaAtual: 0,
            indexLetra: 5,
            palavraDaVez: 'CASAR',
            jogoEncerrado: false,
            butaoVisivel: false
        }

        adcionarLetra('C', 0, null, {}, quadrado);
        adcionarLetra('A', 1, null, {}, quadrado);
        adcionarLetra('S', 2, null, {}, quadrado);
        adcionarLetra('A', 3, null, {}, quadrado);
        adcionarLetra('R', 4, null, {}, quadrado);

        const tecla = "ENTER";

        const novoEstado = handleKeyAction(tecla, estado, {}, null, elements);

        expect(novoEstado.jogoEncerrado).toBe(true);
    })

    test('deve atualizar jogoEncerrado para true, encerrando a lógica do handleKeyAction quando o palpite for incorreto na última tentativa', () => {
        const { quadrado, areaReset } = elementsFake();
        const elements = elementsFake();

        const estado = {
            linhaAtual: 5,
            indexLetra: 5,
            palavraDaVez: 'CASAR',
            jogoEncerrado: false,
            butaoVisivel: false
        }

        adcionarLetra('L', 0, null, {}, quadrado);
        adcionarLetra('I', 1, null, {}, quadrado);
        adcionarLetra('V', 2, null, {}, quadrado);
        adcionarLetra('R', 3, null, {}, quadrado);
        adcionarLetra('O', 4, null, {}, quadrado);

        const tecla = "ENTER";

        const novoEstado = handleKeyAction(tecla, estado, {}, null, elements);

        expect(novoEstado.jogoEncerrado).toBe(true);
    })
})
