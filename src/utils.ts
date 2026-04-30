import { GRID_SIZE, BlockShape } from './constants';

export type BoardState = (string | null)[][]; // Board contains hex colors or null

export const createEmptyBoard = (): BoardState => 
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

export const canPlaceBlock = (
  board: BoardState,
  shape: number[][],
  row: number,
  col: number
): boolean => {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        const targetRow = row + r;
        const targetCol = col + c;

        // Out of bounds
        if (
          targetRow < 0 ||
          targetRow >= GRID_SIZE ||
          targetCol < 0 ||
          targetCol >= GRID_SIZE
        ) {
          return false;
        }

        // Cell is already occupied
        if (board[targetRow][targetCol] !== null) {
          return false;
        }
      }
    }
  }
  return true;
};

export const placeBlock = (
  board: BoardState,
  shape: number[][],
  row: number,
  col: number,
  color: string
): BoardState => {
  const newBoard = board.map(r => [...r]);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        newBoard[row + r][col + c] = color;
      }
    }
  }
  return newBoard;
};

export const findLinesToClear = (board: BoardState) => {
  const rowsToClear: number[] = [];
  const colsToClear: number[] = [];

  // Check rows
  for (let r = 0; r < GRID_SIZE; r++) {
    if (board[r].every(cell => cell !== null)) {
      rowsToClear.push(r);
    }
  }

  // Check columns
  for (let c = 0; c < GRID_SIZE; c++) {
    let full = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (board[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) {
      colsToClear.push(c);
    }
  }

  return { rowsToClear, colsToClear };
};

export const clearLines = (
  board: BoardState,
  rowsToClear: number[],
  colsToClear: number[]
): BoardState => {
  const newBoard = board.map(r => [...r]);

  rowsToClear.forEach(r => {
    for (let c = 0; c < GRID_SIZE; c++) {
      newBoard[r][c] = null;
    }
  });

  colsToClear.forEach(c => {
    for (let r = 0; r < GRID_SIZE; r++) {
      newBoard[r][c] = null;
    }
  });

  return newBoard;
};

export const isGameOver = (board: BoardState, remainingBlocks: BlockShape[]): boolean => {
  if (remainingBlocks.length === 0) return false;

  for (const block of remainingBlocks) {
    for (let r = 0; r <= GRID_SIZE - block.shape.length; r++) {
      for (let c = 0; c <= GRID_SIZE - block.shape[0].length; c++) {
        if (canPlaceBlock(board, block.shape, r, c)) {
          return false;
        }
      }
    }
  }

  return true;
};
