import { motion } from 'motion/react';
import { Piece } from '../App';

interface DraggablePieceProps {
  piece: Piece;
  onMove: (x: number, y: number) => void;
  onPieceClick: (pieceId: string) => void;
  isSelected: boolean;
  isConnectMode: boolean;
}

export function DraggablePiece({ piece, onMove, onPieceClick, isSelected, isConnectMode }: DraggablePieceProps) {
  const renderContent = () => {
    if (piece.type === 'number') {
      return <div className="text-4xl font-black drop-shadow-lg">△</div>;
    }
    if (piece.value === '+') {
      return <div className="text-3xl font-black drop-shadow-lg">Σ</div>;
    }
    if (piece.value === '∞') {
      return <div className="text-3xl font-black drop-shadow-lg">∞</div>;
    }
    return <div className="text-2xl font-black drop-shadow-lg">{piece.value}</div>;
  };

  const handleClick = () => {
    if (isConnectMode) {
      onPieceClick(piece.id);
    }
  };

  const getBorderColor = () => {
    if (isSelected) return 'from-yellow-400 to-orange-400';
    if (piece.type === 'number') return 'from-blue-400 to-cyan-500';
    return 'from-purple-400 to-pink-500';
  };

  return (
    <motion.div
      drag={!isConnectMode}
      dragMomentum={false}
      onDragEnd={(e, info) => {
        onMove(piece.x + info.offset.x, piece.y + info.offset.y);
      }}
      onClick={handleClick}
      className={`absolute z-20 ${isConnectMode ? 'cursor-pointer' : 'cursor-move'}`}
      style={{
        left: piece.x,
        top: piece.y,
      }}
      whileHover={{ scale: 1.1, rotate: isConnectMode ? 0 : 5 }}
      whileDrag={{ scale: 1.2, zIndex: 100, rotate: 10 }}
      animate={isSelected ? { scale: 1.15, rotate: [0, -5, 5, -5, 0] } : { scale: 1, rotate: 0 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      <div className={`bg-gradient-to-br ${getBorderColor()} rounded-2xl p-1 shadow-xl hover:shadow-2xl transition-all`}>
        <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center">
          {renderContent()}
        </div>
      </div>
      
      {/* Indicador de selección */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-xl font-black border-3 border-white shadow-lg"
        >
          <span className="drop-shadow-lg text-white">1</span>
        </motion.div>
      )}

      {/* Efecto de brillo cuando está en modo conectar */}
      {isConnectMode && !isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-400/0 rounded-2xl"
          animate={{
            background: [
              'linear-gradient(to bottom right, rgba(250, 204, 21, 0), rgba(251, 146, 60, 0))',
              'linear-gradient(to bottom right, rgba(250, 204, 21, 0.3), rgba(251, 146, 60, 0.3))',
              'linear-gradient(to bottom right, rgba(250, 204, 21, 0), rgba(251, 146, 60, 0))',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}