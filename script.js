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

//--- Teste do Fetch API ---
// const testLoadWords =  async () => {
//     try {
//         const dados = await loadWords()
//         console.log(dados)

//     } catch (error) {
//         console.error('Erro interno no teste da requisição da API:',error)
//         return 
//     }
// }

// testLoadWords()

//--- Sorteio da palavra---
const randomlyWord = function(words){

    if(!words || words.length === 0) return null
 
    const number = Math.random() // sorteia um numero entre 0 e 1 (valor quebrado)

    const indexRandom = Math.floor(number * words.length)

    return words[indexRandom]
}

//--- Teste de intervalo do sorteio ---
// const testRandomlyWord = function () {

//         const listFake = ['TESTE', 'SABER', 'LIVRO'];
//         const result = randomlyWord(listFake)

//         if(!listFake.includes(result)){
//             console.error('Não passou no teste')
//             return
//         }
//         console.log('Passou no teste:',result)

// }

// testRandomlyWord()

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadWords, randomlyWord };
}