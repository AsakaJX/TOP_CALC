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

function tokenize(event) {
  if (event.target.nodeName.toLowerCase() !== 'button') {
    return;
  }
  const token = event.target.textContent;
  console.log('pressed: ' + token);

  const operations = '/*-+';

  if (tokens.length === 0) {
    tokens.push(token);
    return;
  }

  if (operations.includes(tokens.at(-1)) && operations.includes(token)) {
    throw Error("you can't use two operations in a row!");
  }

  if (operations.includes(token) || operations.includes(tokens.at(-1))) {
    tokens.push(token);
  } else {
    tokens[tokens.length - 1] += token;
  }

  console.log(tokens);
}
