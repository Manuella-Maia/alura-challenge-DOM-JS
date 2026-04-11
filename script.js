//--- Fetch API: leitura do arquivo json e retorno do array de palavras ---
const loadWords = async () => {
    try {
        const req = await fetch('./json/dataWords.json')

        if(!req.ok){
            throw new Error('Erro ao acessar API de palavras')
        }

        const dados = await req.json()

        return dados.words
    } catch (error) {
        console.error('Erro interno na requisição da API:',error)
        return [];
    }
}

//--- Sorteio da palavra---
const randomlyWord = function(words){

    if(!words || words.length === 0) return null
 
    const number = Math.random() // sorteia um numero entre 0 e 1 (valor quebrado)

    const indexRandom = Math.floor(number * words.length)

    return words[indexRandom]
}


const tabuleiro = document.querySelector('.tabuleiro');
const linha = document.querySelector('.linha');
const quadrado = document.querySelectorAll('.quadrado');

const teclado = document.querySelector('.teclado');
const linhaTeclado = document.querySelector('.linha-teclado');
const teclaTeclado = document.querySelector('.quadrado-teclado');

let linhaAtual = 0;
let indexLetra = 0;
let palavraDaVez = "";


loadWords().then(words => {
    palavraDaVez = randomlyWord(words).toLocaleUpperCase()
})

//passar a palavra sorteada para toUperCase()

document.addEventListener('keydown', (event) => {
    const tecla = event.key.toLocaleUpperCase() // pega qual foi a tecla prescionada

    if(tecla.length === 1 && tecla >= "A" && tecla <= "Z"){
        //chama função de adcionar letra
        if(indexLetra < 5){

            const posicaoTabuleiro = (linhaAtual * 5) + indexLetra
            adcionarLetra(tecla,posicaoTabuleiro)
            indexLetra++
        }
    }else if(tecla === 'BACKSPACE'){// ação do butão de apagar === "APAGAR" ||
        //caham função de apagar
        if(indexLetra > 0){
            indexLetra--
            const posicaoTabuleiro = (linhaAtual * 5) + indexLetra
            apagarLetra(posicaoTabuleiro)
        }
    }else if(tecla === "ENTER"){
        if(indexLetra === 5){
            const palpiteGerado = montarPalpite()

            validarLetras(palpiteGerado,palavraDaVez)

            if(palpiteGerado === palavraDaVez){
                alert("Parabéns! Você acertou!");

            }else{
                linhaAtual++; 
                indexLetra = 0;

                if(linhaAtual === 6){
                    alert('Fim do jogo ! A palavra era: ',palavraDaVez)
                }
            }
            
        }
    }
})

const adcionarLetra = function(tecla,posicao){
    quadrado[posicao].textContent = tecla
}

const apagarLetra = function(posicao){
    quadrado[posicao].textContent = ""
}

const montarPalpite = function(){
    let palpite = ""
    let inicioDaLinha = linhaAtual * 5

    // O loop começa no primeiro quadrado da linha
    // E vai até o quinto quadrado dessa mesma linha
    for(let i = 0; i < 5; i++){
        const letra = quadrado[inicioDaLinha + i].textContent// qual linha esta + posição da letra na linha
        palpite += letra
    }

    console.log("Palavra montada:", palpite);

    return palpite;
}

const validarLetras =  function(palpite, palavraRandomica){
    for(let i = 0; i < 5; i++){

        const letraPalpite = palpite[i];
        const letraCorreta = palavraRandomica[i];
        const posicaoNoDOM = (linhaAtual * 5) + i;

        if(letraPalpite === letraCorreta){

            quadrado[posicaoNoDOM].classList.add('posicao-correta')

        }else if(palavraRandomica.includes(letraPalpite)){

             quadrado[posicaoNoDOM].classList.add('posicao-errada')

        }else{
            quadrado[posicaoNoDOM].classList.add('nao-existe')
        }
    }
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadWords, randomlyWord };
}

// implementar testes de unidade para a logica do DOM