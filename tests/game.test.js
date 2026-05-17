const { JSDOM } = require('jsdom'); //biblioteca que permite simular a logica do html e os eventos DOM
const path = require('path');
const fs = require('fs');

// ler html do index.html
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

let dom;

beforeEach(() => {
    jest.resetModules();// limpa as variaveis do script.js para cada teste começar
    
    dom = new JSDOM(html);// cria o simulador com html / carrega os elementos do index.js
    global.document = dom.window.document;
    global.window = dom.window;

    
    const script = require('../resources/script/app.js');// não dispara fetch nem init()
    global.adcionarLetra = script.adcionarLetra;
    global.apagarLetra = script.apagarLetra;
    global.handleKeyAction = script.handleKeyAction; 
    global.Toastify = () => ({showToast: () => {}})
})

describe('Adicionar letras nos quadrados', () => {

    test('deve exibir a letra H no primeiro quadrado quando a função for chamada', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        adcionarLetra('H',0);

        expect(quadrado[0].textContent).toBe('H');
    });

    test('não deve adicionar a letra quando a posição maxima for ultrapassada', () => {
        const quadrado = document.querySelectorAll('.quadrado');
        
        adcionarLetra('F',5);// conferir logica aqui

        expect(quadrado[0].textContent).toBe('');
    });

});

describe('Remover letra do quadrado', () => {

    test('deve remover a letra quando a tecla BACKSPACE for pressionada', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const posicao = 5;

        adcionarLetra("S",posicao);

        apagarLetra("S",posicao);

        expect(quadrado[posicao].textContent).toBe("");
    })

    test('não deve remover uma letra se o index/posicao da letra for menor que 0', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const posicao = 5;

        adcionarLetra("S",posicao);

        apagarLetra("S",-1);

        expect(quadrado[posicao].textContent).toBe("S");// tem que ser diferente de um espaço vazio
    })
})

describe('Simular teclado', () => {// corrgit logica de eventos keydow e click atualizados

    test('deve exibir "A" no quadrado quando a tecla "a" for pressionada', () => {
        let estado = {
            linhaAtual: 0,
            indexLetra: 0,
            palavraDaVez: 'SABER',
        }

        handleKeyAction("A", estado)

        const quadrado = document.querySelectorAll('.quadrado');
        
        expect(quadrado[0].textContent).toBe('A');
    });

    test('deve avançar o indexLetra quando uma tecla (a - z) for pressionada', () => {
        let estado = {
            linhaAtual: 0,
            indexLetra: 0,
            palavraDaVez: 'SABER',
        }

        estado = handleKeyAction("B", estado)// encadeia os estados para o indexLetra aumentar/inteirar
        estado = handleKeyAction("C", estado)

        const quadrado = document.querySelectorAll('.quadrado');

        expect(quadrado[0].textContent).toBe('B');
        expect(quadrado[1].textContent).toBe('C');
    })
});

describe('Mapeamento de teclas para elementos do teclado virtual', () => {
    
    test('deve salvar o elemento do botão no objButtons com a tecla como chave', () => {
        const objButtons = {};
        const tecla = "A"
        const button = document.querySelector(`[value=${tecla}]`);

        adcionarLetra(tecla, 0, button, objButtons);
        
        expect(objButtons[tecla]).toBe(button);
    });

    test('deve apagar o elemento do botão e a tecla no objButtons', () => {
        const objButtons = {};
        const tecla = "D";
        const button = document.querySelector(`[value=${tecla}]`);

        objButtons[tecla] = button;

        apagarLetra(tecla, 0, button, objButtons);
        
        expect(objButtons[tecla]).toBeUndefined();
    });
});

describe('Verificar encerramento do jogo', () => {
    test('deve encerrar o jogo e exibir o botão de reset quando o palpite for correto', () => {
        const quadrado = document.querySelectorAll('.quadrado');
        const areaBtnReset = document.querySelector('.area-butao-reset');
        
        const estado = {
            linhaAtual: 0,
            indexLetra: 5,
            palavraDaVez: 'CASAR',
            jogoEncerrado: false,
        }

        adcionarLetra('C',0);
        adcionarLetra('A',1);
        adcionarLetra('S',2);
        adcionarLetra('A',3);
        adcionarLetra('R',4);

        const tecla = "ENTER";

        const novoEstado = handleKeyAction(tecla, estado, {});

        expect(novoEstado.jogoEncerrado).toBe(true);
        expect(areaBtnReset.classList.contains('visible')).toBe(true);
    })

    test('deve encerrar o jogo e exibir o butão de reset quando o palpite for incorreto e quando estiver na ultima tentativa/linha', () => {
        const quadrado = document.querySelectorAll('.quadrado');
        const areaBtnReset = document.querySelector('.area-butao-reset');
        
        const estado = {
            linhaAtual: 5,
            indexLetra: 5,
            palavraDaVez: 'CASAR',
            jogoEncerrado: false,
        }

        adcionarLetra('L',0);
        adcionarLetra('I',1);
        adcionarLetra('V',2);
        adcionarLetra('R',3);
        adcionarLetra('O',4);

        const tecla = "ENTER";

        const novoEstado = handleKeyAction(tecla, estado, {});

        expect(novoEstado.jogoEncerrado).toBe(true);
        expect(areaBtnReset.classList.contains('visible')).toBe(true);
    })
})
