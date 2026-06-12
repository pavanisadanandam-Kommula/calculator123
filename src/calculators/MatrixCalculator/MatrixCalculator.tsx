import { useState, type FormEvent } from 'react';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { determinant2x2 } from '../../services/calcService';
import { isNumber } from '../../utils/validators';

export const MatrixCalculator = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (![a, b, c, d].every(isNumber)) {
      setError('All matrix entries must be numeric.');
      return;
    }

    const value = determinant2x2(Number(a), Number(b), Number(c), Number(d));
    setResult(value);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/10">
      <h2 className="text-xl font-semibold text-white">Matrix Calculator</h2>
      <p className="text-sm text-slate-400">Compute the determinant of a 2x2 matrix quickly.</p>
      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
        <Input label="A" value={a} onChange={(event) => setA(event.target.value)} placeholder="a" />
        <Input label="B" value={b} onChange={(event) => setB(event.target.value)} placeholder="b" />
        <Input label="C" value={c} onChange={(event) => setC(event.target.value)} placeholder="c" />
        <Input label="D" value={d} onChange={(event) => setD(event.target.value)} placeholder="d" />
        <div className="sm:col-span-2">
          <Button type="submit">Calculate Determinant</Button>
        </div>
      </form>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {result !== null && <p className="text-lg font-semibold text-brand-100">Determinant: {result}</p>}
    </section>
  );
};
