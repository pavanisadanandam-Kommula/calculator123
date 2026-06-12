import { motion } from 'framer-motion';

const data = [75, 88, 62, 92, 81, 70];

export const PerformanceChart = () => (
  <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-brand-200">Overview</p>
        <h3 className="text-xl font-semibold text-white">Monthly performance</h3>
      </div>
      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">Live</span>
    </div>
    <div className="grid gap-4">
      {data.map((value, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Task {index + 1}</span>
            <span>{value}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full rounded-full bg-brand-500"
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.7, delay: index * 0.05 }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);
