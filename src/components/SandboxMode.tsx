import { motion } from 'motion/react';
import { Piece, Connection } from '../App';
import { DraggablePiece } from './DraggablePiece';
import { Play, Link } from 'lucide-react';
import { useState } from 'react';

interface SandboxModeProps {
  pieces: Piece[];
  setPieces: (pieces: Piece[]) => void;
  connections: Connection[];
  setConnections: (connections: Connection[]) => void;
  onExecute: () => void;
  isExecuting: boolean;
  output: any;
}

export function SandboxMode({
  pieces,
  setPieces,
  connections,
  setConnections,
  onExecute,
  isExecuting,
  output,
}: SandboxModeProps) {
  const [connectMode, setConnectMode] = useState(false);
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);

  const handleAddPiece = (type: 'number' | 'operation', value: string | number) => {
    const newPiece: Piece = {
      id: Math.random().toString(),
      type,
      value,
      x: Math.random() * 200 + 150,
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
      // Crear conexión
      const conn: Connection = {
        id: Math.random().toString(),
        from: newSelected[0],
        to: newSelected[1],
        active: true,
      };
      setConnections([...connections, conn]);
      
      // Resetear modo de conexión
      setConnectMode(false);
      setSelectedPieces([]);
    }
  };

  const cancelConnect = () => {
    setConnectMode(false);
    setSelectedPieces([]);
  };

  return (
    <div className="w-full h-full pt-16 px-8">
      {/* Mensaje motivacional */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-1 mb-6 shadow-xl"
      >
        <div className="bg-white rounded-xl p-6">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-center">
            ✨ ¡Haz lo que quieras! Deja fluir tu imaginación! ✨
          </h1>
        </div>
      </motion.div>

      {/* Mensaje de modo conexión */}
      {connectMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-28 left-1/2 -translate-x-1/2 z-50"
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
      <div className="relative rounded-3xl h-[calc(100vh-220px)] bg-white shadow-2xl border-4 border-gray-200 overflow-hidden">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />

        {/* Canvas de trabajo */}
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
                {/* Sombra de la línea */}
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
                {/* Línea principal con gradiente */}
                <motion.line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="url(#blueGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                {/* Partículas brillantes fluyendo */}
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
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
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

        {/* Área de salida - parte superior derecha */}
        {output && (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="absolute top-6 right-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-1 shadow-2xl"
          >
            <div className="bg-white rounded-2xl p-8 min-w-[220px]">
              <div className="text-sm font-bold text-gray-500 mb-2 text-center">RESULTADO</div>
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-emerald-600 mb-3 text-center">
                {output.value}
              </div>
              <div className="text-4xl text-center leading-relaxed">{output.visual}</div>
            </div>
          </motion.div>
        )}

        {/* Panel de piezas disponibles - lado izquierdo */}
        <div className="absolute left-6 top-6 flex flex-col gap-4">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-1 shadow-xl"
          >
            <div className="bg-white rounded-xl p-3">
              <div className="text-xs font-bold text-gray-600 mb-3 text-center uppercase tracking-wide">Números</div>
              <div className="flex flex-col gap-3">
                {[2, 4, 6].map((num, i) => (
                  <motion.button
                    key={num}
                    onClick={() => handleAddPiece('number', num)}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center text-3xl font-bold text-white border-2 border-blue-300 transition-all"
                  >
                    <div className="drop-shadow-lg">△</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-1 shadow-xl"
          >
            <div className="bg-white rounded-xl p-3">
              <div className="text-xs font-bold text-gray-600 mb-3 text-center uppercase tracking-wide">Operaciones</div>
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={() => handleAddPiece('operation', '+')}
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center text-3xl font-bold text-white border-2 border-purple-300 transition-all"
                >
                  <div className="drop-shadow-lg">Σ</div>
                </motion.button>
                <motion.button
                  onClick={() => handleAddPiece('operation', '∞')}
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center text-3xl font-bold text-white border-2 border-pink-300 transition-all"
                >
                  <div className="drop-shadow-lg">∞</div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.button
            onClick={handleConnectClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`w-20 h-20 rounded-2xl font-bold transition-all flex flex-col items-center justify-center gap-1 shadow-xl ${
              connectMode 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white border-2 border-yellow-300 shadow-yellow-300/50' 
                : 'bg-gradient-to-br from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 border-2 border-green-300'
            }`}
          >
            <Link className="w-8 h-8 drop-shadow-lg" />
            <span className="text-xs drop-shadow-lg">Conectar</span>
          </motion.button>
        </div>

        {/* Botón de ejecutar - esquina inferior derecha */}
        <motion.button
          onClick={onExecute}
          disabled={isExecuting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-10 py-5 rounded-2xl font-black text-2xl shadow-2xl flex items-center gap-4 border-2 border-green-400 disabled:border-gray-400 transition-all"
        >
          <Play className="w-8 h-8 drop-shadow-lg" fill="currentColor" />
          <span className="drop-shadow-lg">{isExecuting ? 'Procesando...' : 'Ejecutar'}</span>
        </motion.button>
      </div>
    </div>
  );
}