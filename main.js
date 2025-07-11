function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

const display = document.querySelector('.display');
const calculator = document.querySelector('.calculator');
calculator.addEventListener('click', tokenize);

const tokens = [];
const operations = '/*-+=';

function tokenize(event) {
  if (event.target.nodeName.toLowerCase() !== 'button') {
    return;
  }
  const token = event.target.textContent;
  console.log('pressed: ' + token);

  if (operations.includes(tokens.at(-1)) && operations.includes(token)) {
    throw Error("you can't use two operations in a row!");
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
    tokens.push(token);
  } else {
    tokens[tokens.length - 1] += token;
  }

  handleDisplay();
}

function handleDisplay() {
  console.log(tokens);

  if (!tokens.includes('=')) {
    display.textContent = tokens.toString().replaceAll(',', ' ') + '_';
  }
}

const equalButton = document.querySelector('#equal');
equalButton.addEventListener('click', handleEvaluation());

function handleEvaluation() {}
