import React from 'react';
import { AIDifficulty } from './types/game';
import { useGame } from './hooks/useGame';
import GameBoard from './components/GameBoard';
import TitleScreen from './components/TitleScreen';

const App: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleStart = (difficulty: AIDifficulty) => {
    dispatch({ type: 'START_GAME', difficulty });
  };

  if (state.phase === 'setup') {
    return <TitleScreen onStart={handleStart} />;
  }

  return <GameBoard state={state} dispatch={dispatch} />;
};

export default App;
