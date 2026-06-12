import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { isNumber } from '../../utils/validators';

const operations = [
  'sin',
  'cos',
  'tan',
  'csc',
  'sec',
  'cot',
  'sqrt',
  'cbrt',
  'square',
  'cube',
  'power',
  'factorial',
  'pi',
  'euler',
  'log',
  'ln',
  'abs',
  'reciprocal'
] as const;

export const ScientificCalculator = () => {
  const [value, setValue] = useState('');
  const [operation, setOperation] = useState<typeof operations[number]>('sin');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  const eps = 1e-12;

  const evaluate = (valueNumber: number) => {
    switch (operation) {
      case 'sin':
        return Math.abs(Math.sin(degToRad(valueNumber))) < 1e-15 ? 0 : Math.sin(degToRad(valueNumber));
      case 'cos':
        return Math.abs(Math.cos(degToRad(valueNumber))) < 1e-15 ? 0 : Math.cos(degToRad(valueNumber));
      case 'tan': {
        const cosV = Math.cos(degToRad(valueNumber));
        if (Math.abs(cosV) < eps) return NaN;
        return Math.tan(degToRad(valueNumber));
      }
      case 'csc': {
        const sinV = Math.sin(degToRad(valueNumber));
        if (Math.abs(sinV) < eps) return NaN;
        return 1 / sinV;
      }
      case 'sec': {
        const cosV = Math.cos(degToRad(valueNumber));
        if (Math.abs(cosV) < eps) return NaN;
        return 1 / cosV;
      }
      case 'cot': {
        const sinV = Math.sin(degToRad(valueNumber));
        if (Math.abs(sinV) < eps) return NaN;
        return Math.cos(degToRad(valueNumber)) / sinV;
      }
      case 'sqrt':
        return valueNumber >= 0 ? Math.sqrt(valueNumber) : NaN;
      case 'cbrt':
        return Math.cbrt(valueNumber);
      case 'square':
        return Math.pow(valueNumber, 2);
      case 'cube':
        return Math.pow(valueNumber, 3);
      case 'power':
        return Math.pow(valueNumber, 2);
      case 'factorial':
        if (!Number.isInteger(valueNumber) || valueNumber < 0) return NaN;
        if (valueNumber > 170) return NaN; // avoid overflow
        return (function fac(n: number) {
          let r = 1;
          for (let i = 2; i <= n; i += 1) r *= i;
          return r;
        })(valueNumber);
      case 'pi':
        return Math.PI;
      case 'euler':
        return Math.E;
      case 'log':
        return valueNumber > 0 ? Math.log10(valueNumber) : NaN;
      case 'ln':
        return valueNumber > 0 ? Math.log(valueNumber) : NaN;
      case 'abs':
        return Math.abs(valueNumber);
      case 'reciprocal':
        return valueNumber === 0 ? NaN : 1 / valueNumber;
      default:
        return NaN;
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!isNumber(value)) {
      setError('Enter a valid number before evaluating.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const computed = evaluate(Number(value));
      if (!Number.isFinite(computed) || Number.isNaN(computed)) {
        setError(!Number.isFinite(computed) ? 'Undefined' : 'The selected operation is not valid for this input.');
        setResult(null);
      } else {
        // Round to 5 decimal places and remove unnecessary trailing zeros
        const rounded = parseFloat((Math.round((computed + Number.EPSILON) * 1e5) / 1e5).toFixed(5));
        setResult(Number(rounded.toString()));
      }
      setLoading(false);
    }, 300);
  };

  return (
    <motion.section whileHover={{ y: -2 }} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/10">
      <h2 className="text-xl font-semibold text-white">Scientific Calculator</h2>
      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-[1.5fr_1fr]">
        <Input label="Value" placeholder="Enter a number" value={value} onChange={(event) => setValue(event.target.value)} />
        <label className="block text-sm font-medium text-slate-200">
          Function
          <select
            value={operation}
            onChange={(event) => setOperation(event.target.value as typeof operations[number])}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            {operations.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Evaluating...' : 'Evaluate'}
          </Button>
        </div>
      </form>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {result !== null && <p className="text-lg font-semibold text-brand-100">Result: {result}</p>}
    </motion.section>
  );
};
