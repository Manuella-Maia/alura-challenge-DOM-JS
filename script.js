//--- Fetch API: leitura do arquivo json e retorno do array de palavras ---
const loadWords = async () => {
    try {
        const req = await fetch('./json/dataWords.json')

        if(!req.ok) throw new Error('Erro ao acessar API de palavras')
        
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

//--- Funções do DOM ---
const adcionarLetra = function(tecla,posicao){
    const quadrado = document.querySelectorAll('.quadrado');
    quadrado[posicao].textContent = tecla;
};

const apagarLetra = function(posicao){
    // if(posicao < 0) throw new Error('Possição inválida ! o index da letra deve ser maior que 0');
    if(posicao < 0) return

    const quadrado = document.querySelectorAll('.quadrado');
    quadrado[posicao].textContent = "";
}

const montarPalpite = function(linhaAtual){
    const quadrado = document.querySelectorAll('.quadrado');
    let palpite = "";
    let inicioDaLinha = linhaAtual * 5;

    // O loop começa no primeiro quadrado da linha
    // E vai até o quinto quadrado dessa mesma linha
    for(let i = 0; i < 5; i++){
        const letra = quadrado[inicioDaLinha + i].textContent// qual linha esta + posição da letra na linha
        palpite += letra;
    }

    return palpite;
}

const validarLetras =  function(palpite, palavraRandomica, linhaAtual){
    const quadrado = document.querySelectorAll('.quadrado');

    for(let i = 0; i < 5; i++){
        const letraPalpite = palpite[i];
        const letraCorreta = palavraRandomica[i];
        const posicaoNoDOM = (linhaAtual * 5) + i;

        if(letraPalpite === letraCorreta){

            quadrado[posicaoNoDOM].classList.add('posicao-correta');

        }else if(palavraRandomica.includes(letraPalpite)){

             quadrado[posicaoNoDOM].classList.add('posicao-errada');

        }else{
            quadrado[posicaoNoDOM].classList.add('nao-existe');
        }
    }
}

const handleKeyDown = function(tecla,estado){
    let {linhaAtual, indexLetra, palavraDaVez} = estado;

    if(tecla.length === 1 && tecla >= "A" && tecla <= "Z"){
            if(indexLetra < 5){
                const posicaoTabuleiro = (linhaAtual * 5) + indexLetra;
                adcionarLetra(tecla,posicaoTabuleiro);
                indexLetra++;
            }
        }else if(tecla === 'BACKSPACE'){// ação do butão de apagar === "APAGAR" ||
            if(indexLetra > 0){
                indexLetra--;
                const posicaoTabuleiro = (linhaAtual * 5) + indexLetra;
                apagarLetra(posicaoTabuleiro);
            }
        }else if(tecla === "ENTER"){
            if(indexLetra === 5){
                const palpiteGerado = montarPalpite(linhaAtual);
                validarLetras(palpiteGerado, palavraDaVez, linhaAtual);

                if(palpiteGerado === palavraDaVez){
                    alert("Parabéns! Você acertou!");
                }else{
                    linhaAtual++; 
                    indexLetra = 0;
                    if(linhaAtual === 6){
                        alert('Fim do jogo ! A palavra era: ',palavraDaVez);
                }
            }
        }
    }

    return {linhaAtual, indexLetra, palavraDaVez}
}


const init = async () => {
    const words = await loadWords();

    let estadoAtual = {
        linhaAtual: 0,
        indexLetra: 0,
        palavraDaVez: randomlyWord(words).toLocaleUpperCase(),
    };

    document.addEventListener('keydown', (event) => {
        const tecla = event.key.toLocaleUpperCase() // pega qual foi a tecla prescionada
        estadoAtual = handleKeyDown(tecla, estadoAtual)// ← chama e salva o estado novo
    })
}

// Só inicializa no browser, nunca no Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadWords, randomlyWord, adcionarLetra, apagarLetra, handleKeyDown};
}else{
    init();
}