import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Card } from '../../components/ui/Card';
import { PerformanceChart } from '../../components/charts/PerformanceChart';

const dashboards = [
  { title: 'Basic Calculator', description: 'Quick arithmetic calculations.', path: '/dashboard' },
  { title: 'Scientific Calculator', description: 'Trigonometry and powers.', path: '/dashboard' },
  { title: 'Engineering Tools', description: 'Beam, load, and circuit support.', path: '/dashboard' },
  { title: 'Matrix Solver', description: '2x2 matrix operations.', path: '/dashboard' }
];

const Dashboard = () => (
  <section className="space-y-10">
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
      <p className="max-w-3xl text-slate-300 sm:text-lg">Access all calculator modules from one central dashboard. Each tool includes validation, loading states, and responsive UI.</p>
    </motion.div>

    <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          {dashboards.map((item) => (
            <Card key={item.title} title={item.title} description={item.description}>
              <p className="text-slate-400">{item.description}</p>
              <Link className="mt-4 inline-block text-sm font-semibold text-brand-300 hover:text-white" to={item.path}>
                Open module
              </Link>
            </Card>
          ))}
        </div>
        <Card title="Trusted for engineering" description="Built for practical workflows in technical environments.">
          <p className="text-slate-400">Use this space to evaluate values, convert units, and quickly compare results.</p>
        </Card>
      </div>
      <PerformanceChart />
    </div>
  </section>
);

export default Dashboard;
