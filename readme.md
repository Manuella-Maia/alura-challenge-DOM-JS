// No Jest, não precisamos importar 'describe' ou 'test', ele já injeta isso no ambiente.
// Importamos apenas as funções que queremos colocar à prova.
import { loadWords, randomlyWord } from '../script.js';

// DESCRIBE: É um agrupador. Imagine como uma "pasta" ou uma "suíte" de testes.

// Serve para organizar todos os testes relacionados a uma funcionalidade específica.

describe('Teste da função randomlyWord', () => {

    // TEST (ou IT): É o teste em si. É aqui que você define UMA unidade de comportamento.
    // O primeiro argumento é uma string explicando o que o teste deveria garantir.
    test('deve retornar uma palavra que pertence à lista enviada', () => {
        
        // 1. SETUP (Preparação): Criamos os dados fictícios (Mocks)
        const listFake = ['TESTE', 'SABER', 'LIVRO'];
        
        // 2. ACTION (Ação): Chamamos a função real que queremos testar
        const result = randomlyWord(listFake);

        // 3. EXPECT (Expectativa/Asserção): É o coração do teste.
        // Ele compara o resultado da função com o que você espera que aconteça.
        // toContain é um "Matcher" (comparador) que verifica se o item existe no array.
        expect(listFake).toContain(result); // referencia do que eu vou testar/observar, metodo de comparação e o valor retornado pelo teste
    });

    test('deve retornar null se a lista estiver vazia', () => {
        // Preparação e Ação em uma linha
        const result = randomlyWord([]); 
        
        // toBeNull é outro Matcher que verifica especificamente se o valor é 'null'
        // No Back-end, isso é ótimo para garantir que sua função não quebre o sistema
        // se o "banco de dados" (JSON) vier vazio.
        expect(result).toBeNull();
    });
});

# Rodar apenas testes de sorteio
npx jest tests/wordSelection.test.js

# Rodar apenas testes de API
npx jest tests/apiAccess.test.js