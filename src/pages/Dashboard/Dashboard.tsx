import { useEffect, useRef, useState } from 'react';

type HistoryItem = { operation: string; result: string; timestamp: string };

const MAX_HISTORY = 20;

export default function Dashboard() {
  const [current, setCurrent] = useState('0');
  const [expression, setExpression] = useState('');
  const [shouldReset, setShouldReset] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('calcHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calcHistory', JSON.stringify(history.slice(0, MAX_HISTORY)));
  }, [history]);

  const playClick = () => {
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 600;
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.09);
    } catch (e) {
      // ignore
    }
  };

  const formatDisplay = (val: number | string) => {
    if (typeof val === 'string') return val;
    if (!Number.isFinite(val) || Number.isNaN(val)) return 'Undefined';
    if (Math.abs(val - Math.PI) < 1e-12) return Math.PI.toString();
    if (Math.abs(val - Math.E) < 1e-12) return Math.E.toString();
    // round to 5 decimals
    const rounded = Math.round((val + Number.EPSILON) * 1e5) / 1e5;
    return rounded.toString();
  };

  const appendNumber = (d: string) => {
    playClick();
    if (shouldReset) {
      setCurrent(d);
      setShouldReset(false);
      setExpression('');
      return;
    }
    if (current === '0' || current === 'Error' || current === 'Undefined') setCurrent(d);
    else setCurrent(current + d);
  };

  const appendDecimal = () => {
    playClick();
    if (shouldReset) {
      setCurrent('0.');
      setShouldReset(false);
      setExpression('');
      return;
    }
    if (!current.includes('.')) setCurrent(current + '.');
  };

  const applyOperator = (op: string) => {
    playClick();
    if (current === 'Error' || current === 'Undefined') {
      setCurrent('0');
      setExpression('');
    }
    if (shouldReset) {
      setExpression(current + op);
      setCurrent('');
      setShouldReset(false);
      return;
    }
    if (current !== '') {
      setExpression((prev) => prev + current + op);
      setCurrent('');
    } else if (expression !== '') {
      const last = expression.slice(-1);
      if ('+-*/%'.includes(last)) setExpression(expression.slice(0, -1) + op);
      else setExpression(expression + op);
    } else if (op === '-') {
      setCurrent('-');
    }
  };

  const safeEval = (expr: string) => {
    const cleaned = expr.replace(/\^(-?\d+(?:\.\d+)?)/g, '**($1)').replace(/\^/g, '**');
    try {
      // disallow letters other than e and E
      if (!/^[0-9.+\-*/%()eE]+$/.test(cleaned)) return { error: 'Error' };
      // divide by zero detection
      if (/\/\s*0+(?:\.0+)?(?!\d)/.test(cleaned)) return { error: 'Cannot divide by 0' };
      const result = new Function(`"use strict"; return (${cleaned})`)();
      if (!Number.isFinite(result) || Number.isNaN(result)) return { error: 'Undefined' };
      return { value: result };
    } catch (e) {
      return { error: 'Error' };
    }
  };

  const computeEquals = () => {
    playClick();
    let expr = expression;
    if (current !== '') expr += current;
    if (expr.trim() === '') {
      setCurrent('Error');
      setExpression('');
      setShouldReset(true);
      return;
    }
    const last = expr.slice(-1);
    if ('+-*/%^'.includes(last)) expr = expr.slice(0, -1);
    const res = safeEval(expr);
    if ((res as any).error) {
      setCurrent((res as any).error);
      setExpression('');
      setShouldReset(true);
      return;
    }
    const value = (res as any).value as number;
    const out = formatDisplay(value);
    setExpression(expr + ' =');
    setCurrent(out);
    setHistory((h) => [{ operation: expr, result: out, timestamp: new Date().toLocaleString() }, ...h].slice(0, MAX_HISTORY));
    setShouldReset(true);
  };

  const clearAll = () => {
    playClick();
    setCurrent('0');
    setExpression('');
    setShouldReset(false);
  };

  const deleteLast = () => {
    playClick();
    if (shouldReset || current === 'Error' || current === 'Undefined') {
      clearAll();
      return;
    }
    if (current.length <= 1) setCurrent('0');
    else setCurrent(current.slice(0, -1));
  };

  const applyUnary = (action: string) => {
    playClick();
    let v = parseFloat(current);
    if (current === '' || current === 'Error' || current === 'Undefined') v = 0;
    let result: number | string = NaN;
    const degToRad = (deg: number) => (deg * Math.PI) / 180;
    switch (action) {
      case 'sqrt':
        if (v < 0) return setCurrent('Error');
        result = Math.sqrt(v);
        break;
      case 'cbrt':
        result = Math.cbrt(v);
        break;
      case 'square':
        result = Math.pow(v, 2);
        break;
      case 'cube':
        result = Math.pow(v, 3);
        break;
      case 'factorial':
        if (!Number.isInteger(v) || v < 0 || v > 170) return setCurrent('Error');
        let r = 1;
        for (let i = 2; i <= v; i++) r *= i;
        result = r;
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'euler':
        result = Math.E;
        break;
      case 'sin':
        result = Math.sin(degToRad(v));
        if (Math.abs(result) < 1e-15) result = 0;
        break;
      case 'cos':
        result = Math.cos(degToRad(v));
        if (Math.abs(result) < 1e-15) result = 0;
        break;
      case 'tan': {
        const cosV = Math.cos(degToRad(v));
        if (Math.abs(cosV) < 1e-12) return setCurrent('Undefined');
        result = Math.tan(degToRad(v));
        break;
      }
      case 'log':
        if (v <= 0) return setCurrent('Error');
        result = Math.log10(v);
        break;
      case 'ln':
        if (v <= 0) return setCurrent('Error');
        result = Math.log(v);
        break;
      case 'abs':
        result = Math.abs(v);
        break;
      case 'reciprocal':
        if (v === 0) return setCurrent('Error');
        result = 1 / v;
        break;
      default:
        return;
    }
    setExpression(`${action}(${current})`);
    setCurrent(formatDisplay(result));
    setHistory((h) => [{ operation: `${action}(${current})`, result: formatDisplay(result), timestamp: new Date().toLocaleString() }, ...h].slice(0, MAX_HISTORY));
    setShouldReset(true);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (/^[0-9]$/.test(key)) appendNumber(key);
      else if (key === '.') appendDecimal();
      else if (['+', '-', '*', '/', '%'].includes(key)) applyOperator(key);
      else if (key === 'Enter' || key === '=') { e.preventDefault(); computeEquals(); }
      else if (key === 'Backspace') deleteLast();
      else if (key === 'Escape') clearAll();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-white">Scientific Calculator</h1>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
          <div className="calculator-screen mb-4">
            <div className="text-sm text-slate-400 text-right">{expression}</div>
            <div className="text-3xl font-bold text-white text-right">{current}</div>
          </div>

          <div className="grid grid-cols-6 gap-3 mb-4">
            {[
              ['sqrt', '√'],
              ['cbrt', '∛'],
              ['square', 'x²'],
              ['cube', 'x³'],
              ['power', 'xʸ'],
              ['factorial', '!']
            ].map(([a, label]) => (
              <button key={a} onClick={() => applyUnary(a)} className="button button-scientific">{label}</button>
            ))}
          </div>

          <div className="grid grid-cols-6 gap-3 mb-4">
            {[
              ['pi', 'π'],
              ['euler', 'e'],
              ['sin', 'sin'],
              ['cos', 'cos'],
              ['tan', 'tan'],
              ['log', 'log']
            ].map(([a, label]) => (
              <button key={a} onClick={() => applyUnary(a)} className="button button-scientific">{label}</button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-3">
            <button className="button button-clear" onClick={clearAll}>C</button>
            <button className="button button-delete" onClick={deleteLast}>DEL</button>
            <button className="button button-operator" onClick={() => applyOperator('%')}>%</button>
            <button className="button button-operator" onClick={() => applyOperator('/')}>÷</button>

            {['7','8','9'].map((n) => <button key={n} className="button button-num" onClick={() => appendNumber(n)}>{n}</button>)}
            <button className="button button-operator" onClick={() => applyOperator('*')}>×</button>

            {['4','5','6'].map((n) => <button key={n} className="button button-num" onClick={() => appendNumber(n)}>{n}</button>)}
            <button className="button button-operator" onClick={() => applyOperator('-')}>−</button>

            {['1','2','3'].map((n) => <button key={n} className="button button-num" onClick={() => appendNumber(n)}>{n}</button>)}
            <button className="button button-operator" onClick={() => applyOperator('+')}>+</button>

            <button className="button button-num col-span-2" onClick={() => appendNumber('0')}>0</button>
            <button className="button button-num" onClick={appendDecimal}>.</button>
            <button className="button button-equals" onClick={computeEquals}>=</button>
          </div>

          <div className="mt-4">
            <h3 className="text-sm text-slate-300 mb-2">History</h3>
            <div className="space-y-2 max-h-40 overflow-auto">
              {history.length === 0 ? (
                <div className="text-slate-400 text-sm">No history yet</div>
              ) : (
                history.map((h, idx) => (
                  <div key={idx} className="history-item p-2 rounded-md bg-slate-800/50 text-sm flex justify-between">
                    <div><strong>{h.operation}</strong><div className="text-slate-400">= {h.result}</div></div>
                    <div className="text-slate-500 text-xs">{h.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
