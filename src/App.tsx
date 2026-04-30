/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useGameState } from './hooks/useGameState';
import { GameUI } from './components/GameUI';

export default function App() {
  const {
    board,
    currentBlocks,
    score,
    highScore,
    status,
    combo,
    showCombo,
    attemptPlacement,
    resetGame,
  } = useGameState();

  return (
    <GameUI
      board={board}
      currentBlocks={currentBlocks}
      score={score}
      highScore={highScore}
      status={status}
      combo={combo}
      showCombo={showCombo}
      onPlace={attemptPlacement}
      onReset={resetGame}
    />
  );
}
