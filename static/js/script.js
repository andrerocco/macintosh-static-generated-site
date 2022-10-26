// PARTE - Abrir as janelas
let iconesDesktop = Array.prototype.slice.call(document.querySelectorAll(".desktop-icon"));
iconesDesktop.forEach(function(iconElement) {
    iconElement.addEventListener("click", function(eventInfo) {
        // this refere ao elemento que foi clicado (tem o mesmo valor de iconElement)

        var iconId = (this.id).toLowerCase()
        var relatedWindowId = iconId.replace("icon", "window")
        var relatedWindow = document.getElementById(relatedWindowId)
        // Seleciona a janela baseado no #id do ícone clicado 
        
        relatedWindow.style.transform = "scale(1)";
        
        overlay(relatedWindow)
    });
})

// Link "C:/desktop/pfp.jpg" abre a imagem #pfp-window
const sobrePath = document.getElementById("pfp-jpg-path");
sobrePath.addEventListener("click", function() {
    let janelaImagem = document.getElementById("pfp-window")
    janelaImagem.style.transform = "scale(1)";
})

// PARTE - Z-index das janelas (a função é ativada quando o usuário clica em um dos ícones)
function overlay(janela) {
    if (janela.style.zIndex != listaOrdemJanelas.length) { // Se o elemento já não for o primeiro
        let idAtual = janela.id
        
        // Reposiciona o id em listaOrdemJanelas para a primeira posição
        let tempPosicaoAntiga = listaOrdemJanelas.indexOf(idAtual) // Descobre o índice da lista com a ordem das janelas 
        listaOrdemJanelas.splice(tempPosicaoAntiga, 1) // Remove o id da lista
        listaOrdemJanelas.unshift(idAtual) // Coloca o id na primeira posição

        for(let i = 0; i < listaOrdemJanelas.length; i++) {
            let idElemento = listaOrdemJanelas[i]
            let elementoAtual = document.getElementById(idElemento)

            elementoAtual.style.zIndex = listaOrdemJanelas.length - i // Os primeiros elementos da lista serão colocados acima
        }
    }
}

let objetoJanelas = document.querySelectorAll('[data-window]')

let listaOrdemJanelas = [] // A lista contém a ordem atual de sobreposição das janelas
objetoJanelas.forEach(function(janela) {
    let idAtual = janela.id
    listaOrdemJanelas.push(idAtual)
})

objetoJanelas.forEach(function(janela) {
    janela.addEventListener("click", function() {
        overlay(janela)
    })
})

// PARTE - Fechar as janelas
let closeButtonJanelas = Array.prototype.slice.call(document.querySelectorAll(".window-header-close"))
closeButtonJanelas.forEach(function(closeElement) {
    closeElement.addEventListener("click", function(eventInfo) {
        var relatedWindow = this.parentNode.parentNode // Seleciona a div que está dois parentes para cima
        
        relatedWindow.style.transform = "scale(0)";
        zAtual = relatedWindow.style.zIndex
        relatedWindow.style.zIndex = (zAtual-1) + "px";
    })
})

// PARTE - Arrastar janelas
let dragAreaJanelas = Array.prototype.slice.call(document.querySelectorAll(".window-header"))
dragAreaJanelas.forEach(function(header) {
    header.addEventListener("mousedown", ()=>{
        /* header.classList.add("active"); */
        header.addEventListener("mousemove", onDrag);
    });
    var relatedWindow = header.parentNode
    function onDrag({movementX, movementY}){
        let getStyle = window.getComputedStyle(relatedWindow);
        let leftVal = parseInt(getStyle.left);
        let topVal = parseInt(getStyle.top);

        relatedWindow.style.left = `${leftVal + movementX}px`;
        relatedWindow.style.top = `${topVal + movementY}px`;
    };
    document.addEventListener("mouseup", ()=>{
        header.removeEventListener("mousemove", onDrag);

        /* // Caso seja colocado em cima do header:
        let getStyle = window.getComputedStyle(relatedWindow);
        let topVal = parseInt(getStyle.top);
        console.log(topVal)
        if (topVal < -2) {
            console.log("SIM")
            relatedWindow.removeAttribute('top'); 
            relatedWindow.style.top = '-2px';
        } */
    });
})

// PARTE - Carregar janelas em posições aleatórias pela tela
const desktop = document.querySelector('#desktop')
const desktopHeight = desktop.offsetHeight;
const desktopWidth = desktop.offsetWidth;
objetoJanelas.forEach(function gerarPosicoes(janela) {
    var janelaHeight = janela.offsetHeight;
    var janelaWidth = janela.offsetWidth;

    // Calcula a range em que as propriedades left e top poderão ser definidas, de modo que não fiquem para fora do #desktop
    var safeHeight = desktopHeight - janelaHeight - 10;
    var safeWidth = desktopWidth - janelaWidth - 10;

    // Escolhe um valor aleatório dentro da área segura
    // Math.radom() gera um decimal aleatório entre 0 e 1
    var topPos = Math.floor(Math.random() * (safeHeight - 5 + 1)) + 5
    var leftPos = Math.floor(Math.random() * (safeWidth - 5 + 1)) + 5
    

    janela.style.top = topPos + 'px';
    janela.style.left = leftPos + 'px';
})

// PARTE - Funcionamento da calculadora
class Calculator {
    constructor(calculatorOperandText) {
        this.calculatorOperandDiv = calculatorOperandText
        this.numberShown = ''
        this.numberTemp = ''
        this.operation = undefined
    }
    
    clear() {
        this.calculatorOperandDiv.innerText = '0'
        this.numberShown = ''
        this.numberTemp = ''
        this.operation = undefined
    }

    updateNumber(number) {
        if (number !== '.'){ // Se o botão clicado não for ponto
            if (number === '0' && this.numberShown.length === 0) { // Se o número ainda estiver vazio e o botão clicado for zero (zero à esquerda)
                console.log('naooo')
            } else {
                this.numberShown = this.numberShown + number
            }
        } else if (number === '.' && this.numberShown.indexOf('.') === -1) { // Se number for ponto e já não tiver um ponto no número mostrado
            this.numberShown = this.numberShown + number
        }
    }

    updateScreen(valor = this.numberShown) { // O valor de atualização é this.numberShown por padrão
        this.calculatorOperandDiv.innerText = valor
    }

    chooseOperation(operation) {
        this.operation = operation
        this.numberTemp = this.numberShown // Manda o valor do número mostrado para o número temporário
        this.numberShown = '' // Limpa o número mostrado
    }

    operate() {
        if (this.operation !== undefined) {
            let result

            const oldNumber = parseFloat(this.numberTemp)
            const newNumber = parseFloat(this.numberShown)

            // Cancela a operação se algum dos dois números não for válido (no caso do usuário não ter inserido)
            if(isNaN(oldNumber) || isNaN(newNumber)) return            

            // Faz a operação baseada na string em this.operation
            switch(this.operation) {
                case '+':
                    result = oldNumber + newNumber
                    break
                case '-':
                    result = oldNumber - newNumber
                    break
                case '*':
                    result = oldNumber * newNumber
                    break
                case '/':
                    result = oldNumber / newNumber
                    break
            }
            
            this.operation = undefined // Limpa a operação
            result = Math.round(result * 10000)/10000 // Arredonda o número para 4 casas decimais
            this.numberTemp = this.numberShown
            this.numberShown = result.toString()
        }
    }
}

const calculatorNumbers = document.querySelectorAll('[data-number]')
const calculatorOperations = document.querySelectorAll('[data-operation]')
const calculatorEquals = document.querySelectorAll('[data-equals]')
const calculatorClear = document.querySelector('[data-calculator-clear]')
const calculatorOperandText = document.querySelector('[data-operand]')

const calculator = new Calculator(calculatorOperandText)

calculatorNumbers.forEach(button => { // Monitora os números clicados
    button.addEventListener('click', function() {
        calculator.updateNumber(button.innerText)
        calculator.updateScreen()
    })
})

calculatorOperations.forEach(button => { // Monitora as operações clicadas
    button.addEventListener('click', function() {
        calculator.chooseOperation(button.innerText)
    })
})

calculatorEquals.forEach(button => { // Monitora os botões de igual clicados
    button.addEventListener('click', function() {
        calculator.operate()
        calculator.updateScreen()
    })
})

calculatorClear.addEventListener('click', function() { // Monitora o botão de clear clicado
    calculator.clear()
})


// PARTE - Funcionamento do relógio
function clockDateTime() {
    /* TEMPO */
    var realTime = new Date();

    // Atribui a informação para as diferentes variáveis
    var hours = realTime.getHours();
    var minutes = realTime.getMinutes();
    var seconds = realTime.getSeconds();
    // Transforma o tempo no formato de dois dígitos para valores de tempo com apenas um digito
    hours = ("0"+hours).slice(-2);
    minutes = ("0"+minutes).slice(-2);
    seconds = ("0"+seconds).slice(-2);
    // Formata o tempo real no HTML
    document.getElementById('clock-real-time').innerHTML = hours + ':' + minutes + ':' + seconds

    /* DATA */
    // Gera os números correspondentes a cada informação
    var weekDay = realTime.getDay();
    var dayNumber = realTime.getDate();
    var monthNumber = realTime.getMonth();
    var year = realTime.getFullYear();

    var weekNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
    var monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]
    // Junta todas as informações da data
    var formatedDateString = String(weekNames[weekDay]) + ', ' + String(dayNumber) + ' de ' + String(monthNames[monthNumber]) + ' de ' + String(year)

    // Formata a data em tempo real
    document.getElementById('date').innerHTML = formatedDateString;
}
function initClock() {
    clockDateTime()
    window.setInterval("clockDateTime()", 1)
}