import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Footer } from './Footer';
import { Header } from './Header';

export const MainLayout = () => (
  <div className="min-h-screen bg-slate-950 text-white">
    <Header />
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mx-auto max-w-7xl px-6 py-8 sm:px-8"
    >
      <Outlet />
    </motion.main>
    <Footer />
  </div>
);
