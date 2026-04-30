import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, BlockShape } from '../constants';
import { BoardState, canPlaceBlock } from '../utils';
import { Trophy, RefreshCw, Star } from 'lucide-react';

interface GameUIProps {
  board: BoardState;
  currentBlocks: BlockShape[];
  score: number;
  highScore: number;
  status: 'playing' | 'gameover';
  combo: number;
  showCombo: boolean;
  onPlace: (blockId: string, row: number, col: number) => boolean;
  onReset: () => void;
}

const CELL_SIZE = 40; // Base cell size
const GAP = 4;

const ComboEffect: React.FC<{ combo: number; show: boolean }> = ({ combo, show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.5 }}
        animate={{ opacity: 1, y: -40, scale: 1 }}
        exit={{ opacity: 0, scale: 1.5 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <div className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-2xl shadow-2xl border-2 border-white italic uppercase tracking-tighter">
          {combo}x BLAST!
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const GameUI: React.FC<GameUIProps> = ({
  board,
  currentBlocks,
  score,
  highScore,
  status,
  combo,
  showCombo,
  onPlace,
  onReset,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [draggingBlock, setDraggingBlock] = useState<BlockShape | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (event: any, info: any) => {
    const element = event.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    setDragOffset({
      x: info.point.x - rect.left,
      y: info.point.y - rect.top,
    });
  };

  const handleDrag = (event: any, info: any, block: BlockShape) => {
    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const x = info.point.x - dragOffset.x - boardRect.left;
    const y = info.point.y - dragOffset.y - boardRect.top;

    const col = Math.round(x / (CELL_SIZE + GAP));
    const row = Math.round(y / (CELL_SIZE + GAP));

    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      if (canPlaceBlock(board, block.shape, row, col)) {
        setHoveredCell({ row, col });
        setDraggingBlock(block);
      } else {
        setHoveredCell(null);
        setDraggingBlock(null);
      }
    } else {
      setHoveredCell(null);
      setDraggingBlock(null);
    }
  };

  const handleDragEnd = (event: any, info: any, block: BlockShape) => {
    if (hoveredCell) {
      onPlace(block.id, hoveredCell.row, hoveredCell.col);
    }
    setHoveredCell(null);
    setDraggingBlock(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-50 font-sans select-none overflow-hidden max-w-6xl mx-auto border-x-8 border-slate-200">
      {/* Header */}
      <header className="w-full pt-12 px-12 flex justify-between items-end mb-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-5xl font-black text-slate-800 tracking-tighter uppercase italic">
            BLOCK<span className="text-indigo-600">BLAST</span>
          </h1>
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            Minimalist Edition
          </span>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Score</span>
            <span className="text-4xl font-mono font-bold text-slate-800">{highScore}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Current</span>
            <span className="text-6xl font-mono font-bold text-indigo-600 leading-none">{score}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex items-start justify-center gap-24 px-12">
        {/* Game Board */}
        <div className="relative">
          <ComboEffect combo={combo} show={showCombo} />
          <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">
            <div 
              ref={boardRef}
              className="bg-slate-100 p-3 rounded-2xl"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE + 4}px)`,
                gap: `${GAP}px`
              }}
            >
              {board.map((rowArr, rowIndex) => 
                rowArr.map((cell, colIndex) => {
                  let isPreview = false;
                  if (draggingBlock && hoveredCell) {
                    const r = rowIndex - hoveredCell.row;
                    const c = colIndex - hoveredCell.col;
                    if (r >= 0 && r < draggingBlock.shape.length && c >= 0 && c < draggingBlock.shape[0].length) {
                      if (draggingBlock.shape[r][c] === 1) isPreview = true;
                    }
                  }

                  return (
                    <div 
                      key={`${rowIndex}-${colIndex}`}
                      className="rounded-lg transition-colors duration-150"
                      style={{
                        width: CELL_SIZE + 4,
                        height: CELL_SIZE + 4,
                        backgroundColor: cell ? cell : (isPreview ? `${draggingBlock?.color}40` : '#e2e8f0'), // slate-200
                        boxShadow: cell ? 'inset 0 -4px 0 rgba(0,0,0,0.1)' : 'none',
                        border: isPreview ? `3px solid ${draggingBlock?.color}` : 'none'
                      }}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Side Options */}
        <div className="flex flex-col gap-10 w-72">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 block border-b border-slate-100 pb-2">
              Next Moves
            </span>
            <div className="flex flex-col gap-12 items-center min-h-[300px]">
              <AnimatePresence mode="popLayout">
                {currentBlocks.map((block) => (
                  <motion.div
                    id={block.id}
                    key={block.id}
                    drag
                    dragSnapToOrigin
                    onDragStart={handleDragStart}
                    onDrag={(e, i) => handleDrag(e, i, block)}
                    onDragEnd={(e, i) => handleDragEnd(e, i, block)}
                    whileDrag={{ scale: 1.1, zIndex: 100 }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="cursor-pointer active:cursor-grabbing touch-none flex justify-center w-full"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${block.shape[0].length}, ${CELL_SIZE * 0.7}px)`,
                      gap: `${GAP * 0.7}px`
                    }}
                  >
                    {block.shape.map((row, r) => 
                      row.map((cell, c) => (
                        <div 
                          key={`${r}-${c}`}
                          className="rounded-md"
                          style={{
                            width: CELL_SIZE * 0.7,
                            height: CELL_SIZE * 0.7,
                            backgroundColor: cell === 1 ? block.color : 'transparent',
                            boxShadow: cell === 1 ? 'inset 0 -3px 0 rgba(0,0,0,0.1)' : 'none'
                          }}
                        />
                      ))
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <button 
            onClick={onReset}
            className="w-full py-5 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center justify-center gap-3 italic"
          >
            <RefreshCw size={20} />
            Reset Game
          </button>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="w-full pb-12 px-12 flex justify-center gap-16 text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-300"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Pause [ESC]</span>
        </div>
        <div className="flex items-center gap-2 text-slate-800">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Zen Mode</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-300"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Sfx On</span>
        </div>
      </footer>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {status === 'gameover' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-12 rounded-[3rem] shadow-3xl max-w-md w-full text-center border border-slate-100"
            >
              <div className="flex justify-center mb-6">
                <div className="p-5 bg-rose-50 rounded-full text-rose-500">
                  <Star size={64} fill="currentColor" />
                </div>
              </div>
              <h2 className="text-5xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">
                FINISH<span className="text-rose-500">LINE</span>
              </h2>
              <p className="text-slate-400 mb-10 font-bold uppercase tracking-widest text-xs">No more moves possible!</p>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="flex flex-col items-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Score</span>
                  <span className="text-4xl font-mono font-bold text-slate-800">{score}</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                  <span className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest mb-1">Best</span>
                  <span className="text-4xl font-mono font-bold text-indigo-600">{highScore}</span>
                </div>
              </div>

              <button 
                onClick={onReset}
                className="w-full py-6 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 text-xl uppercase tracking-widest italic"
              >
                <RefreshCw size={24} />
                Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
