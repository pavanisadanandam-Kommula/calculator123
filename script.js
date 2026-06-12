const displayElement = document.getElementById('display');
const expressionElement = document.getElementById('expression');
const buttons = document.querySelectorAll('.button');
const historyList = document.getElementById('historyList');
const clearHistoryButton = document.getElementById('clearHistory');
const copyResultButton = document.getElementById('copyResult');
const themeToggleButton = document.getElementById('themeToggle');
const clockElement = document.getElementById('clock');

let currentValue = '0';
let expression = '';
let shouldResetDisplay = false;
let calculationHistory = [];
let isDarkTheme = true;
let audioContext;

const MAX_HISTORY_ITEMS = 12;
const MAX_DISPLAY_CHARS = 18;

function createAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playClickSound() {
  createAudio();
  if (!audioContext) return;

  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 520;
  gain.gain.setValueAtTime(0.08, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

function setTheme(theme) {
  isDarkTheme = theme === 'dark';
  document.body.classList.toggle('light-theme', !isDarkTheme);
  themeToggleButton.textContent = isDarkTheme ? '🌙' : '☀️';
  localStorage.setItem('calcTheme', isDarkTheme ? 'dark' : 'light');
}

function loadTheme() {
  const storedTheme = localStorage.getItem('calcTheme');
  setTheme(storedTheme === 'light' ? 'light' : 'dark');
}

function formatExpression(expr) {
  return expr
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/\-/g, ' − ')
    .replace(/\^/g, ' ^ ')
    .replace(/%/g, ' % ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Format display values on the screen to round to 5 decimal places when needed
function formatDisplayValue(valStr) {
  if (['Error', 'Cannot divide by 0', 'Overflow', 'Undefined'].includes(valStr)) {
    return valStr;
  }
  
  const num = Number(valStr);
  if (Number.isNaN(num)) {
    return valStr;
  }
  
  // Display constants fully without rounding to 5 decimal places
  if (Math.abs(num - Math.PI) < 1e-14) {
    return '3.141592653589793';
  }
  if (Math.abs(num - Math.E) < 1e-14) {
    return '2.718281828459045';
  }

  // Format decimals to 5 decimal places and remove trailing zeros
  if (valStr.includes('.') || (valStr.toLowerCase().includes('e') && !valStr.endsWith('e'))) {
    if (valStr.toLowerCase().includes('e')) {
      const parts = valStr.toLowerCase().split('e');
      const coeff = Number(parts[0]);
      const exp = parts[1];
      return Number(coeff.toFixed(5)).toString() + 'e' + exp;
    }
    const rounded = Number(num.toFixed(5));
    return rounded.toString();
  }
  
  return valStr;
}

function updateDisplay() {
  if (!displayElement) return;

  let text = currentValue === '' ? '0' : currentValue;
  let displayText = formatDisplayValue(text);
  displayElement.textContent = displayText;

  if (displayText.length > MAX_DISPLAY_CHARS) {
    displayElement.style.fontSize = '22px';
  } else if (displayText.length > 11) {
    displayElement.style.fontSize = '28px';
  } else {
    displayElement.style.fontSize = '38px';
  }
}

function updateExpression(text) {
  if (!expressionElement) return;

  const output = text !== undefined ? text : expression;
  expressionElement.textContent = formatExpression(output);
}

function displayError(message) {
  currentValue = message;
  expression = '';
  updateDisplay();
  updateExpression('');
  shouldResetDisplay = true;
}

function safeFactorial(value) {
  if (value < 0 || !Number.isInteger(value) || value > 170) {
    return null;
  }
  let result = 1;
  for (let i = 2; i <= value; i += 1) {
    result *= i;
  }
  return result;
}

function formatResult(result) {
  if (result === 'Undefined') {
    return 'Undefined';
  }
  if (!Number.isFinite(result)) {
    return 'Overflow';
  }

  const rounded = Number(result.toFixed(10));
  let resultText = rounded.toString();

  if (Math.abs(rounded) < 1e-10 && rounded !== 0) {
    resultText = rounded.toExponential(6);
  }

  if (resultText.length > MAX_DISPLAY_CHARS) {
    resultText = rounded.toExponential(6);
  }

  return resultText;
}

function validateExpression(expr) {
  const cleaned = expr.replace(/\s+/g, '');
  return /^[0-9.+\-*/%^()]+$/.test(cleaned);
}

function evaluateExpression(expr) {
  if (!validateExpression(expr)) {
    return { error: 'Error' };
  }

  const zeroDivisionPattern = /[/]\s*0+(\.0+)?(?!\d)|%\s*0+(\.0+)?(?!\d)/;
  if (zeroDivisionPattern.test(expr)) {
    return { error: 'Cannot divide by 0' };
  }

  // Sanitize exponent expressions. Wrap negative exponents in parens to prevent JS syntax error (e.g. 5^-2 -> 5**(-2))
  const safeExpr = expr.replace(/\^(-?\d+(\.\d+)?)/g, '**($1)').replace(/\^/g, '**');

  try {
    const result = new Function(`"use strict"; return (${safeExpr})`)();
    if (!Number.isFinite(result) || Number.isNaN(result)) {
      return { error: 'Overflow' };
    }
    return { value: result };
  } catch (err) {
    return { error: 'Error' };
  }
}

function addHistoryItem(operation, result) {
  if (result === '' || result === 'Error' || result === 'Cannot divide by 0' || result === 'Overflow' || result === 'Undefined') {
    return;
  }

  const timestamp = new Date().toLocaleString();
  calculationHistory.unshift({ operation, result: formatDisplayValue(result), timestamp });
  calculationHistory = calculationHistory.slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
  renderHistory();
}

function renderHistory() {
  if (!historyList) return;

  if (calculationHistory.length === 0) {
    historyList.innerHTML = '<li class="history-item"><strong>No history yet</strong><span>Calculations will appear here.</span></li>';
    return;
  }

  historyList.innerHTML = calculationHistory
    .map(
      (item) =>
        `<li class="history-item"><strong>${item.operation}</strong><span>= ${item.result}</span><div class="history-time">${item.timestamp}</div></li>`
    )
    .join('');
}

function loadHistory() {
  const saved = localStorage.getItem('calcHistory');
  if (saved) {
    try {
      calculationHistory = JSON.parse(saved);
    } catch (err) {
      calculationHistory = [];
    }
  }
  renderHistory();
}

function clearHistory() {
  calculationHistory = [];
  localStorage.removeItem('calcHistory');
  renderHistory();
}

function setCurrentValue(value) {
  currentValue = value;
  updateDisplay();
}

function handleNumber(value) {
  if (shouldResetDisplay) {
    currentValue = value;
    shouldResetDisplay = false;
    updateExpression('');
  } else if (currentValue === '0' || currentValue === 'Error' || currentValue === 'Cannot divide by 0' || currentValue === 'Overflow' || currentValue === 'Undefined') {
    currentValue = value;
  } else {
    currentValue += value;
  }
  updateDisplay();
}

function handleDecimal() {
  if (shouldResetDisplay) {
    currentValue = '0.';
    shouldResetDisplay = false;
    updateExpression('');
  } else if (currentValue === 'Error' || currentValue === 'Cannot divide by 0' || currentValue === 'Overflow' || currentValue === 'Undefined') {
    currentValue = '0.';
  } else if (!currentValue.includes('.')) {
    currentValue = currentValue === '' ? '0.' : currentValue + '.';
  }
  updateDisplay();
}

function handleOperator(operator) {
  if (currentValue === 'Error' || currentValue === 'Cannot divide by 0' || currentValue === 'Overflow' || currentValue === 'Undefined') {
    currentValue = '0';
    expression = '';
  }

  if (shouldResetDisplay) {
    expression = currentValue + operator;
    currentValue = '';
    shouldResetDisplay = false;
  } else if (currentValue !== '') {
    expression += currentValue + operator;
    currentValue = '';
  } else if (expression !== '') {
    const lastChar = expression.slice(-1);
    if (['+', '-', '*', '/', '%', '^'].includes(lastChar)) {
      expression = expression.slice(0, -1) + operator;
    } else {
      expression += operator;
    }
  } else if (operator === '-') {
    currentValue = '-';
  }

  updateExpression();
  updateDisplay();
}

function handleClear() {
  currentValue = '0';
  expression = '';
  shouldResetDisplay = false;
  updateDisplay();
  updateExpression('');
}

function handleDelete() {
  if (shouldResetDisplay || currentValue === 'Error' || currentValue === 'Cannot divide by 0' || currentValue === 'Overflow' || currentValue === 'Undefined') {
    handleClear();
    return;
  }

  if (currentValue.length <= 1) {
    currentValue = '0';
  } else {
    currentValue = currentValue.slice(0, -1);
  }
  updateDisplay();
}

function handleEquals() {
  if (currentValue !== '') {
    expression += currentValue;
  }

  if (expression === '') {
    displayError('Error');
    return;
  }

  let trimmedExpression = expression.trim();
  const lastChar = trimmedExpression.slice(-1);
  if (['+', '-', '*', '/', '%', '^'].includes(lastChar)) {
    trimmedExpression = trimmedExpression.slice(0, -1);
  }

  const result = evaluateExpression(trimmedExpression);

  if (result.error) {
    displayError(result.error);
    return;
  }

  const formattedResult = formatResult(result.value);
  updateExpression(trimmedExpression + ' =');
  setCurrentValue(formattedResult);
  addHistoryItem(trimmedExpression, formattedResult);
  expression = '';
  shouldResetDisplay = true;
}

function applyUnary(action) {
  let value = Number(currentValue);
  if (currentValue === '' || currentValue === 'Error' || currentValue === 'Cannot divide by 0' || currentValue === 'Overflow' || currentValue === 'Undefined') {
    value = 0;
  }

  let result;
  let label = '';

  switch (action) {
    case 'sqrt':
      if (value < 0) {
        displayError('Error');
        return;
      }
      result = Math.sqrt(value);
      label = `√(${currentValue})`;
      break;
    case 'cbrt':
      result = Math.cbrt(value);
      label = `∛(${currentValue})`;
      break;
    case 'square':
      result = Math.pow(value, 2);
      label = `(${currentValue})²`;
      break;
    case 'cube':
      result = Math.pow(value, 3);
      label = `(${currentValue})³`;
      break;
    case 'power':
      if (expression !== '' && !shouldResetDisplay) {
        expression += currentValue + '^';
        currentValue = '';
        updateExpression();
        return;
      }
      expression = currentValue + '^';
      currentValue = '';
      updateExpression();
      return;
    case 'factorial': {
      const factorialVal = safeFactorial(value);
      if (factorialVal === null) {
        displayError('Error');
        return;
      }
      result = factorialVal;
      label = `(${currentValue})!`;
      break;
    }
    case 'pi':
      result = Math.PI;
      label = 'π';
      break;
    case 'euler':
      result = Math.E;
      label = 'e';
      break;
    case 'sin': {
      let rad = (value * Math.PI) / 180;
      let sinVal = Math.sin(rad);
      if (Math.abs(sinVal) < 1e-15) sinVal = 0;
      result = sinVal;
      label = `sin(${currentValue})`;
      break;
    }
    case 'cos': {
      let rad = (value * Math.PI) / 180;
      let cosVal = Math.cos(rad);
      if (Math.abs(cosVal) < 1e-15) cosVal = 0;
      result = cosVal;
      label = `cos(${currentValue})`;
      break;
    }
    case 'tan': {
      let rad = (value * Math.PI) / 180;
      let sinVal = Math.sin(rad);
      let cosVal = Math.cos(rad);
      if (Math.abs(sinVal) < 1e-15) sinVal = 0;
      if (Math.abs(cosVal) < 1e-15) cosVal = 0;
      if (cosVal === 0) {
        result = 'Undefined';
      } else {
        result = sinVal / cosVal;
      }
      label = `tan(${currentValue})`;
      break;
    }
    case 'csc': {
      let rad = (value * Math.PI) / 180;
      let sinVal = Math.sin(rad);
      if (Math.abs(sinVal) < 1e-15) sinVal = 0;
      if (sinVal === 0) {
        result = 'Undefined';
      } else {
        result = 1 / sinVal;
      }
      label = `csc(${currentValue})`;
      break;
    }
    case 'sec': {
      let rad = (value * Math.PI) / 180;
      let cosVal = Math.cos(rad);
      if (Math.abs(cosVal) < 1e-15) cosVal = 0;
      if (cosVal === 0) {
        result = 'Undefined';
      } else {
        result = 1 / cosVal;
      }
      label = `sec(${currentValue})`;
      break;
    }
    case 'cot': {
      let rad = (value * Math.PI) / 180;
      let sinVal = Math.sin(rad);
      let cosVal = Math.cos(rad);
      if (Math.abs(sinVal) < 1e-15) sinVal = 0;
      if (Math.abs(cosVal) < 1e-15) cosVal = 0;
      if (sinVal === 0) {
        result = 'Undefined';
      } else {
        result = cosVal / sinVal;
      }
      label = `cot(${currentValue})`;
      break;
    }
    case 'log':
      if (value <= 0) {
        displayError('Error');
        return;
      }
      result = Math.log10(value);
      label = `log(${currentValue})`;
      break;
    case 'ln':
      if (value <= 0) {
        displayError('Error');
        return;
      }
      result = Math.log(value);
      label = `ln(${currentValue})`;
      break;
    case 'abs':
      result = Math.abs(value);
      label = `abs(${currentValue})`;
      break;
    case 'reciprocal':
      if (value === 0) {
        displayError('Cannot divide by 0');
        return;
      }
      result = 1 / value;
      label = `1/(${currentValue})`;
      break;
    default:
      return;
  }

  const formattedResult = formatResult(result);
  setCurrentValue(formattedResult);
  updateExpression(label);
  shouldResetDisplay = true;
  addHistoryItem(label, formattedResult);
}

function copyResult() {
  if (!copyResultButton) return;
  const resultText = currentValue || '0';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(resultText).catch(() => {});
  }
  copyResultButton.textContent = 'Copied!';
  setTimeout(() => {
    if (copyResultButton) copyResultButton.textContent = 'Copy';
  }, 1200);
}

function handleButtonClick(button) {
  playClickSound();

  const value = button.getAttribute('data-value');
  const action = button.getAttribute('data-action');

  if (value !== null) {
    if (/^[0-9]$/.test(value)) {
      handleNumber(value);
    } else if (value === '.') {
      handleDecimal();
    } else {
      handleOperator(value);
    }
    return;
  }

  if (action !== null) {
    switch (action) {
      case 'clear':
        handleClear();
        break;
      case 'delete':
        handleDelete();
        break;
      case 'equals':
        handleEquals();
        break;
      case 'copy':
        copyResult();
        break;
      default:
        applyUnary(action);
        break;
    }
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => handleButtonClick(button));
});

function handleKeyboard(event) {
  const { key } = event;
  let matched = false;

  if (/^[0-9]$/.test(key)) {
    handleNumber(key);
    matched = true;
  } else if (key === '.') {
    handleDecimal();
    matched = true;
  } else if (['+', '-', '*', '/', '%'].includes(key)) {
    handleOperator(key);
    matched = true;
  } else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    handleEquals();
    matched = true;
  } else if (key === 'Backspace') {
    handleDelete();
    matched = true;
  } else if (key === 'Escape' || key.toLowerCase() === 'c') {
    handleClear();
    matched = true;
  }

  if (matched) {
    const isEquals = key === 'Enter' || key === '=';
    let buttonSelector = '';
    if (isEquals) {
      buttonSelector = '.button[data-action="equals"]';
    } else {
      buttonSelector = `.button[data-value="${key}"]`;
    }
    const picker = document.querySelector(buttonSelector);
    if (picker) {
      picker.classList.add('button-active');
      setTimeout(() => picker.classList.remove('button-active'), 100);
    }
  }
}

function updateClock() {
  if (!clockElement) return;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

if (clearHistoryButton) {
  clearHistoryButton.addEventListener('click', clearHistory);
}

if (copyResultButton) {
  copyResultButton.addEventListener('click', copyResult);
}

if (themeToggleButton) {
  themeToggleButton.addEventListener('click', () => setTheme(isDarkTheme ? 'light' : 'dark'));
}

window.addEventListener('keydown', handleKeyboard);
setInterval(updateClock, 1000);
loadHistory();
loadTheme();
updateClock();
updateDisplay();
updateExpression('');
