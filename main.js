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

let tokens = [];
const operations = '/*-+=';

function tokenize(event) {
  if (
    event.target.nodeName.toLowerCase() !== 'button' ||
    event.target.id === 'clear' ||
    event.target.id === 'backspace'
  ) {
    return;
  }
  const token = event.target.textContent;

  if (operations.includes(tokens.at(-1)) && operations.includes(token)) {
    throw Error("you can't use two operations in a row!");
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
      throw Error("there' nothing to evaluate at this point!");
    }
    if (token !== '=') {
      tokens.push(token);
    }
  } else {
    tokens[tokens.length - 1] += token;
  }

  console.log(tokens);

  updateDisplay();
}

function updateDisplay(result) {
  display.textContent = tokens.toString().replaceAll(',', ' ') + '_';

  if (result) {
    display.textContent = result;
  }
}

const equalButton = document.querySelector('#equal');
equalButton.addEventListener('click', handleEquation);

let result = null;

function handleEquation() {
  let equation = [...tokens];
  const pattern = /[^\w\s]/g;
  const indexesOfOperators = [...equation.join('').matchAll(pattern)];
  const equationObject = {};

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
          'got an unexpected token during handling evaluation process'
        );
    }

    equation = equation.slice(3);
    equation.unshift(innerResult);
  });
  result = equation[0];
  tokens = [...equation];
  updateDisplay(result);
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
