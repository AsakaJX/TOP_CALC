function sum(a, b) {
  return +a + +b;
}

function subtract(a, b) {
  return +a - +b;
}

function multiply(a, b) {
  return +a * +b;
}

function divide(a, b) {
  return +a / +b;
}

const display = document.querySelector('.display');
const calculator = document.querySelector('.calculator');
calculator.addEventListener('click', tokenize);

const keyboard = document.addEventListener('keydown', handleKeyboard);

let tokens = [];
const operations = '/*-+=';

const dotButton = document.querySelector('#column');

function handleKeyboard(event) {
  const key = event.key;

  switch (key) {
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
    case '/':
    case '*':
    case '-':
    case '+':
      tokenize(key, true);
      break;

    case 'Enter':
      handleEquation();
      break;

    case 'Backspace':
      if (event.ctrlKey) {
        tokens.pop();
        updateDisplay();
      } else {
        handleBackspace();
      }
      break;

    case 'c':
      clear();
      clearDisplay();
      break;

    default:
      break;
  }
}

function tokenize(event, isKeyEvent) {
  if (
    !isKeyEvent &&
    (event.target.nodeName.toLowerCase() !== 'button' ||
      event.target.id === 'clear' ||
      event.target.id === 'backspace')
  ) {
    return;
  }
  const token = !isKeyEvent ? event.target.textContent : event;
  const isEmpty = tokens.length === 0 ? true : false;
  const lastToken = !isEmpty ? tokens.length - 1 : -1;

  if (operations.includes(tokens.at(-1)) && operations.includes(token)) {
    throw Error("you can't use two operations in a row!");
  }

  if (
    token === '.' &&
    (tokens[lastToken].toString().includes('.') ||
      operations.includes(tokens[lastToken]))
  ) {
    return;
  }

  if (
    !isEmpty &&
    tokens[lastToken].toString()[tokens[lastToken].length - 1] === '.' &&
    operations.includes(token)
  ) {
    throw Error('you should first enter a number after the dot!');
  }

  if (result !== null) {
    clear();
    return;
  }

  const isOperatorExist =
    tokens.length !== 0
      ? tokens.reduce(
          (result, item) =>
            operations.includes(item) ? (result = true) : result,
          false
        )
      : null;

  if (
    tokens.length === 0 ||
    operations.includes(token) ||
    operations.includes(tokens.at(-1))
  ) {
    if (!isOperatorExist && token === '=') {
      throw Error("there' nothing to calculate at this point!");
    }
    if (token !== '=') {
      tokens.push(token);
    }
  } else {
    tokens[tokens.length - 1] += token;
  }

  updateDisplay();
}

function updateDisplay(msg) {
  display.textContent = tokens.toString().replaceAll(',', ' ') + '_';

  if (msg) {
    display.textContent = msg;
  }
}

const equalButton = document.querySelector('#equal');
equalButton.addEventListener('click', handleEquation);

let result = null;

function handleEquation() {
  let equation = [...tokens];
  const pattern = /[^\w\s,.]/g;
  const indexesOfOperators = [...equation.join('').matchAll(pattern)];

  const equationObject = {};

  let encounteredError = false;

  indexesOfOperators.forEach((item) => {
    const operatorIndex = item.index;

    equationObject[operatorIndex] = {};
    equationObject[operatorIndex] = {
      operator: equation[1],
      left: equation[0],
      right: equation[2],
    };

    const operator = equationObject[operatorIndex].operator;

    const leftToken = equationObject[operatorIndex].left;
    const rightToken = equationObject[operatorIndex].right;

    if (encounteredError) return;

    if (
      isNaN(+leftToken) ||
      isNaN(+rightToken) ||
      (+rightToken === 0 && operator === '/')
    ) {
      encounteredError = true;
      return;
    }

    let innerResult = null;
    switch (operator) {
      case '+':
        innerResult = sum(leftToken, rightToken);
        break;

      case '-':
        innerResult = subtract(leftToken, rightToken);
        break;

      case '*':
        innerResult = multiply(leftToken, rightToken);
        break;

      case '/':
        innerResult = divide(leftToken, rightToken);
        break;

      default:
        throw Error(
          'got an unexpected token during handling calculation process'
        );
    }

    equation = equation.slice(3);
    equation.unshift(innerResult);
  });
  result = equation[0];
  tokens = [...equation];
  if (encounteredError) {
    updateDisplay('ERROR');
  } else {
    updateDisplay(result);
  }
}

const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', () => {
  clear();
  clearDisplay();
});

function clear() {
  tokens = [];
  result = null;
}

function clearDisplay() {
  display.textContent = '_';
}

const backspaceButton = document.querySelector('#backspace');
backspaceButton.addEventListener('click', handleBackspace);

function handleBackspace() {
  if (tokens.length === 0) {
    throw Error("there's nothing to remove!");
  }

  const lastIndex = tokens.length - 1;

  if (tokens[lastIndex].toString().length === 1) {
    tokens.pop();
    updateDisplay();
    return;
  }

  tokens[lastIndex] = tokens[lastIndex]
    .toString()
    .substring(0, tokens[lastIndex].toString().length - 1);

  updateDisplay();
}
