import { useState, type FormEvent } from 'react';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { calculateCgpa } from '../../services/calcService';

const initialGrades = Array.from({ length: 4 }, () => ({ grade: '', credit: '' }));

export const CGPACalculator = () => {
  const [courses, setCourses] = useState(initialGrades);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleChange = (index: number, field: 'grade' | 'credit', value: string) => {
    setCourses((current) => current.map((course, idx) => (idx === index ? { ...course, [field]: value } : course)));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const grades = courses.map((course) => Number(course.grade));
    const credits = courses.map((course) => Number(course.credit));

    if (grades.some((value) => Number.isNaN(value)) || credits.some((value) => Number.isNaN(value))) {
      setError('All grade and credit fields must contain valid numbers.');
      return;
    }

    const cgpa = calculateCgpa(grades, credits);
    setResult(cgpa);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/10">
      <h2 className="text-xl font-semibold text-white">CGPA Calculator</h2>
      <p className="text-sm text-slate-400">Calculate your weighted CGPA from grade points and credit values.</p>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course, index) => (
            <div key={index} className="grid gap-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="text-sm font-semibold text-white">Course {index + 1}</p>
              <Input
                label="Grade point"
                value={course.grade}
                onChange={(event) => handleChange(index, 'grade', event.target.value)}
                placeholder="0 - 4"
              />
              <Input
                label="Credit hours"
                value={course.credit}
                onChange={(event) => handleChange(index, 'credit', event.target.value)}
                placeholder="0"
              />
            </div>
          ))}
        </div>
        <Button type="submit">Calculate CGPA</Button>
      </form>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {result !== null && <p className="text-lg font-semibold text-brand-100">CGPA: {result.toFixed(2)}</p>}
    </section>
  );
};
