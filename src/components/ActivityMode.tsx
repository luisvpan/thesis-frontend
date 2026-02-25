import { motion, AnimatePresence } from 'motion/react';
import { Volume2, CheckCircle2, XCircle, Play, Clock, Link, Sparkles } from 'lucide-react';
import { Piece, Connection } from '../App';
import { DraggablePiece } from './DraggablePiece';
import { useState } from 'react';

interface ActivityModeProps {
  pieces: Piece[];
  setPieces: (pieces: Piece[]) => void;
  connections: Connection[];
  setConnections: (connections: Connection[]) => void;
  showFeedback: 'success' | 'fail' | null;
  onExecute: () => void;
  isExecuting: boolean;
  output: any;
}

export function ActivityMode({
  pieces,
  setPieces,
  connections,
  setConnections,
  showFeedback,
  onExecute,
  isExecuting,
  output,
}: ActivityModeProps) {
  const [connectMode, setConnectMode] = useState(false);
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);

  const handleAddPiece = (type: 'number' | 'operation', value: string | number) => {
    const newPiece: Piece = {
      id: Math.random().toString(),
      type,
      value,
      x: Math.random() * 200 + 250,
      y: Math.random() * 150 + 150,
    };
    setPieces([...pieces, newPiece]);
  };

  const handleConnectClick = () => {
    setConnectMode(true);
    setSelectedPieces([]);
  };

  const handlePieceClick = (pieceId: string) => {
    if (!connectMode) return;

    const newSelected = [...selectedPieces, pieceId];
    setSelectedPieces(newSelected);

    if (newSelected.length === 2) {
      const conn: Connection = {
        id: Math.random().toString(),
        from: newSelected[0],
        to: newSelected[1],
        active: true,
      };
      setConnections([...connections, conn]);
      setConnectMode(false);
      setSelectedPieces([]);
    }
  };

  const cancelConnect = () => {
    setConnectMode(false);
    setSelectedPieces([]);
  };

  const hasEvenNumbersOnly = pieces
    .filter(p => p.type === 'number')
    .every(p => Number(p.value) % 2 === 0);

  const speakChallenge = () => {
    const utterance = new SpeechSynthesisUtterance('Suma las manzanas rojas');
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full h-full pt-16 px-8">
      {/* Mensaje de modo conexión */}
      {connectMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-1 shadow-2xl">
            <div className="bg-white rounded-xl px-8 py-4">
              <div className="text-2xl font-bold text-center mb-3 text-gray-800">
                {selectedPieces.length === 0 ? '🔗 Haz click en la primera pieza' : '✨ Haz click en la segunda pieza'}
              </div>
              <button
                onClick={cancelConnect}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
              >
                ✕ Cancelar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Área de trabajo principal */}
      <div className="relative rounded-3xl h-[calc(100vh-140px)] bg-white shadow-2xl border-4 border-gray-200 overflow-hidden">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
        
        {/* Panel de Reglas - Izquierda */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute left-6 top-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-1 shadow-xl w-64"
        >
          <div className="bg-white rounded-xl p-5">
            <div className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-4 pb-3 border-b-2 border-blue-200 text-center">
              📋 Reglas
            </div>
            
            <div className="space-y-3 text-sm">
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-1 shadow-md"
              >
                <div className="bg-white rounded-lg p-3">
                  <div className="font-bold text-green-700 text-center">¡Solo usa 2 números pares!</div>
                </div>
              </motion.div>
              
              {pieces.filter(p => p.type === 'number').length > 0 && !hasEvenNumbersOnly && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-r from-red-400 to-rose-500 rounded-xl p-1 shadow-md"
                >
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-bold text-red-700 text-center">¡Estás olvidando algo!</div>
                    <div className="text-xs text-red-600 mt-1 text-center">No cumples las reglas</div>
                  </div>
                </motion.div>
              )}

              {hasEvenNumbersOnly && pieces.filter(p => p.type === 'number').length === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-1 shadow-md"
                >
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-bold text-green-700 text-center text-lg">✓ ¡Bien hecho!</div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Panel Mochila - Centro-Izquierda */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute left-80 top-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-1 shadow-xl w-56"
        >
          <div className="bg-white rounded-xl p-5">
            <div className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 pb-3 border-b-2 border-purple-200 text-center">
              🎒 Mochila
            </div>
            
            <div className="space-y-3">
              {[1, 2].map((num) => (
                <div key={num} className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl transition-all shadow-md ${
                    pieces.filter(p => p.type === 'number').length >= num
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                  }`}>
                    {pieces.filter(p => p.type === 'number').length >= num ? <CheckCircle2 className="w-8 h-8" /> : '□'}
                  </div>
                  <span className="text-sm font-bold text-gray-700">Número</span>
                </div>
              ))}

              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl transition-all shadow-md ${
                  pieces.filter(p => p.type === 'operation').length >= 1
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                }`}>
                  {pieces.filter(p => p.type === 'operation').length >= 1 ? <CheckCircle2 className="w-8 h-8" /> : 'Σ'}
                </div>
                <span className="text-sm font-bold text-gray-700">Suma</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enunciado del reto - Superior centro */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-1 shadow-xl max-w-md"
        >
          <div className="bg-white rounded-xl px-8 py-4">
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 text-center">
              🍎 Suma las manzanas rojas
            </div>
          </div>
        </motion.div>

        {/* Controles superiores derecha */}
        <div className="absolute top-6 right-6 flex gap-3">
          <motion.button
            onClick={speakChallenge}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center hover:from-blue-600 hover:to-blue-700 shadow-lg border-2 border-blue-400"
          >
            <Volume2 className="w-7 h-7 drop-shadow-lg" />
          </motion.button>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg border-2 border-orange-300"
          >
            <Clock className="w-7 h-7 drop-shadow-lg" />
          </motion.div>
        </div>

        {/* Canvas de trabajo central */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {connections.map((conn) => {
            const fromPiece = pieces.find(p => p.id === conn.from);
            const toPiece = pieces.find(p => p.id === conn.to);
            
            if (!fromPiece || !toPiece) return null;

            const startX = fromPiece.x + 40;
            const startY = fromPiece.y + 40;
            const endX = toPiece.x + 40;
            const endY = toPiece.y + 40;
            
            return (
              <g key={conn.id}>
                <motion.line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="url(#redGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                {[0, 1, 2].map((i) => (
                  <circle key={i} r="6" fill="#fff" filter="url(#glow)">
                    <animate
                      attributeName="cx"
                      from={startX}
                      to={endX}
                      dur="2s"
                      repeatCount="indefinite"
                      begin={`${i * 0.66}s`}
                    />
                    <animate
                      attributeName="cy"
                      from={startY}
                      to={endY}
                      dur="2s"
                      repeatCount="indefinite"
                      begin={`${i * 0.66}s`}
                    />
                  </circle>
                ))}
              </g>
            );
          })}
        </svg>

        {/* Piezas arrastrables */}
        {pieces.map((piece) => (
          <DraggablePiece
            key={piece.id}
            piece={piece}
            onMove={(x, y) => {
              setPieces(
                pieces.map((p) =>
                  p.id === piece.id ? { ...p, x, y } : p
                )
              );
            }}
            onPieceClick={handlePieceClick}
            isSelected={selectedPieces.includes(piece.id)}
            isConnectMode={connectMode}
          />
        ))}

        {/* Visualización de salida - derecha */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute right-6 top-32 flex flex-col gap-4 items-end"
        >
          <div className="flex gap-3 text-6xl">
            <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🍎</motion.div>
            <motion.div animate={{ rotate: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>🍎</motion.div>
            <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>🍎</motion.div>
          </div>
          
          {output && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-1 shadow-2xl"
            >
              <div className="bg-white rounded-2xl p-6">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-emerald-600 text-center">
                  {output.value}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Botón Listo */}
        <motion.button
          onClick={onExecute}
          disabled={isExecuting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-10 py-5 rounded-2xl font-black text-2xl shadow-2xl border-2 border-blue-400 disabled:border-gray-400 transition-all flex items-center gap-3"
        >
          <Play className="w-8 h-8 drop-shadow-lg" fill="currentColor" />
          <span className="drop-shadow-lg">{isExecuting ? 'Procesando...' : 'Listo'}</span>
        </motion.button>

        {/* Feedback visual */}
        <AnimatePresence>
          {showFeedback === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, ease: 'linear' }}
                  className="text-9xl"
                >
                  ⭐
                </motion.div>
              </motion.div>

              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-6xl z-50 pointer-events-none"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 12) * 400,
                    y: Math.sin((i * Math.PI * 2) / 12) * 400,
                    opacity: 0,
                    scale: 0.5,
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                  {i % 2 === 0 ? '🎉' : '✨'}
                </motion.div>
              ))}
            </>
          )}

          {showFeedback === 'fail' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -5, 5, -5, 0] }}
              exit={{ scale: 0 }}
              transition={{ rotate: { duration: 0.5 } }}
              className="absolute bottom-6 right-40 bg-gradient-to-br from-red-400 to-rose-500 rounded-full p-4 shadow-2xl z-50 border-4 border-white"
            >
              <XCircle className="w-16 h-16 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel de piezas disponibles - para testing */}
        <div className="absolute left-6 bottom-6 flex gap-3">
          {[2, 6].map((num) => (
            <motion.button
              key={num}
              onClick={() => handleAddPiece('number', num)}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg text-2xl font-black text-white border-2 border-blue-300"
            >
              {num}
            </motion.button>
          ))}
          <motion.button
            onClick={() => handleAddPiece('operation', '+')}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg text-2xl font-black text-white border-2 border-purple-300"
          >
            +
          </motion.button>
          <motion.button
            onClick={handleConnectClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${ 
              connectMode 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white border-2 border-yellow-300' 
                : 'bg-gradient-to-br from-red-400 to-red-600 text-white border-2 border-red-300'
            }`}
          >
            <Link className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
