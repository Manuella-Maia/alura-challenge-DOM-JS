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

//--- Funções Logica do jogo ---
const adcionarLetra = (tecla, posicao, button, objButtons) => {
    const quadrado = document.querySelectorAll('.quadrado');
    quadrado[posicao].textContent = tecla;

    if(button != null && button != undefined){
        objButtons[tecla] = button;
    }
};

const apagarLetra = (tecla, posicao, button, objButtons) => {
    // if(posicao < 0) throw new Error('Possição inválida ! o index da letra deve ser maior que 0');
    if(posicao < 0) return;

    const quadrado = document.querySelectorAll('.quadrado');
    quadrado[posicao].textContent = "";

    if(button){//null e undefined já são faly
        delete objButtons[tecla];//apaga chave-valor do objeto
    }
}

const montarPalpite = (linhaAtual) => {
    const quadrado = document.querySelectorAll('.quadrado');
    let palpite = "";
    let inicioDaLinha = linhaAtual * 5;
    //aqui entra a logica de descobrir os butoes clicados !

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

const validarLetras = (palpite, palavraRandomica, linhaAtual, objetoDeInsidencia, objButtons) => {
    const quadrado = document.querySelectorAll('.quadrado');
    
    // --- Loop para validar letras VERDES ---
    for(let i = 0; i < 5; i++){
        const letraPalpite = palpite[i];
        const posicaoNoDOM = (linhaAtual * 5) + i;
        
        if(letraPalpite === palavraRandomica[i]){
            quadrado[posicaoNoDOM].classList.add('posicao-correta');

            objetoDeInsidencia[letraPalpite]--;

            if(objButtons[letraPalpite]){
                objButtons[letraPalpite].classList.add('posicao-correta');
            }
            
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

            if(objButtons[letraPalpite]){
                objButtons[letraPalpite].classList.add('posicao-errada');
            }

        }else{
            quadrado[posicaoNoDOM].classList.add('letra-ausente');

            if(objButtons[letraPalpite]){
                objButtons[letraPalpite].classList.add('letra-ausente');
            }
        }
    }
}

// --- Funções do Dom ---

const handleKeyAction = (tecla,estado, objButtons, button) => {
    let {linhaAtual, indexLetra, palavraDaVez, jogoEncerrado} = estado;

    if(estado.jogoEncerrado) return estado;

    if(tecla.length === 1 && tecla >= "A" && tecla <= "Z"){
        if(indexLetra < 5){
            const posicaoTabuleiro = (linhaAtual * 5) + indexLetra;
            adcionarLetra(tecla, posicaoTabuleiro, button, objButtons);
            indexLetra++;
        }else{
            showInfo(NOTIFICACAO_LIMITE_LETRAS_POR_LINHA_ATINGIDO);
        };
    }else if(tecla === 'BACKSPACE'){
        if(indexLetra > 0){
            indexLetra--;
            const posicaoTabuleiro = (linhaAtual * 5) + indexLetra;
            apagarLetra(tecla, posicaoTabuleiro, button, objButtons);
        }else{
            showInfo(NOTIFICACAO_BACKSPACE_PALPITE_VAZIO);
        }
    }else if(tecla === 'ENTER'){
        if(indexLetra === 5){
            const palpiteGerado = montarPalpite(linhaAtual);
            const obejto = contarInsidenciaLetras(palavraDaVez);

            validarLetras(palpiteGerado, palavraDaVez, linhaAtual, obejto, objButtons);

            if(palpiteGerado === palavraDaVez){
                showSuccess(NOTIFICACAO_FIM_DE_JOGO_ACERTO);
                document.querySelector('.areaButãoReset').classList.add('visible');
                jogoEncerrado = true;
            }else{
                linhaAtual++; 
                indexLetra = 0;

                if(linhaAtual === 6){
                    showError(`Fim do jogo ! A palavra era: ${palavraDaVez}`);
                    document.querySelector('.areaButãoReset').classList.add('visible');
                    jogoEncerrado = true;
                };
            };
        }else{
            showInfo(NOTIFICACAO_PALPITE_INCOMPLETO);
        }
    }else{
        showInfo(NOTIFICACAO_TECLA_INVALIDA);
    }
    return {linhaAtual, indexLetra, palavraDaVez, jogoEncerrado};
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


const init = async () => {
    const words = await loadWords();

    let estadoAtual = {
        linhaAtual: 0,
        indexLetra: 0,
        palavraDaVez: randomlyWord(words).toLocaleUpperCase(),
        jogoEncerrado: false,
    }

    let buttons = {};

    const keyboard = document.querySelector('.teclado');
    const btnReset = document.querySelector('.bntReset');

    document.addEventListener('keydown', handleAction);
    keyboard.addEventListener('click', handleAction);
    btnReset.addEventListener('click', manipulateActionReset);


    function handleAction(event) {

        if(event.type === 'keydown'){
            const tecla = event.key.toLocaleUpperCase();// pega qual foi a tecla prescionada
            const button = document.querySelector(`[value = ${tecla}]`);//relaciona a tecla prescionada com o butão respectivo
            estadoAtual = handleKeyAction(tecla, estadoAtual, buttons, button);// ← chama e salva o estado novo
        }

        if(event.type === 'click'){
            if(!event.target.value) return;

            const tecla = event.target.value.toLocaleUpperCase();// pega qual foi a tecla prescionada
            const button = event.target;
            estadoAtual = handleKeyAction(tecla,estadoAtual, buttons, button);// ← chama e salva o estado novo
        }
    }

    function manipulateActionReset(){
        location.reload();
    }
}

// Só inicializa no browser, nunca no Jest
if (typeof module !== 'undefined' && module.exports) {// atualizar handleKeyDown para handleKeyAction
    module.exports = { loadWords, randomlyWord, adcionarLetra, 
        apagarLetra, handleKeyAction, contarInsidenciaLetras, validarLetras, 
        showSuccess, showError, showInfo
    };
}else{
    init();
}