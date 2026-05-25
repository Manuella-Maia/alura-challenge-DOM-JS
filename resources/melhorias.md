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

### Responsividade ausente

O layout quebra em telas menores.

**Conceito: Media Queries** — permitem aplicar estilos diferentes dependendo do tamanho da tela. É o fundamento do design responsivo.

```css
@media (max-width: 480px) {
    /* estilos para telas menores */
}
```

---

### Modo claro e escuro
 
O jogo só possui tema escuro.
 
**Conceito: CSS Custom Properties + prefers-color-scheme** — usando as variáveis já definidas no `:root`, é possível redefini-las para um tema claro com uma media query ou via classe no `body`. O `prefers-color-scheme` detecta automaticamente a preferência do sistema operacional do usuário.

### Animações ausentes
 
O jogo não possui feedback visual animado ao revelar as letras.
 
**Conceito: CSS Animations e Transitions** — permitem animar mudanças de estado dos elementos. No Wordle original, os quadrados viram como cartas ao revelar a cor. Isso é feito com `@keyframes` e a propriedade `animation`.
 
 
## JavaScript

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








### Consumir API externa de palavras
 
Atualmente as palavras vêm de um arquivo JSON local.
 
**Conceito: integração com APIs REST** — consumir uma API que retorna listas de palavras em português tornaria o jogo mais dinâmico e com um vocabulário maior, sem necessidade de manter o JSON manualmente.