# Melhorias — Termo Game

## HTML

### Tabuleiro gerado manualmente

Atualmente os 30 `<div class="quadrado">` estão escritos à mão no HTML.

**Conceito: geração dinâmica de DOM via JavaScript** — gerar o tabuleiro com um loop no `init()` deixa o HTML mais limpo e fácil de manter. Se o número de linhas ou colunas mudar, basta alterar uma variável.

---

### Teclado gerado manualmente

As letras do teclado estão hardcoded no HTML.

**Conceito: renderização a partir de dados** — um array com as letras do teclado e um loop que gera os botões dinamicamente. Assim o HTML não precisa saber nada sobre o teclado.

---

## CSS

### Reset incompleto

```css
* {
    margin: 0;
    padding: 0;
}
```

Funciona, mas é básico.

**Conceito: CSS Reset vs Normalize**
- **Reset** — zera tudo, parte do zero
- **Normalize** — padroniza entre browsers sem zerar

O mais usado hoje é adicionar também o `box-sizing: border-box`, que faz o `padding` e `border` serem incluídos no tamanho do elemento em vez de aumentá-lo:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

---

### Responsividade ausente

O layout quebra em telas menores.

**Conceito: Media Queries** — permitem aplicar estilos diferentes dependendo do tamanho da tela. É o fundamento do design responsivo.

```css
@media (max-width: 480px) {
    /* estilos para telas menores */
}
```

---

## JavaScript

### querySelectorAll repetido dentro das funções

```js
const quadrado = document.querySelectorAll('.quadrado');
```

Essa linha é chamada dentro de `adcionarLetra`, `apagarLetra`, `montarPalpite` e `validarLetras`.

**Conceito: cache de elementos DOM** — buscar elementos do DOM tem custo de performance. O ideal é buscar uma vez no `init()` e passar como parâmetro ou guardar numa variável compartilhada.

---

### contarInsidenciaLetras pode usar reduce

O loop manual funciona, mas existe uma forma mais idiomática.

**Conceito: métodos de array funcionais** — `reduce` foi feito exatamente para transformar um array em um único valor acumulado, como um objeto de contagem. Vale estudar `map`, `filter` e `reduce`.

**Atenção:** como a função recebe uma string (`palavraRandomica`), é necessário convertê-la em array antes com `split('')`:

```js
palavraRandomica.split('') // ['C', 'A', 'S', 'A', 'R']

// Com reduce:
const contarInsidenciaLetras = palavraRandomica.split('').reduce((objetoDeInsidencia, letraAtual) => {
    if(objetoDeInsidencia[letraAtual] !== undefined){
        objetoDeInsidencia[letraAtual]++;
    }else{
        objetoDeInsidencia[letraAtual] = 1;
    }
    return objetoDeInsidencia;
}, {})
```

---

### Manipulação de DOM dentro de handleKeyAction

```js
document.querySelector('.areaButãoReset').classList.add('visible');
```

A lógica de jogo e a manipulação de DOM estão misturadas na mesma função.

**Conceito: separação de responsabilidades** — o `handleKeyAction` deveria apenas retornar o estado. Quem cuida do DOM deveria ser outra função, como o `handleAction` dentro do `init()`.

---

## Bug — atualização de cor do teclado

Se uma letra for marcada como **amarela** (posição errada) em uma tentativa e na tentativa seguinte aparecer na **posição correta**, o botão do teclado deve ser atualizado de amarelo para **verde**.

Atualmente o teclado não sobrescreve a cor anterior, então a letra fica amarela mesmo quando já foi confirmada na posição correta.

Realizar verificação em validarpalpite
para não sobreescrever uma classe depois de posicao-correta ser adcionada.

Verificar o problema do teste passar.