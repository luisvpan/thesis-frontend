import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FlaskConical, Gamepad2, GitBranch } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 flex flex-col items-center justify-center p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black text-white mb-2 text-center"
      >
        Elige un modo
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-slate-400 text-lg mb-12 text-center"
      >
        Sandbox para explorar o Jugar para practicar
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg flex-wrap justify-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex-1 min-w-[200px]"
        >
          <Link to="/dataflow" className="block">
            <motion.button
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl p-8 shadow-xl shadow-blue-500/20 border border-blue-400/30 flex flex-col items-center gap-4"
            >
              <GitBranch className="w-14 h-14" />
              <span className="text-2xl font-bold">Dataflow</span>
              <span className="text-blue-100/90 text-sm">Sumas y restas con cartas</span>
            </motion.button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 min-w-[200px]"
        >
          <Link to="/sandbox" className="block">
            <motion.button
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl p-8 shadow-xl shadow-amber-500/20 border border-amber-400/30 flex flex-col items-center gap-4"
            >
              <FlaskConical className="w-14 h-14" />
              <span className="text-2xl font-bold">Modo Sandbox</span>
              <span className="text-amber-100/90 text-sm">Explora y experimenta libremente</span>
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 min-w-[200px]"
        >
          <Link to="/jugar" className="block">
            <motion.button
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl p-8 shadow-xl shadow-emerald-500/20 border border-emerald-400/30 flex flex-col items-center gap-4"
            >
              <Gamepad2 className="w-14 h-14" />
              <span className="text-2xl font-bold">Modo Jugar</span>
              <span className="text-emerald-100/90 text-sm">Actividades y retos</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
