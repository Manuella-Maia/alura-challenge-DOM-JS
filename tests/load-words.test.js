// Mock antes do require
global.fetch = jest.fn(() => 
    Promise.resolve({
        ok:true, // Simula o status 200
        json: () => Promise.resolve({words:['TESTE', 'SABER']}),
    })
);

const { loadWords } = require('../resources/script/app.js');


describe('Teste da função loadWords', () => {

    test('deve retornar a lista de palavras do arquivo JSON', async () => {
        const result = await loadWords();
        expect(result).toEqual(['TESTE', 'SABER'])// toEqual iguinora a diferença de endereço/local dos array/objeto
        expect(global.fetch).toHaveBeenCalled();
    })
});
