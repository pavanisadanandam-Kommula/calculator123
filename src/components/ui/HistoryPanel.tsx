import { HistoryEntry } from '../../types';

interface HistoryPanelProps {
  title: string;
  history: HistoryEntry[];
  onClear: () => void;
}

export const HistoryPanel = ({ title, history, onClear }: HistoryPanelProps) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-glass">
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-brand-300">History</p>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:border-brand-500 hover:text-white"
      >
        Clear
      </button>
    </div>

    {history.length === 0 ? (
      <p className="text-sm text-slate-400">No recent calculations yet.</p>
    ) : (
      <ul className="space-y-3">
        {history.map((item) => (
          <li key={item.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{item.timestamp}</p>
                <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
              </div>
              <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-200">
                Result
              </span>
            </div>
            <p className="mt-3 text-slate-200">{item.description}</p>
            <p className="mt-2 text-lg font-semibold text-brand-100">{item.result}</p>
          </li>
        ))}
      </ul>
    )}
  </section>
);
