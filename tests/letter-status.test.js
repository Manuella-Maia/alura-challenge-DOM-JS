const { JSDOM } = require('jsdom');
const path = require('path');
const fs = require('fs')

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

const makeButon = () => {//retorna um objeto que simula um button do DOM
    const classes = new Set();//acumula classes igual ao classList do DOM
    return {
        classList: {
            add: jest.fn((cls) => classes.add(cls)),
            remove: jest.fn((cls) => classes.delete(cls)),
            contains: jest.fn((cls) => classes.has(cls))//verifica se a classe existe no button
        }
    };
};

let dom;

beforeEach(() => {
    jest.resetAllMocks();

    dom = new JSDOM(html);
    global.document = dom.window.document;
    global.window = dom.window;

    const script = require('../resources/script/app.js');
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
    });

    test('deve retornar um objeto vazio se o tamanho da palavra for 0', () => {
        const wordRandom = "";
        const result = contarInsidenciaLetras(wordRandom);

        expect(result).toEqual({});
    });
});

describe('Definir cor da letra do palpite (quadrados)', () => {

    test('deve adicionar a classe posicao-correta no quadrado quando a letra coincidir', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const wordRandom = "SABER";
        const palpite = "CARRO"
        const linhaAtual = 3;
        const objetoDeInsidencia = {"S": 1,"A": 1,"B": 1,"E": 1,"R": 1};
        const posicao = 16; //posicao = (3 * 5) + 1 = 16

        validarLetras(palpite, wordRandom, linhaAtual, objetoDeInsidencia,{});

        expect(quadrado[posicao].classList.contains('posicao-correta')).toBe(true);// classlist é um metodo de objeto
    });

    test('deve adicionar a classe posicao-errada no quadrado quando a letra estiver na posição errada', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const wordRandom = "SABER";
        const palpite = "CARRO"
        const linhaAtual = 3;
        const objetoDeInsidencia = {"S": 1,"A": 1,"B": 1,"E": 1,"R": 1};
        const posicao = 17; //posicao = (3 * 5) + 2 = 17

        validarLetras(palpite, wordRandom, linhaAtual, objetoDeInsidencia, {});

        expect(quadrado[posicao].classList.contains('posicao-errada')).toBe(true);// classlist é um metodo de objeto
    });

    test('deve adicionar a classe letra-ausente no quadrado quando a letra não existir na palavra sorteada', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const wordRandom = "SABER";
        const palpite = "CARRO"
        const linhaAtual = 3;
        const objetoDeInsidencia = {"S": 1,"A": 1,"B": 1,"E": 1,"R": 1};
        const posicao = 19; //posicao = (3 * 5) + 4 = 19

        validarLetras(palpite, wordRandom, linhaAtual, objetoDeInsidencia, {});

        expect(quadrado[posicao].classList.contains('letra-ausente')).toBe(true);// classlist é um metodo de objeto
    });  
});

describe('Definir cor dos butons do teclado virtual', () => {
    test('deve adcionar a classe posicao-correta no button', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const wordRandom = "SABER";
        const palpite = "CARRO"
        const linhaAtual = 3;
        const objetoDeInsidencia = {"S": 1,"A": 1,"B": 1,"E": 1,"R": 1};

        const objButtons = {
            "C": makeButon(),
            "A": makeButon()
        }

        validarLetras(palpite, wordRandom, linhaAtual, objetoDeInsidencia, objButtons);

        expect(objButtons["A"].classList.contains('posicao-correta')).toBe(true);// verifica se a classe existe no button
    });

    test('deve adcionar a classe posicao-errada no button', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const wordRandom = "SABER";
        const palpite = "CARRO"
        const linhaAtual = 3;
        const objetoDeInsidencia = {"S": 1,"A": 1,"B": 1,"E": 1,"R": 1};

        const objButtons = {
            "A": makeButon(),
            "R": makeButon()
        }

        validarLetras(palpite, wordRandom, linhaAtual, objetoDeInsidencia, objButtons);

        expect(objButtons["R"].classList.contains('posicao-errada')).toBe(true);
    });

    test('deve adcionar a classe letra-ausente no button', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const wordRandom = "SABER";
        const palpite = "CARRO"
        const linhaAtual = 3;
        const objetoDeInsidencia = {"S": 1,"A": 1,"B": 1,"E": 1,"R": 1};

        const objButtons = {
            "R": makeButon(),
            "O": makeButon()
        }

        validarLetras(palpite, wordRandom, linhaAtual, objetoDeInsidencia, objButtons);

        expect(objButtons["O"].classList.contains('letra-ausente')).toBe(true);
    });

    test('deve atualizar a cor da primeira tentativa (posicao errada) quando a proxima for posicao correta', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const wordRandom = "FOLHA";
        const primeiroPalpite = "FAZER";
        let linhaAtual = 0;
        let objetoDeInsidencia = {"F": 1,"O": 1,"L": 1,"H": 1,"A": 1};

        let objButtons = {
            "F": makeButon(),
            "A": makeButon()
        }

        validarLetras(primeiroPalpite, wordRandom, linhaAtual, objetoDeInsidencia, objButtons);

        const segundoPalpite = "TENTA";
        linhaAtual = 1;
        objetoDeInsidencia = {"F": 1,"O": 1,"L": 1,"H": 1,"A": 1};
        
        validarLetras(segundoPalpite, wordRandom, linhaAtual, objetoDeInsidencia, objButtons);

        expect(objButtons["A"].classList.contains('posicao-errada')).toBe(false)
        expect(objButtons["A"].classList.contains('posicao-correta')).toBe(true)
    });

    test('não deve sobreescrever classes diferentes de (posicao-correta) no butão quando a letra não estiver na posicão correta', () => {
        const quadrado = document.querySelectorAll('.quadrado');

        const wordRandom = "PIANO";
        const primeiroPalpite = "LIVRO";
        let linhaAtual = 0;
        let objetoDeInsidencia = {"P": 1,"I": 1,"A": 1,"N": 1,"O": 1};

        let objButtons = {
            "L": makeButon(),
            "O": makeButon()
        }

        validarLetras(primeiroPalpite, wordRandom, linhaAtual, objetoDeInsidencia, objButtons);

        const segundoPalpite = "FOLHA";
        linhaAtual = 1;
        objetoDeInsidencia = {"P": 1,"I": 1,"A": 1,"N": 1,"O": 1};
        
        validarLetras(segundoPalpite, wordRandom, linhaAtual, objetoDeInsidencia, objButtons);

        expect(objButtons["O"].classList.contains('posicao-errada')).toBe(false);
        expect(objButtons["O"].classList.contains('posicao-correta')).toBe(true);
    });
});
