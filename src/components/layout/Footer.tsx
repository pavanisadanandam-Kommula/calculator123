export const Footer = () => (
  <footer className="border-t border-slate-800/80 bg-slate-950/95 p-6 text-slate-400 sm:px-8">
    <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm sm:flex-row sm:justify-between">
      <p>© {new Date().getFullYear()} EngineerCalc Pro. Built with React, TypeScript, Tailwind CSS, and Framer Motion.</p>
      <p>Deployed-ready with Vercel configuration.</p>
    </div>
  </footer>
);
