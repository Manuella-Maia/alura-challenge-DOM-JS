const NOTIFICACAO_TECLA_INVALIDA = 'Tecla pressionada inválida';
const NOTIFICACAO_BACKSPACE_PALPITE_VAZIO = 'Não é possível apagar um palpite vazio';
const NOTIFICACAO_PALPITE_VAZIO = 'Palpite vazio';
const NOTIFICACAO_PALPITE_INCOMPLETO = 'Palpite incompleto';
const NOTIFICACAO_PALPITE_INVALIDO = 'Palavra inválida';//colocar frase do figma
const NOTIFICACAO_LIMITE_TENTATIVAS_ATINGIDO = 'Limite máximo de tentativas atingido';
const NOTIFICACAO_LIMITE_LETRAS_POR_LINHA_ATINGIDO = 'Limite máximo de letras por linha atingido';
const NOTIFICACAO_FIM_DE_JOGO_ACERTO = 'Você acertou! Fim de jogo !';

const getElements = () => ({
    quadrado: document.querySelectorAll('.quadrado'),
    teclado: document.querySelector('.teclado'),
    btnReset: document.querySelector('.bntReset'),
    areaReset: document.querySelector('.area-butao-reset')
})

//--- Fetch API: leitura do arquivo json e retorno do array de palavras ---
const loadWords = async () => {
    try {
        const req = await fetch('./resources/assets/json/dataWords.json');

        if(!req.ok) throw new Error('Erro ao acessar API de palavras');
        
        const dados = await req.json();

        return dados.words;

    } catch (error) {
        console.error('Erro interno na requisição da API:',error);
        return [];
    }
}

const loadAcceptedWords = async () => {
    try {
        const req = await fetch('./resources/assets/json/acceptedWords.json');

        if(!req.ok) throw new Error('Erro ao acessar API de palavras aceitas');

        const dados = await req.json();

        return dados.acceptedWords;
        
    } catch (error) {
        console.error('Erro interno na requisição da API de palavras aceitas:',error);
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

// --- Funções relacionadas ao Reset do jogo ---
const manipulateVisibilityReset = (areaReset) => {
    areaReset.classList.add('visible');
    areaReset.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

const manipulateActionReset = () => {
    location.reload();
}

//--- Funções Logica do jogo ---
const adcionarLetra = (tecla, posicao, button, objButtons, quadrado) => {
    quadrado[posicao].textContent = tecla;

    if(button != null){
        objButtons[tecla] = button;
    }
};

const apagarLetra = (tecla, posicao, button, objButtons, quadrado) => {
    if(posicao < 0) return;

    quadrado[posicao].textContent = "";

    if(button){//null e undefined já são faly
        delete objButtons[tecla];//apaga chave-valor do objeto
    }
}

const montarPalpite = (linhaAtual, quadrado) => {
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

const validarPalpite = (palpite, listaPalavrasAceitas ) => {
    const result = listaPalavrasAceitas.includes(palpite.toLowerCase());

    return result;
}

const contarInsidenciaLetras = (palavraRandomica) => {
    if(palavraRandomica.length === 0) return {};

    const objetoDeInsidencia = {};// vai armazenar a qdt de cada letra na palavra 

    for(let i = 0; i < palavraRandomica.length; i++){
        const letraAtual = palavraRandomica[i];
        
        if(objetoDeInsidencia[letraAtual] !== undefined){
            objetoDeInsidencia[letraAtual]++;
        }else{
            objetoDeInsidencia[letraAtual] = 1;
        }
    }

    return objetoDeInsidencia;
}

const validarLetras = (palpite, palavraRandomica, linhaAtual, objetoDeInsidencia, objButtons, quadrado) => {
    // --- Loop para validar letras VERDES ---
    for(let i = 0; i < 5; i++){
        const letraPalpite = palpite[i];
        const posicaoNoDOM = (linhaAtual * 5) + i;
        
        if(letraPalpite === palavraRandomica[i]){
            quadrado[posicaoNoDOM].classList.add('posicao-correta');

            objetoDeInsidencia[letraPalpite]--;

            if(objButtons[letraPalpite]){
                objButtons[letraPalpite].classList.remove('posicao-errada');
                objButtons[letraPalpite].classList.remove('letra-ausente');
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

            if(objButtons[letraPalpite] && !objButtons[letraPalpite].classList.contains('posicao-correta')){
                objButtons[letraPalpite].classList.add('posicao-errada');
            }

        }else{
            quadrado[posicaoNoDOM].classList.add('letra-ausente');

            if(objButtons[letraPalpite] && !objButtons[letraPalpite].classList.contains('posicao-correta')){
                objButtons[letraPalpite].classList.add('letra-ausente');
            }
        }
    }
}

// --- Funções do Dom ---

const handleKeyAction = (tecla, estado, objButtons, button, elements) => {
    let {linhaAtual, indexLetra, palavraDaVez, palavrasAceitas, jogoEncerrado} = estado;
    let { quadrado } = elements

    if(estado.jogoEncerrado) return estado;

    if(tecla.length === 1 && tecla >= "A" && tecla <= "Z"){
        if(indexLetra < 5){
            const posicaoTabuleiro = (linhaAtual * 5) + indexLetra;
            adcionarLetra(tecla, posicaoTabuleiro, button, objButtons, quadrado);
            indexLetra++;
        }else{
            showInfo(NOTIFICACAO_LIMITE_LETRAS_POR_LINHA_ATINGIDO);
        }
    }else if(tecla === 'BACKSPACE'){
        if(indexLetra > 0){
            indexLetra--;
            const posicaoTabuleiro = (linhaAtual * 5) + indexLetra;
            apagarLetra(tecla, posicaoTabuleiro, button, objButtons, quadrado);
        }else{
            showInfo(NOTIFICACAO_BACKSPACE_PALPITE_VAZIO);
        }
    }else if(tecla === 'ENTER'){
        if(indexLetra === 5){
            const palpiteGerado = montarPalpite(linhaAtual, quadrado);
            const palpiteValido = validarPalpite(palpiteGerado, palavrasAceitas);

            if(!palpiteValido){
                showInfo(NOTIFICACAO_PALPITE_INVALIDO);
                return estado;//devolve o estado sem incrementar a linhaAtual
            }

            const obejto = contarInsidenciaLetras(palavraDaVez);

            validarLetras(palpiteGerado, palavraDaVez, linhaAtual, obejto, objButtons, quadrado);

            if(palpiteGerado === palavraDaVez){
                showSuccess(NOTIFICACAO_FIM_DE_JOGO_ACERTO);
                jogoEncerrado = true;
            }else{
                linhaAtual++; 
                indexLetra = 0;

                if(linhaAtual === 6){//linha de indice 6 corresponde a 7ª linha que não existe
                    showError(`Fim do jogo ! A palavra era: ${palavraDaVez}`);
                    jogoEncerrado = true;
                };
            };
        }else{
            showInfo(NOTIFICACAO_PALPITE_INCOMPLETO);
        }
    }else{
        showInfo(NOTIFICACAO_TECLA_INVALIDA);
    }
    return {linhaAtual, indexLetra, palavraDaVez, palavrasAceitas, jogoEncerrado};
}

const init = async () => {
    const words = await loadWords();
    const acceptedWords = await loadAcceptedWords();

    let estadoAtual = {
        linhaAtual: 0,
        indexLetra: 0,
        palavraDaVez: randomlyWord(words).toLocaleUpperCase(),
        palavrasAceitas: acceptedWords,//array com as palavras aceitas
        jogoEncerrado: false,
        butaoVisivel: false
    }

    let buttons = {};

    let elementsDom = getElements();

    const keyboard = elementsDom.teclado;
    const btnReset = elementsDom.btnReset;

    document.addEventListener('keydown', handleAction);
    keyboard.addEventListener('click', handleAction);
    btnReset.addEventListener('click', manipulateActionReset);


    function handleAction(event) {

        if(event.type === 'keydown'){
            const tecla = event.key.toLocaleUpperCase();// pega qual foi a tecla prescionada
            const button = document.querySelector(`[value = ${tecla}]`);//relaciona a tecla prescionada com o butão respectivo
            estadoAtual = handleKeyAction(tecla, estadoAtual, buttons, button, elementsDom);// ← chama e salva o estado novo
        }

        if(event.type === 'click'){
            if(!event.target.value) return;

            const tecla = event.target.value.toLocaleUpperCase();// pega qual foi a tecla prescionada
            const button = event.target;
            estadoAtual = handleKeyAction(tecla,estadoAtual, buttons, button, elementsDom);// ← chama e salva o estado novo
        }

        if(estadoAtual.jogoEncerrado && !estadoAtual.butaoVisivel){
            manipulateVisibilityReset(elementsDom.areaReset);
            estadoAtual = {...estadoAtual, butaoVisivel: true};
        }
    }
}

// Só inicializa no browser, nunca no Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadWords, loadAcceptedWords, randomlyWord, adcionarLetra, 
        apagarLetra, handleKeyAction, contarInsidenciaLetras, validarLetras, validarPalpite, 
        showSuccess, showError, showInfo
    };
}else{
    init();
}