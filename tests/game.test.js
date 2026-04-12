
const { JSDOM } = require('jsdom'); //biblioteca que permite simular a logica do html e os eventos DOM
const path = require('path');
const fs = require('fs');

// ler html do index.html
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

let dom;

beforeEach(() => {
    jest.resetModules();// limpa as variaveis do script.js para cada teste começar
    
    dom = new JSDOM(html);// cria o simulador com html
    global.document = dom.window.document;
    global.window = dom.window;

    
    const script = require('../script.js');// não dispara fetch nem init()
    global.adcionarLetra = script.adcionarLetra;
    global.apagarLetra = script.apagarLetra;
    global.handleKeyDown = script.handleKeyDown; 
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

        apagarLetra(posicao);

        expect(quadrado[posicao].textContent).toBe("");
    })

    test('não deve remover uma letra se o index/posicao da letra for menor que 0', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const posicao = 5;

        adcionarLetra("S",posicao);

        apagarLetra(-1);

        expect(quadrado[posicao].textContent).toBe("S");// tem que ser diferente de um espaço vazio
    })
})

describe('Simular teclado', () => {// corrgit logica de eventos para passar para handleKeyDown

    test('deve exibir "A" no quadrado quando a tecla "a" for pressionada', () => {
        let estado = {
            linhaAtual: 0,
            indexLetra: 0,
            palavraDaVez: 'SABER',
        }

        handleKeyDown("A", estado)

        const quadrado = document.querySelectorAll('.quadrado');
        
        expect(quadrado[0].textContent).toBe('A');
    });

    test('deve avançar o indexLetra quando uma tecla (a - z) for pressionada', () => {
        let estado = {
            linhaAtual: 0,
            indexLetra: 0,
            palavraDaVez: 'SABER',
        }

        estado = handleKeyDown("B", estado)// encadeia os estados para o indexLetra aumentar/inteirar
        estado = handleKeyDown("C", estado)

        const quadrado = document.querySelectorAll('.quadrado');

        expect(quadrado[0].textContent).toBe('B');
        expect(quadrado[1].textContent).toBe('C');
    })
});