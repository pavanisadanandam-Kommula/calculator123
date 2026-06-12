import { motion } from 'framer-motion';

import { Card } from '../../components/ui/Card';

const pillars = [
  { title: 'Modular architecture', description: 'Component-driven structure for scaling and maintenance.' },
  { title: 'Type-safe design', description: 'Strong typing across inputs, services, and components.' },
  { title: 'Performance focused', description: 'Lazy loaded routes and minimal bundle overhead.' }
];

const About = () => (
  <section className="space-y-10">
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h1 className="text-4xl font-semibold text-white">About EngineerCalc Pro</h1>
      <p className="max-w-3xl text-slate-300 sm:text-lg">
        EngineerCalc Pro brings engineering-grade calculators into a polished, responsive product experience. Each tool is designed to reduce manual effort while improving calculation reliability.
      </p>
    </motion.div>

    <div className="grid gap-6 md:grid-cols-3">
      {pillars.map((item) => (
        <Card key={item.title} title={item.title} description={item.description}>
          <p className="text-slate-400">Professional development patterns for modern engineering apps.</p>
        </Card>
      ))}
    </div>
  </section>
);

export default About;
