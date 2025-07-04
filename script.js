        let display = document.getElementById('display');
        let currentInput = '0';
        let previousInput = null;
        let operator = null;
        let waitingForNewInput = false;

        function updateDisplay() {
            display.textContent = currentInput;
        }

        function inputNumber(num) {
            if (waitingForNewInput) {
                currentInput = num;
                waitingForNewInput = false;
            } else {
                currentInput = currentInput === '0' ? num : currentInput + num;
            }
            updateDisplay();
        }

        function inputDecimal() {
            if (waitingForNewInput) {
                currentInput = '0.';
                waitingForNewInput = false;
            } else if (currentInput.indexOf('.') === -1) {
                currentInput += '.';
            }
            updateDisplay();
        }

        function inputOperator(nextOperator) {
            const inputValue = parseFloat(currentInput);

            if (previousInput === null) {
                previousInput = inputValue;
            } else if (operator) {
                const currentValue = previousInput || 0;
                const newValue = performCalculation(currentValue, inputValue, operator);

                currentInput = String(newValue);
                previousInput = newValue;
                updateDisplay();
            }

            waitingForNewInput = true;
            operator = nextOperator;
        }

        function calculate() {
            const inputValue = parseFloat(currentInput);

            if (previousInput !== null && operator) {
                const newValue = performCalculation(previousInput, inputValue, operator);
                currentInput = String(newValue);
                previousInput = null;
                operator = null;
                waitingForNewInput = true;
                updateDisplay();
            }
        }

        function performCalculation(firstValue, secondValue, operator) {
            switch (operator) {
                case '+':
                    return firstValue + secondValue;
                case '-':
                    return firstValue - secondValue;
                case '*':
                    return firstValue * secondValue;
                case '/':
                    if (secondValue === 0) {
                        alert('Cannot divide by zero!');
                        return firstValue;
                    }
                    return firstValue / secondValue;
                default:
                    return secondValue;
            }
        }

        function clearDisplay() {
            currentInput = '0';
            previousInput = null;
            operator = null;
            waitingForNewInput = false;
            updateDisplay();
        }

        function clearEntry() {
            currentInput = '0';
            updateDisplay();
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            // Prevent default behavior for calculator keys
            if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
                event.preventDefault();
            }

            // Handle number inputs
            if (key >= '0' && key <= '9') {
                inputNumber(key);
                highlightButton(key);
            }
            
            // Handle operators
            else if (key === '+') {
                inputOperator('+');
                highlightButton('+');
            }
            else if (key === '-') {
                inputOperator('-');
                highlightButton('-');
            }
            else if (key === '*') {
                inputOperator('*');
                highlightButton('*');
            }
            else if (key === '/') {
                inputOperator('/');
                highlightButton('/');
            }
            
            // Handle other functions
            else if (key === '.' || key === ',') {
                inputDecimal();
                highlightButton('.');
            }
            else if (key === 'Enter' || key === '=') {
                calculate();
                highlightButton('Enter');
            }
            else if (key === 'Escape') {
                clearDisplay();
                highlightButton('Escape');
            }
            else if (key === 'Backspace') {
                if (currentInput.length > 1) {
                    currentInput = currentInput.slice(0, -1);
                } else {
                    currentInput = '0';
                }
                updateDisplay();
            }
        });

        function highlightButton(key) {
            const button = document.querySelector(`button[data-key="${key}"]`);
            if (button) {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                setTimeout(() => {
                    button.style.transform = '';
                    button.style.boxShadow = '';
                }, 150);
            }
        }

        // Initialize display
        updateDisplay();