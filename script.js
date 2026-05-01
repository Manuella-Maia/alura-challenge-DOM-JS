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
const randomlyWord = (words) => {

    if(!words || words.length === 0) return null
 
    const number = Math.random() // sorteia um numero entre 0 e 1 (valor quebrado)

    const indexRandom = Math.floor(number * words.length)

    // console.log('palavra da vez:', words[indexRandom])

    return words[indexRandom]
}

// --- Notificações ---
const showSuccess = (msg) => {
    Toastify({
        text: msg,
        duration: -1,       // ms até sumir (-1 para não sumir)
        gravity: "top",       // "top" | "bottom"
        position: "center",    // "left" | "center" | "right"
        stopOnFocus: true,
        close: true,
        style: {
            background: "#538D4E",
        },
    }).showToast();
}

const showError = (msg) => {
    Toastify({
        text: msg,
        duration: 4000,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        close: true,
        style: {
            background: "#BA4747",
        },
    }).showToast();
}

const showInfo = (msg) => {
    Toastify({
        text: msg,
        duration: 4000,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        close: true,
        style: {
            background: "#B59F3B",
        },
    }).showToast();
}

//--- Funções do DOM ---
const adcionarLetra = (tecla,posicao) => {
    const quadrado = document.querySelectorAll('.quadrado');
    quadrado[posicao].textContent = tecla;
};

const apagarLetra = (posicao) => {
    // if(posicao < 0) throw new Error('Possição inválida ! o index da letra deve ser maior que 0');
    if(posicao < 0) return

    const quadrado = document.querySelectorAll('.quadrado');
    quadrado[posicao].textContent = "";
}

const montarPalpite = (linhaAtual) => {
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

const contarInsidenciaLetras = (palavraRandomica) => {

    if(palavraRandomica.length === 0) return {}

    const objetoDeInsidencia = {};// vai armazenar a qdt de cada letra na palavra 

    for(let i = 0; i < palavraRandomica.length; i++){
        const letraAtual = palavraRandomica[i];
        
        if(objetoDeInsidencia[letraAtual] !== undefined){
            objetoDeInsidencia[letraAtual]++;
        }else{
            objetoDeInsidencia[letraAtual] = 1;
        };
    };

    return objetoDeInsidencia;
};

const validarLetras = (palpite, palavraRandomica, linhaAtual, objetoDeInsidencia) => {
    const quadrado = document.querySelectorAll('.quadrado');
    
    // --- Loop para validar letras VERDES ---
    for(let i = 0; i < 5; i++){
        const letraPalpite = palpite[i];
        const posicaoNoDOM = (linhaAtual * 5) + i;
        
        if(letraPalpite === palavraRandomica[i]){
            quadrado[posicaoNoDOM].classList.add('posicao-correta');
            objetoDeInsidencia[letraPalpite]--;
        }
    }

    // --- Loop para validar letras AMARELAS ou CINZAS ---
    for(let i = 0; i < 5; i++){
        const letraPalpite = palpite[i];
        const posicaoNoDOM = (linhaAtual * 5) + i;

        if(letraPalpite === palavraRandomica[i]) continue;// pula as letras já marcadas como verdes
        
       if(objetoDeInsidencia[letraPalpite] !== undefined && objetoDeInsidencia[letraPalpite] > 0){//corrigir para não pintar letras repetidas na mesma posição so se outver
            quadrado[posicaoNoDOM].classList.add('posicao-errada');
            objetoDeInsidencia[letraPalpite]--;

        }else{
            quadrado[posicaoNoDOM].classList.add('letra-ausente');
        }
    }
}

const handleKeyDown = (tecla,estado) => {
    let {linhaAtual, indexLetra, palavraDaVez} = estado;

    if(tecla.length === 1 && tecla >= "A" && tecla <= "Z"){
            if(indexLetra < 5){
                const posicaoTabuleiro = (linhaAtual * 5) + indexLetra;
                adcionarLetra(tecla,posicaoTabuleiro);
                indexLetra++;
            }else{
                showInfo(NOTIFICACAO_LIMITE_LETRAS_POR_LINHA_ATINGIDO)
            }
        }else if(tecla === 'BACKSPACE'){// ação do butão de apagar === "APAGAR" ||
            if(indexLetra > 0){
                indexLetra--;
                const posicaoTabuleiro = (linhaAtual * 5) + indexLetra;
                apagarLetra(posicaoTabuleiro);
            }else{
                showInfo(NOTIFICACAO_BACKSPACE_PALPITE_VAZIO);
            }
        }else if(tecla === "ENTER"){
            if(indexLetra === 5){
                const palpiteGerado = montarPalpite(linhaAtual);
                const obejto = contarInsidenciaLetras(palavraDaVez);

                validarLetras(palpiteGerado, palavraDaVez, linhaAtual,obejto);

                if(palpiteGerado === palavraDaVez){
                    // alert("Parabéns! Você acertou!");
                    showSuccess(NOTIFICACAO_FIM_DE_JOGO_ACERTO)
                }else{
                    linhaAtual++; 
                    indexLetra = 0;

                    if(linhaAtual === 6){
                        // alert(`Fim do jogo ! A palavra era: ${palavraDaVez}`);
                        showError(`Fim do jogo ! A palavra era: ${palavraDaVez}`)
                    }
                }
            }else{
                showInfo(NOTIFICACAO_PALPITE_INCOMPLETO);
            }
        }else{
            showInfo(NOTIFICACAO_TECLA_INVALIDA);
        }

    return {linhaAtual, indexLetra, palavraDaVez}
}

const NOTIFICACAO_TECLA_BACKSPACE_PRESSIONADA = 'Tecla Backspace pressionada'
const NOTIFICACAO_TECLA_ENTER_PRESSIONADA = 'Tecla Enter pressionada'
const NOTIFICACAO_TECLA_INVALIDA = 'Tecla pressionada inválida'

const NOTIFICACAO_BACKSPACE_PALPITE_VAZIO = 'Não é possível apagar um palpite vazio'

const NOTIFICACAO_PALPITE_VAZIO = 'Palpite vazio'
const NOTIFICACAO_PALPITE_INCOMPLETO = 'Palpite incompleto'


const NOTIFICACAO_LIMITE_TENTATIVAS_ATINGIDO = 'Limite máximo de tentativas atingido'
const NOTIFICACAO_LIMITE_LETRAS_POR_LINHA_ATINGIDO = 'Limite máximo de letras por linha atingido'

const NOTIFICACAO_FIM_DE_JOGO_ACERTO = 'Você acertou! Fim de jogo!'
// const NOTIFICACAO_FIM_DE_JOGO_ERRO = `Fim do jogo ! A palavra era: ${palavraDaVez}`


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
    module.exports = { loadWords, randomlyWord, adcionarLetra, 
        apagarLetra, handleKeyDown, contarInsidenciaLetras, validarLetras, 
        showSuccess, showError, showInfo};
}else{
    init();
}