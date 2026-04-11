const { randomlyWord } = require('../script.js');

describe('Pegar uma palavra aleatória', () => {

    test('deve retornar uma palavra que pertence à lista enviada', () => {
        const listFake = ['TESTE', 'SABER', 'LIVRO'];
        const result = randomlyWord(listFake);

        expect(listFake).toContain(result) // espera-se que
    });

    test('deve retornar null se a lista estiver vazia', () => {
        const result = randomlyWord([])// recebe uma lista vazia
        expect(result).toBeNull();
    });

    //--- testes com valores determinados ---

     afterEach(() => {// Limpa o mock do random global para os testes 
        jest.restoreAllMocks()
    })

    test('deve retornar a primeira palavra quando 0.4 for a resposta simulada', () => {
       jest.spyOn(global.Math, 'random').mockReturnValue(0.4);
       expect(randomlyWord(['TESTE', 'SABER'])).toBe('TESTE')
    })

    test('deve retornar a secunda palavra quando 0.5 for a resposta simulada', () => {
       jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
       expect(randomlyWord(['TESTE', 'SABER'])).toBe('SABER')
    })

    test('deve retornar a ultima palavra da lista com 4 elementos', () => {
       jest.spyOn(global.Math, 'random').mockReturnValue(0.8);
       expect(randomlyWord(['TESTE', 'SABER','LOGAR', 'COMER'])).toBe('COMER')
    })

    test('deve retornar a penultima palavra da lista com 4 elementos', () => {
       jest.spyOn(global.Math, 'random').mockReturnValue(0.7);
       expect(randomlyWord(['TESTE', 'SABER','LOGAR', 'COMER'])).toBe('LOGAR')
    })

});