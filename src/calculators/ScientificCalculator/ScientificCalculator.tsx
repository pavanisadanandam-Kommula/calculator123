import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { isNumber } from '../../utils/validators';

const operations = ['sin', 'cos', 'tan', 'sqrt', 'log'] as const;

export const ScientificCalculator = () => {
  const [value, setValue] = useState('');
  const [operation, setOperation] = useState<typeof operations[number]>('sin');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const evaluate = (valueNumber: number) => {
    switch (operation) {
      case 'sin':
        return Math.sin(valueNumber);
      case 'cos':
        return Math.cos(valueNumber);
      case 'tan':
        return Math.tan(valueNumber);
      case 'sqrt':
        return valueNumber >= 0 ? Math.sqrt(valueNumber) : NaN;
      case 'log':
        return valueNumber > 0 ? Math.log10(valueNumber) : NaN;
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
      if (Number.isNaN(computed)) {
        setError('The selected operation is not valid for this input.');
        setResult(null);
      } else {
        setResult(Number(computed.toFixed(6)));
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
