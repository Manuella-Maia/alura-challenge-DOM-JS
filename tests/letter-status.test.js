const { JSDOM } = require('jsdom');
const path = require('path');
const fs = require('fs')

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

let dom;

beforeEach(() => {
    jest.resetAllMocks();

    dom = new JSDOM(html);
    global.document = dom.window.document;
    global.window = dom.window;

    const script = require('../script.js');
    global.validarLetras = script.validarLetras;
    global.contarInsidenciaLetras = script.contarInsidenciaLetras;
});

describe('Montar objeto de insidencia de letras', () => {

    test('deve retornar um objeto', () => {
        const wordRandom = "SABER";
        const result = contarInsidenciaLetras(wordRandom);

        expect(result).not.toBeNull();// espera que não seja null
        expect(result).toEqual(expect.any(Object));// espera que seja do tipo objeto
        expect(result).not.toEqual(expect.any(Array));// espera que não seja um array
    });

    test('deve interar o contador em cada letra quando houver insidencia', () => {
        const wordRandom = "CARRO";
        const result = contarInsidenciaLetras(wordRandom);

        expect(result["R"]).not.toBe(0);
        expect(result["R"]).not.toBeNull();
        expect(result["R"]).toBe(2)
    })

    test('deve retornar um objeto vazio se o tamanho da palavra for 0', () => {
        const wordRandom = "";
        const result = contarInsidenciaLetras(wordRandom);

        expect(result).toEqual({});
    })
});

describe('Definir cor da letra do palpite', () => {

    test('deve adicionar a classe posicao-correta no quadrado quando a letra coincidir', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const wordRandom = "SABER";
        const palpite = "CARRO"
        const linhaAtual = 3;
        const objetoDeInsidencia = {"S": 1,"A": 1,"B": 1,"E": 1,"R": 1};
        const posicao = 16; //posicao = (3 * 5) + 1 = 16

        validarLetras(palpite, wordRandom, linhaAtual, objetoDeInsidencia);

        expect(quadrado[posicao].classList.contains('posicao-correta')).toBe(true);// classlist é um metodo de objeto
    });

    test('deve adicionar a classe posicao-errada no quadrado quando a letra estiver na posição errada', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const wordRandom = "SABER";
        const palpite = "CARRO"
        const linhaAtual = 3;
        const objetoDeInsidencia = {"S": 1,"A": 1,"B": 1,"E": 1,"R": 1};
        const posicao = 17; //posicao = (3 * 5) + 2 = 17

        validarLetras(palpite, wordRandom, linhaAtual, objetoDeInsidencia);

        expect(quadrado[posicao].classList.contains('posicao-errada')).toBe(true);// classlist é um metodo de objeto
    });

    test('deve adicionar a classe letra-ausente no quadrado quando a letra não existir na palavra sorteada', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const wordRandom = "SABER";
        const palpite = "CARRO"
        const linhaAtual = 3;
        const objetoDeInsidencia = {"S": 1,"A": 1,"B": 1,"E": 1,"R": 1};
        const posicao = 19; //posicao = (3 * 5) + 4 = 19

        validarLetras(palpite, wordRandom, linhaAtual, objetoDeInsidencia);

        expect(quadrado[posicao].classList.contains('letra-ausente')).toBe(true);// classlist é um metodo de objeto
    });

    
})