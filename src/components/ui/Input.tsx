import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export const Input = ({ label, helperText, error, className = '', ...props }: InputProps) => (
  <label className="block text-sm font-medium text-slate-200">
    <span>{label}</span>
    <input
      {...props}
      className={`mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${className}`}
    />
    {helperText && <p className="mt-2 text-xs text-slate-500">{helperText}</p>}
    {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
  </label>
);
