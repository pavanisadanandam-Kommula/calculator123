import { useState, type FormEvent } from 'react';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { isNumber } from '../../utils/validators';

export const EngineeringCalculator = () => {
  const [mass, setMass] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!isNumber(mass) || !isNumber(acceleration)) {
      setError('Mass and acceleration must be valid numbers.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const value = Number(mass) * Number(acceleration);
      setResult(value);
      setLoading(false);
    }, 300);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/10">
      <h2 className="text-xl font-semibold text-white">Engineering Calculator</h2>
      <p className="text-sm text-slate-400">Calculate force using F = m · a with mass in kilograms and acceleration in m/s².</p>
      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
        <Input label="Mass (kg)" value={mass} onChange={(event) => setMass(event.target.value)} placeholder="0" />
        <Input label="Acceleration (m/s²)" value={acceleration} onChange={(event) => setAcceleration(event.target.value)} placeholder="0" />
        <div className="sm:col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Compute Force'}
          </Button>
        </div>
      </form>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {result !== null && <p className="text-lg font-semibold text-brand-100">Force: {result} N</p>}
    </section>
  );
};
