import { useState, type FormEvent } from 'react';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { convertLength } from '../../services/calcService';
import { isNumber } from '../../utils/validators';

const units = ['meters', 'kilometers', 'miles', 'feet'] as const;

export const UnitConverter = () => {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<typeof units[number]>('meters');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!isNumber(value)) {
      setError('Provide a valid numeric value to convert.');
      return;
    }

    const converted = convertLength(Number(value), unit);
    setResult(converted);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/10">
      <h2 className="text-xl font-semibold text-white">Unit Converter</h2>
      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-[1fr_0.8fr]">
        <Input label="Value" value={value} onChange={(event) => setValue(event.target.value)} placeholder="0" />
        <label className="block text-sm font-medium text-slate-200">
          Unit
          <select
            value={unit}
            onChange={(event) => setUnit(event.target.value as typeof units[number])}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            {units.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit">Convert</Button>
        </div>
      </form>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {result !== null && <p className="text-lg font-semibold text-brand-100">Converted value: {result}</p>}
    </section>
  );
};
