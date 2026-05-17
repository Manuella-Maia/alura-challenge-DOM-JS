# Anotações do Projeto — Termo Game

## Testes com Jest

### Estrutura básica

O Jest injeta automaticamente no ambiente funções como `describe` e `test`, então não é necessário importá-las. Importamos apenas as funções que queremos testar.

```js
const { loadWords, randomlyWord } = require('../script.js');
```

---

### describe

Agrupador de testes. Funciona como uma "pasta" que organiza todos os testes relacionados a uma mesma funcionalidade.

```js
describe('Teste da função randomlyWord', () => {
    // testes aqui dentro
});
```

---

### test (ou it)

Define uma unidade de comportamento a ser testada. O primeiro argumento é uma string descrevendo o que o teste garante.

```js
test('deve retornar uma palavra que pertence à lista enviada', () => {
    // ...
});
```

---

### Estrutura interna de um teste — AAA

| Etapa | Nome | O que faz |
|-------|------|-----------|
| 1 | **Setup** | Prepara os dados fictícios (Mocks) |
| 2 | **Action** | Chama a função real que será testada |
| 3 | **Expect** | Compara o resultado com o esperado |

```js
test('deve retornar uma palavra que pertence à lista enviada', () => {

    // 1. Setup — dados fictícios
    const listFake = ['TESTE', 'SABER', 'LIVRO'];

    // 2. Action — chama a função real
    const result = randomlyWord(listFake);

    // 3. Expect — asserção
    expect(listFake).toContain(result);
});
```

---

### Matchers

Métodos de comparação usados dentro do `expect`.

| Matcher | O que verifica |
|---------|---------------|
| `toContain(value)` | Se o item existe dentro do array |
| `toBeNull()` | Se o valor é estritamente `null` |
| `toBe(value)` | Se o valor é estritamente igual |
| `toBeUndefined()` | Se o valor é `undefined` |

```js
// toContain — verifica se a palavra retornada pertence à lista
expect(listFake).toContain(result);

// toBeNull — garante que a função retorna null para lista vazia
expect(result).toBeNull();
```

> **Por que isso importa?** Garantir que a função retorna `null` para uma lista vazia evita que o sistema quebre caso o banco de dados (JSON) venha vazio.

---

### Leitura do expect

```js
expect(resultado).toContain(valorEsperado)
//     ^ o que     ^ comparador  ^ referência
//    foi gerado
```