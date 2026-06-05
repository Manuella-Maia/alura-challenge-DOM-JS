// Mock antes do require
global.fetch = jest.fn((url) => {
    if (url === './resources/assets/json/dataWords.json') {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                words: ['teste', 'saber']
            })
        });
    }

    if (url === './resources/assets/json/acceptedWords.json') {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                acceptedWords: ['teste', 'saber', 'abate', 'carta', 'livro']
            })
        });
    }

    return Promise.reject(new Error(`URL não mockada: ${url}`));
});

const { loadWords, loadAcceptedWords } = require('../resources/script/app.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Teste da função loadWords', () => {

    test('deve retornar a lista de palavras do arquivo JSON', async () => {
        const result = await loadWords();
        expect(result).toEqual(['teste', 'saber'])// toEqual iguinora a diferença de endereço/local dos array/objeto
        expect(global.fetch).toHaveBeenCalled();
    })
});

describe('Teste da função loadAcceptedWords', () => {
    
    test('deve retornar a lista de palavras aceitas do arquivo JSON', async () => {
        const result = await loadAcceptedWords();
        expect(result).toEqual(['teste', 'saber', 'abate', 'carta', 'livro']);
        expect(global.fetch).toHaveBeenCalled();
    })
});
