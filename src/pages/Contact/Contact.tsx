import { type FormEvent } from 'react';
import { motion } from 'framer-motion';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useFormInput } from '../../hooks/useFormInput';

const Contact = () => {
  const name = useFormInput('');
  const email = useFormInput('');
  const message = useFormInput('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-black/10">
        <div>
          <h1 className="text-4xl font-semibold text-white">Contact support</h1>
          <p className="mt-3 text-slate-300">Reach out for technical questions or development feedback.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Name" placeholder="Jane Doe" {...name.bind} />
          <Input label="Email" placeholder="jane@example.com" type="email" {...email.bind} />
          <label className="block text-sm font-medium text-slate-200">
            Message
            <textarea
              {...message.bind}
              rows={5}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              placeholder="How can we help you?"
            />
          </label>
          <Button type="submit">Send message</Button>
        </form>
      </div>
      <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-black/10">
        <h2 className="text-2xl font-semibold text-white">Need help fast?</h2>
        <p className="text-slate-400">Use the dashboard to access calculators directly and troubleshoot with real-time validation.</p>
        <dl className="grid gap-4 text-sm text-slate-300">
          <div>
            <dt className="font-semibold text-white">Email</dt>
            <dd>support@engineercalcpro.io</dd>
          </div>
          <div>
            <dt className="font-semibold text-white">Response time</dt>
            <dd>Within 1 business day</dd>
          </div>
          <div>
            <dt className="font-semibold text-white">Status</dt>
            <dd>Available</dd>
          </div>
        </dl>
      </div>
    </motion.section>
  );
};

export default Contact;
