import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('IDLE'); // IDLE, PLAYING, RESULT
  const [userId, setUserId] = useState('');
  const [results, setResults] = useState(null);

  const handleStart = (id) => {
    setUserId(id);
    setGameState('PLAYING');
  };

  const handleFinish = (res) => {
    setResults(res);
    setGameState('RESULT');
  };

  const handleRestart = () => {
    setGameState('IDLE'); // Or back to PLAYING? IDLE to let another user play or re-enter ID.
    // Requirement says "user enters ID to start". 
    // Usually arcade games go back to attract mode.
    setUserId('');
    setResults(null);
  };

  return (
    <div className="app-container">
      <div className="scanline"></div>
      {gameState === 'IDLE' && <LoginScreen onStart={handleStart} />}
      {gameState === 'PLAYING' && <GameScreen userId={userId} onFinish={handleFinish} />}
      {gameState === 'RESULT' && <ResultScreen userId={userId} results={results} onRestart={handleRestart} />}
    </div>
  );
}

export default App;
