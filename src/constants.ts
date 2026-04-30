export const GRID_SIZE = 8;

export type BlockShape = {
  id: string;
  shape: number[][]; // 2D array representing the occupied cells (1 for block, 0 for empty)
  color: string;
};

export const SHAPES: Omit<BlockShape, 'id'>[] = [
  // 1x1
  { shape: [[1]], color: '#fb7185' }, // rose-400
  // 1x2
  { shape: [[1, 1]], color: '#818cf8' }, // indigo-400
  // 2x1
  { shape: [[1], [1]], color: '#818cf8' },
  // 1x3
  { shape: [[1, 1, 1]], color: '#2dd4bf' }, // teal-400
  // 3x1
  { shape: [[1], [1], [1]], color: '#2dd4bf' },
  // 1x4
  { shape: [[1, 1, 1, 1]], color: '#fbbf24' }, // amber-400
  // 4x1
  { shape: [[1], [1], [1], [1]], color: '#fbbf24' },
  // 1x5
  { shape: [[1, 1, 1, 1, 1]], color: '#a78bfa' }, // violet-400
  // 5x1
  { shape: [[1], [1], [1], [1], [1]], color: '#a78bfa' },
  // 2x2 Square
  { shape: [[1, 1], [1, 1]], color: '#818cf8' },
  // 3x3 Square
  { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], color: '#818cf8' },
  // L-Shapes
  { shape: [[1, 0], [1, 0], [1, 1]], color: '#c084fc' }, // purple-400
  { shape: [[1, 1], [0, 1], [0, 1]], color: '#c084fc' },
  { shape: [[1, 1, 1], [1, 0, 0]], color: '#c084fc' },
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#c084fc' },
  // T-Shapes
  { shape: [[1, 1, 1], [0, 1, 0]], color: '#f43f5e' }, // rose-500
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#f43f5e' },
  { shape: [[1, 0], [1, 1], [1, 0]], color: '#f43f5e' },
  { shape: [[0, 1], [1, 1], [0, 1]], color: '#f43f5e' },
  // Corner
  { shape: [[1, 1], [1, 0]], color: '#2dd4bf' },
];
