import { useState, type FormEvent } from 'react';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { calculateMean, calculateMedian, calculateStdDev } from '../../services/calcService';
import { parseNumberArray } from '../../utils/validators';

export const StatisticsCalculator = () => {
  const [values, setValues] = useState('');
  const [mean, setMean] = useState<number | null>(null);
  const [median, setMedian] = useState<number | null>(null);
  const [stdDev, setStdDev] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const parsed = parseNumberArray(values);
    if (parsed.length === 0) {
      setError('Enter a valid comma-separated list of numbers.');
      return;
    }

    setMean(calculateMean(parsed));
    setMedian(calculateMedian(parsed));
    setStdDev(calculateStdDev(parsed));
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/10">
      <h2 className="text-xl font-semibold text-white">Statistics Calculator</h2>
      <p className="text-sm text-slate-400">Compute mean, median, and standard deviation from a numeric series.</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Values"
          placeholder="12, 18, 24, 30"
          value={values}
          onChange={(event) => setValues(event.target.value)}
          helperText="Comma-separated numbers are supported."
        />
        <Button type="submit">Analyze data</Button>
      </form>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {mean !== null && (
        <div className="grid gap-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-slate-200">
          <p>Mean: {mean.toFixed(4)}</p>
          <p>Median: {median?.toFixed(4)}</p>
          <p>Standard deviation: {stdDev?.toFixed(4)}</p>
        </div>
      )}
    </section>
  );
};
