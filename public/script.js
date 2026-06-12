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
  if (!Number.isFinite(result) || Number.isNaN(result)) {
    return 'Undefined';
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
