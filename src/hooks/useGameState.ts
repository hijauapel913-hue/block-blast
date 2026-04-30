import { useState, useCallback, useEffect } from 'react';
import { GRID_SIZE, SHAPES, BlockShape } from '../constants';
import { 
  BoardState, 
  createEmptyBoard, 
  canPlaceBlock, 
  placeBlock, 
  findLinesToClear, 
  clearLines, 
  isGameOver 
} from '../utils';

export const useGameState = () => {
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentBlocks, setCurrentBlocks] = useState<BlockShape[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('blockBlast_highScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [status, setStatus] = useState<'playing' | 'gameover'>('playing');

  const generateNewBlocks = useCallback(() => {
    const newBlocks: BlockShape[] = Array.from({ length: 3 }, () => {
      const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      return {
        ...randomShape,
        id: crypto.randomUUID(),
      };
    });
    setCurrentBlocks(newBlocks);
  }, []);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setStatus('playing');
    generateNewBlocks();
  }, [generateNewBlocks]);

  useEffect(() => {
    generateNewBlocks();
  }, [generateNewBlocks]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('blockBlast_highScore', score.toString());
    }
  }, [score, highScore]);

  const [combo, setCombo] = useState<number>(0);
  const [showCombo, setShowCombo] = useState(false);

  const attemptPlacement = (blockId: string, row: number, col: number) => {
    if (status === 'gameover') return false;

    const block = currentBlocks.find(b => b.id === blockId);
    if (!block) return false;

    if (canPlaceBlock(board, block.shape, row, col)) {
      let newBoard = placeBlock(board, block.shape, row, col, block.color);
      
      const { rowsToClear, colsToClear } = findLinesToClear(newBoard);
      const linesCleared = rowsToClear.length + colsToClear.length;
      
      if (linesCleared > 0) {
        // Scoring: 10 per block placed + multiplier for lines
        const lineScore = (linesCleared * (linesCleared + 1) / 2) * 100;
        setScore(s => s + lineScore);
        newBoard = clearLines(newBoard, rowsToClear, colsToClear);

        if (linesCleared > 1) {
          setCombo(linesCleared);
          setShowCombo(true);
          setTimeout(() => setShowCombo(false), 2000);
        }
      }

      // 10 points for each unit of the block
      const blocksPlacedUnits = block.shape.flat().filter(x => x === 1).length;
      setScore(s => s + (blocksPlacedUnits * 10));

      const nextBlocks = currentBlocks.filter(b => b.id !== blockId);
      
      if (nextBlocks.length === 0) {
        generateNewBlocks();
      } else {
        setCurrentBlocks(nextBlocks);
        // Check if game over with remaining blocks
        if (isGameOver(newBoard, nextBlocks)) {
          setStatus('gameover');
        }
      }

      setBoard(newBoard);
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (currentBlocks.length > 0 && isGameOver(board, currentBlocks)) {
      setStatus('gameover');
    }
  }, [board, currentBlocks]);

  return {
    board,
    currentBlocks,
    score,
    highScore,
    status,
    combo,
    showCombo,
    attemptPlacement,
    resetGame,
  };
};
