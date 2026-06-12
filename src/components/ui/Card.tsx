import { ReactNode } from 'react';

interface CardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const Card = ({ title, description, children }: CardProps) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/10">
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
    </div>
    {children}
  </section>
);
