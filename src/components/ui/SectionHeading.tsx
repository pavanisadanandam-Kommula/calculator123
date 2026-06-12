interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export const SectionHeading = ({ title, subtitle }: SectionHeadingProps) => (
  <div className="space-y-2">
    <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
    {subtitle ? <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">{subtitle}</p> : null}
  </div>
);
