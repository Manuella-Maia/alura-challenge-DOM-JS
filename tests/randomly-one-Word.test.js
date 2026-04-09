const { randomlyWord } = require('../script.js');

describe('Teste da função randomlyWord', () => {

    test('deve retornar uma palavra que pertence à lista enviada', () => {
        const listFake = ['TESTE', 'SABER', 'LIVRO'];
        const result = randomlyWord(listFake);

        expect(listFake).toContain(result) // espera-se que
    });

    test('deve retornar null se a lista estiver vazia', () => {
        const result = randomlyWord([])// recebe uma lista vazia
        expect(result).toBeNull();
    });
});