import { useState, type FormEvent } from 'react';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { calculateBasic } from '../../services/calcService';
import { isNumber } from '../../utils/validators';

const operators = ['+', '-', '*', '/', '^'] as const;

export const BasicCalculator = () => {
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [operator, setOperator] = useState<(typeof operators)[number]>(operators[0]);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!isNumber(first) || !isNumber(second)) {
      setError('Please enter valid numeric values.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const value = calculateBasic(Number(first), Number(second), operator);
      if (Number.isNaN(value)) {
        setError('Cannot calculate with the given inputs.');
        setResult(null);
      } else {
        setResult(value);
      }
      setLoading(false);
    }, 250);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/10">
      <h2 className="text-xl font-semibold text-white">Basic Calculator</h2>
      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-[1fr_1fr]">
        <Input label="First value" value={first} onChange={(event) => setFirst(event.target.value)} placeholder="0" />
        <Input label="Second value" value={second} onChange={(event) => setSecond(event.target.value)} placeholder="0" />
        <label className="block text-sm font-medium text-slate-200">
          Operator
          <select
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            value={operator}
            onChange={(event) => setOperator(event.target.value as typeof operators[number])}
          >
            {operators.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate'}
          </Button>
        </div>
      </form>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {result !== null && <p className="text-lg font-semibold text-brand-100">Result: {result}</p>}
    </section>
  );
};
