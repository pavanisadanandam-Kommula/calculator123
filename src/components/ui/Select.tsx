import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export const Select = ({ label, className = '', children, ...props }: SelectProps) => (
  <label className="block text-sm font-medium text-slate-200">
    <span>{label}</span>
    <select
      {...props}
      className={`mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${className}`}
    >
      {children}
    </select>
  </label>
);
