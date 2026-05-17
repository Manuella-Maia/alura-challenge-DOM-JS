### HTML
2. Tabuleiro gerado manualmente
Você escreveu 30 <div class="quadrado"> à mão. Conceito: geração dinâmica de DOM via JavaScript — você poderia gerar o tabuleiro com um loop no init(), deixando o HTML mais limpo e fácil de manter.


3. Teclado gerado manualmente
Mesmo problema. As letras estão hardcoded no HTML. Conceito: renderização a partir de dados — um array com as letras do teclado e um loop que gera os botões dinamicamente.

### CSS
1. Reset incompleto
css*{
    margin: 0;
    padding: 0;
}
Funciona, mas é básico. Conceito: CSS Reset vs Normalize — o Reset zera tudo, o Normalize padroniza entre browsers sem zerar. O mais usado hoje é adicionar também box-sizing: border-box no reset, que faz o padding e border serem incluídos no tamanho do elemento em vez de aumentá-lo.


3. Responsividade ausente
O layout quebra em telas menores. Conceito: Media Queries — permitem aplicar estilos diferentes dependendo do tamanho da tela. É o fundamento do design responsivo.


### JavaScript
1. querySelectorAll repetido dentro das funções
jsconst quadrado = document.querySelectorAll('.quadrado');
Você chama isso dentro de adcionarLetra, apagarLetra, montarPalpite e validarLetras. Conceito: cache de elementos DOM — buscar elementos do DOM tem custo. O ideal é buscar uma vez no init() e passar como parâmetro ou guardar numa variável compartilhada.

2. contarInsidenciaLetras pode usar reduce
Seu loop manual funciona, mas conceito: métodos de array funcionais — reduce foi feito exatamente para transformar um array em um único valor acumulado, como um objeto de contagem. Vale estudar map, filter e reduce.
Para utilizar o reduce ou outro metodo de arry, voce deve 
converter a palavraRandomica em um array de caracteres

```
// para chamar

palavraRandomica.split("") ou palavraRandomica.split("").reduce...
const contarInsidenciaLetrasTeste = palavraRandomica.reduce((objetoDeInsidencia, letraAtual) => {
    if(objetoDeInsidencia[letraAtual] !== undefined){
        objetoDeInsidencia[letraAtual]++;
    }else{
        objetoDeInsidencia[letraAtual] = 1;
    };

    return objetoDeInsidencia;
}, {})

```
3. Manipulação de DOM dentro de handleKeyAction
js
document.querySelector('.areaButãoReset').classList.add('visible');
Você misturou lógica de jogo com manipulação de DOM na mesma função. Conceito: separação de responsabilidades — a função poderia apenas retornar o estado e quem cuida do DOM seria outra função, como o handleAction no init().

## arrumar a logica do status do quadrado:
- se a tentativa pintar como letra na posição errada (amarelo), na proxima vez que for na posição correta deve alterar no teclado 
para verde tambem. Atualizando amarelo -> verde.