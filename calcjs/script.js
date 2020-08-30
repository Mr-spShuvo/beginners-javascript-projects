class Calculator{
    constructor(preOperandTextElem, currOperandTextElem){
        this.preOperandTextElem = preOperandTextElem;
        this.currOperandTextElem = currOperandTextElem;
        this.clear();
    }

    clear(){
        this.isEqual = false;
        this.preOperandTextElem.innerText = '';
        this.currOperandTextElem.innerText = '';
        this.preOperand = '';
        this.currOperand = '';
        this.operation = undefined;
    }

    delete(){
        this.currOperand = this.currOperand.toString().slice(0, -1);
    }

    appendNum(number){
        if(this.isEqual) this.clear();
        if(number === '.' && this.currOperand.includes('.')) return;
        this.currOperand = this.currOperand.toString() + number.toString();
    }

    chooseOperation(operation){
        this.isEqual = false;
        if(this.currOperand === '') return;
        if(this.preOperand !== '') this.compute();
        this.operation = operation;
        this.preOperand = this.currOperand;
        this.currOperand = '';
    }

    handleEqualSign(){
        this.isEqual = true;
    }

    compute(){
        let computation;
        const prev = parseFloat(this.preOperand);
        const curr = parseFloat(this.currOperand);
        if(isNaN(prev) || isNaN(curr)) return;
        switch(this.operation){
            case 'divide':
                computation = prev / curr;
                break;
            case 'multiply':
                computation = prev * curr;
                break;
            case 'minus':
                computation = prev - curr;
                break;
            case 'add':
                computation = prev + curr;
                break;
            default:
                return
        }
        this.preOperand = ''
        this.currOperand = computation;
        this.operation = undefined;
    }

    getDisplayNum(num){
        const stringNum = num.toString();
        const intNum = parseFloat(stringNum.split('.')[0]);
        const decimalNum = stringNum.split('.')[1];
        let integerDisplay;
        if(isNaN(intNum)){
            integerDisplay = ''
        } else {
            integerDisplay = intNum.toLocaleString('en', {maximumFractionDigits:0});
        } 
        if(decimalNum != null){
            return `${integerDisplay}.${decimalNum}`;
        } else {
            return integerDisplay;
        }
    }

    updateUI(){
        this.currOperandTextElem.innerText = this.getDisplayNum(this.currOperand);
        this.preOperandTextElem.innerText = this.preOperand;
        if(this.operation != null) {
            let sign;
            switch(this.operation){
                case 'divide':
                    sign = '&divide;';
                    break;
                case 'multiply':
                    sign = '&Cross;';
                    break;
                case 'add':
                    sign = '&plus;';
                    break;
                case 'minus':
                    sign = '&minus;';
                    break;
                default:
                    return
            }
            this.preOperandTextElem.innerHTML = `${this.getDisplayNum(this.preOperand)} ${sign}`;
        } else{
            this.preOperandTextElem.innerText = '';
        }
    }
} 

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const preOperandTextElem = document.querySelector('[data-operand="previous"]');
const currOperandTextElem = document.querySelector('[data-operand="current"]');

const calculator = new Calculator(preOperandTextElem, currOperandTextElem);

numberButtons.forEach((b)=>{
    b.addEventListener('click', ()=>{
        calculator.appendNum(b.innerText);
        calculator.updateUI();
    });
});

operationButtons.forEach((b)=>{
    b.addEventListener('click', ()=>{
        calculator.chooseOperation(b.getAttribute('data-operation'));
        calculator.updateUI();
    });
});

equalsButton.addEventListener('click', (b)=>{
    calculator.compute();
    calculator.updateUI();
    calculator.handleEqualSign();
});

allClearButton.addEventListener('click', ()=>{
    calculator.clear();
    calculator.updateUI();
})

deleteButton.addEventListener('click', ()=>{
    calculator.delete();
    calculator.updateUI();
})