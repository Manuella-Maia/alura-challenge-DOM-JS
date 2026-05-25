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








## resolvido Bug — atualização de cor do teclado

Se uma letra for marcada como **amarela** (posição errada) em uma tentativa e na tentativa seguinte aparecer na **posição correta**, o botão do teclado deve ser atualizado de amarelo para **verde**.

Atualmente o teclado não sobrescreve a cor anterior, então a letra fica amarela mesmo quando já foi confirmada na posição correta.

Problema identificado

O classList do DOM acumula classes sem remover as anteriores. Após dois palpites, o botão ficava com as duas classes simultaneamente:
['posicao-errada', 'posicao-correta']

Por que o amarelo vencia ? 

Quando um elemento tem duas classes conflitantes na mesma propriedade (background-color), o CSS aplica a que foi declarada por último no arquivo. Como posicao-errada estava declarada depois de posicao-correta no style.css, o amarelo sobrescrevia o verde — não por especificidade, mas por ordem de cascata.

Correção em validarLetras:

No loop de letras verdes, antes de adicionar posicao-correta ao botão, as classes anteriores são removidas:

javascriptobjButtons[letraPalpite].classList.remove('posicao-errada');
objButtons[letraPalpite].classList.remove('letra-ausente');
objButtons[letraPalpite].classList.add('posicao-correta');

Nos loops de amarelo e cinza, uma guarda impede sobrescrever um botão já verde:

javascriptif(objButtons[letraPalpite] && !objButtons[letraPalpite].classList.contains('posicao-correta'))

Por que o teste passava mesmo com o bug ? 

O mock original só tinha add: jest.fn(). O toHaveBeenCalledWith('posicao-correta') verificava se a chamada existiu em algum momento no histórico — e existia — mas não verificava o estado final do botão. As duas classes estavam acumuladas e o teste não sabia disso.

A solução foi criar um mock com Set nativo para simular o estado real do classList, permitindo verificar com contains se a classe correta estava presente e a incorreta havia sido removida.

