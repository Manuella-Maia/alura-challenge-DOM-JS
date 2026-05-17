//O Toastify no browser fica no window.Toastify. 
// No Jest (Node.js) não existe window, então ele usa global como substituto. 
// Sem o mock, o Jest jogaria Toastify is not defined.
//Ele precisa imitar essa estrutura: 
// Toastify({...})  →  retorna um objeto
// .showToast() →  esse objeto tem o método showToast

const {showSuccess, showInfo, showError} = require('../resources/script/app.js');

// --- Mock do Toastify ---

let mockShowToastify;

const mockToastify = () => {
    mockShowToastify = jest.fn();// espia o comportamento do showToast

    global.Toastify = jest.fn(() => ({// vai mostrar penas se a função está sendo chamada e não o que aparece na tela em si
        showToast: mockShowToastify//retorna objeto com showToast
    }));
};

const unMockToastfy = () => {//apaga a copia do toastfy e o historico de chamadas do showToast 
    delete global.Toastify;
    mockShowToastify = undefined;
};

// --- Testes ---

describe('Exibicao de notificacoes de acordo com a acao do usuario', () => {

    beforeEach(() => {// primeira parte que o jest lê
        mockToastify();// chma a função que vai criar a copia da estrutura do toastfy com showToast
    });

    afterEach(() => {//ultima parte que o jest lê após um teste
        unMockToastfy();// chama a função que vai "resetar o toastfy global e as chamadas ao showToast"
    });

    describe('showSuccess', () => {
        test('showSuccess deve chamar .toastfy()', () => {
        showSuccess('Você acertou!');

        expect(mockShowToastify).toHaveBeenCalled();
    })

        test('showSuccess deve chamar Toastfy com a mensagem correta', () => {
            showSuccess('Você acertou! Fim de jogo!');

            expect(global.Toastify).toHaveBeenCalled();//verifica se Toastf foi chamado

            expect(global.Toastify).toHaveBeenCalledWith(//verifica se foi chamado a mensagem correta
                expect.objectContaining({text:'Você acertou! Fim de jogo!'})
            );
        });
    })

    describe('showInfo', () => {
        test('showInfo deve chamar .toastfy()', () => {
        showInfo('Limite atingido !');

        expect(mockShowToastify).toHaveBeenCalled();
    })

        test('showInfo deve chamar Toastfy com a mensagem de limite de letras atingido', () => {
            showInfo('Limite máximo de letras por linha atingido');

            expect(global.Toastify).toHaveBeenCalled();

            expect(global.Toastify).toHaveBeenLastCalledWith(
                expect.objectContaining({text: 'Limite máximo de letras por linha atingido'})
            )
        })

        test('showInfo deve chamar Toastfy com a mensagem de apagar palpite vazio', () => {
            showInfo('Não é possível apagar um palpite vazio');

            expect(global.Toastify).toHaveBeenCalled();

            expect(global.Toastify).toHaveBeenLastCalledWith(
                expect.objectContaining({text: 'Não é possível apagar um palpite vazio'})
            )
        })

        test('showInfo deve chamar Toastfy com a mensagem de palpite incompleto', () => {
            showInfo('Palpite incompleto');

            expect(global.Toastify).toHaveBeenCalled();

            expect(global.Toastify).toHaveBeenLastCalledWith(
                expect.objectContaining({text: 'Palpite incompleto'})
            );
        });

        test('showInfo deve chamar Toastfy com a mensagem de tecla prescionada invalida', () => {
            showInfo('Tecla pressionada inválida');

            expect(global.Toastify).toHaveBeenCalled();

            expect(global.Toastify).toHaveBeenLastCalledWith(
                expect.objectContaining({text: 'Tecla pressionada inválida'})
            );
        });
    })

    describe('showError', () => {
        test('showError deve chamar .toastfy()', () => {
            showError('Fim do jogo !');

            expect(mockShowToastify).toHaveBeenCalled();
        })

        test('showError deve chamar Toastfy com a mensagem de fim de jogo', () => {
            showError('Fim do jogo ! A palavra era: Casar');

            expect(global.Toastify).toHaveBeenCalled();

            expect(global.Toastify).toHaveBeenLastCalledWith(
                expect.objectContaining({text: 'Fim do jogo ! A palavra era: Casar'})
            )
        })
    })
});    