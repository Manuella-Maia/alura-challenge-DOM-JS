# 🧪 Documentação de Testes - Wordle Challenge

Este documento detalha a estrutura de testes unitários implementada no projeto utilizando o **Jest**. O objetivo é garantir que o motor do jogo (carregamento de dados e sorteio) funcione de forma isolada e segura.

---

## 🛠️ Comandos do Terminal

| Objetivo | Comando |
| :--- | :--- |
| **Executar todos os testes** | `npm test` |
| **Relatório detalhado (Verbose)** | `npm test -- --verbose` |
| **Limpar cache do Jest** | `npm test -- --clearCache` |
| **Modo Observador (Watch)** | `npx jest --watchAll` |

---

## 🏗️ Configurações de Módulos

Atualmente, o projeto utiliza o padrão **ES Modules (ESM)** para permitir o uso de `import` e `export`.

### 1. Configuração no `package.json`
Para que o Jest suporte a sintaxe moderna, a configuração deve ser:
```json
{
  "type": "module",
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  }
}
```

## 2. Exportação no script.js
As funções devem ser exportadas individualmente:

JavaScript
export const loadWords = async () => { ... };
export const randomlyWord = (words) => { ... };

import { jest } from '@jest/globals';

Caso opte por não usar type: module, a configuração muda para:

Exportar: module.exports = { loadWords, randomlyWord };

Importar: const { loadWords, randomlyWord } = require('../script.js');

# Rodar apenas testes de sorteio
npx jest tests/randomly-one-Word.test.js

# Rodar apenas testes de API
npx jest tests/load-words.test.js