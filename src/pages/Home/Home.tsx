import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Card } from '../../components/ui/Card';

const features = [
  { title: 'Advanced calculators', label: 'Engineering, matrix, statistics, CGPA' },
  { title: 'Fast performance', label: 'Optimized with React and lazy loading' },
  { title: 'Responsive design', label: 'Mobile-first layouts with Tailwind CSS' }
];

const calculators = [
  { path: '/dashboard', label: 'Explore calculators' },
  { path: '/about', label: 'Learn more' },
  { path: '/contact', label: 'Contact support' }
];

const Home = () => (
  <section className="space-y-10">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="space-y-6">
        <span className="inline-flex rounded-full bg-brand-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-100">
          EngineerCalc Pro
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
          The professional engineering calculator suite for modern workflows.
        </h1>
        <p className="max-w-2xl text-slate-300 sm:text-lg">
          Build, evaluate, and convert with precision using modular calculators for engineering, matrix analysis, statistics, unit conversion, and CGPA tracking.
        </p>
        <div className="flex flex-wrap gap-4">
          {calculators.map((item) => (
            <Link key={item.label} to={item.path} className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid gap-4">
        {features.map((feature) => (
          <Card key={feature.title} title={feature.title} description={feature.label}>
            <p className="text-slate-400">{feature.label}</p>
          </Card>
        ))}
      </div>
    </motion.div>

    <div className="grid gap-6 md:grid-cols-3">
      {['Basic', 'Scientific', 'Engineering', 'Matrix', 'Statistics', 'Converter'].map((item) => (
        <motion.div
          key={item}
          whileHover={{ y: -4 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-center"
        >
          <h2 className="text-lg font-semibold text-white">{item}</h2>
          <p className="mt-2 text-sm text-slate-400">Designed for accuracy and usability across complex calculations.</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Home;
