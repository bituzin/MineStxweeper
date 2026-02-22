import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Difficulty, GameStatus } from '@/types';
import { Board } from '@/components/game/Board';
import { GameInfo } from '@/components/game/GameInfo';
import { Button } from '@/components/ui/Button';
import { RefreshCw, Trophy, Skull } from 'lucide-react';
import { checkWinCondition } from '@/lib/stacks';

export function Game() {
  const { startNewGame, resetGame, status, difficulty } = useGameStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [winGameId, setWinGameId] = useState('');
  const [submittingWin, setSubmittingWin] = useState(false);

  const [loading, setLoading] = useState(false);
  const handleStartGame = async () => {
    setLoading(true);
    await startNewGame(selectedDifficulty);
    setLoading(false);
  };

  const handleReset = () => {
    resetGame();
  };

  const handleSubmitWin = async () => {
    if (!winGameId) {
      alert('Podaj Game ID!');
      return;
    }
    setSubmittingWin(true);
    try {
      await checkWinCondition(Number(winGameId));
      alert('Wygrana zarejestrowana na blockchainie! Możesz teraz sklaimować nagrody w profilu.');
    } catch (error) {
      console.error('Error submitting win:', error);
      alert('Błąd podczas rejestrowania wygranej: ' + error);
    } finally {
      setSubmittingWin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8 font-army">
          Play Minesweeper
        </h1>

        {/* Difficulty Selection */}
        {status === GameStatus.NOT_STARTED && (
          <div className="max-w-2xl mx-auto mb-8 bg-gray-800 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4 font-army">Select Difficulty</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <DifficultyButton
                difficulty={Difficulty.BEGINNER}
                selected={selectedDifficulty === Difficulty.BEGINNER}
                onClick={() => setSelectedDifficulty(Difficulty.BEGINNER)}
                label="Beginner"
                details="9×9, 10 mines"
              />
              
              <DifficultyButton
                difficulty={Difficulty.INTERMEDIATE}
                selected={selectedDifficulty === Difficulty.INTERMEDIATE}
                onClick={() => setSelectedDifficulty(Difficulty.INTERMEDIATE)}
                label="Intermediate"
                details="16×16, 40 mines"
              />
              
              <DifficultyButton
                difficulty={Difficulty.EXPERT}
                selected={selectedDifficulty === Difficulty.EXPERT}
                onClick={() => setSelectedDifficulty(Difficulty.EXPERT)}
                label="Expert"
                details="30×16, 99 mines"
              />
            </div>

            <Button onClick={handleStartGame} className="w-full" size="lg" disabled={loading}>
              {loading ? 'Starting...' : 'Start Game'}
            </Button>
          </div>
        )}

        {/* Game UI */}
        {status !== GameStatus.NOT_STARTED && (
          <div className="flex flex-col items-center gap-6">
            {/* Game Controls */}
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-4xl font-army">
              <div className="flex justify-between items-center">
                <GameInfo />
                
                <div className="flex gap-3">
                  <Button onClick={handleReset} variant="secondary">
                    <RefreshCw size={18} className="mr-2" />
                    New Game
                  </Button>
                </div>
              </div>
            </div>

            {/* Game Over Messages */}
            {status === GameStatus.WON && (
              <div className="bg-green-600 text-white p-6 rounded-xl shadow-2xl">
                <div className="flex items-center gap-3 text-2xl font-bold mb-2 font-army">
                  <Trophy size={32} />
                  <span>You Won! 🎉</span>
                </div>
                <p className="mb-4">Congratulations on clearing the board!</p>
                <div className="bg-green-700 p-4 rounded-lg">
                  <p className="text-sm mb-2">Aby zarejestrować wygraną i otrzymać nagrody:</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Podaj Game ID z blockchaina"
                      value={winGameId}
                      onChange={(e) => setWinGameId(e.target.value)}
                      className="flex-1 px-3 py-2 rounded bg-white text-gray-900"
                    />
                    <Button 
                      onClick={handleSubmitWin} 
                      disabled={submittingWin}
                      variant="secondary"
                    >
                      {submittingWin ? 'Submitting...' : 'Submit Win'}
                    </Button>
                  </div>
                  <p className="text-xs mt-2 opacity-80">Game ID znajdziesz w sekcji History lub w transakcji create-game</p>
                </div>
              </div>
            )}

            {status === GameStatus.LOST && (
              <div className="bg-red-600 text-white p-6 rounded-xl shadow-2xl">
                <div className="flex items-center gap-3 text-2xl font-bold font-army">
                  <Skull size={32} />
                  <span>Game Over!</span>
                </div>
                <p className="mt-2">You hit a mine. Try again!</p>
              </div>
            )}

            {/* Board */}
            <div className="flex justify-center">
              <Board />
            </div>

            {/* Instructions */}
            <div className="bg-gray-800 p-6 rounded-xl max-w-2xl text-gray-300 font-army">
              <h3 className="text-lg font-bold text-white mb-3">How to Play</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Left Click:</strong> Reveal a cell</li>
                <li>• <strong>Right Click:</strong> Place/remove a flag</li>
                <li>• <strong>Numbers:</strong> Show how many mines are adjacent</li>
                <li>• <strong>Goal:</strong> Reveal all non-mine cells</li>
                <li>• <strong>Tip:</strong> First click is always safe!</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DifficultyButtonProps {
  difficulty: Difficulty;
  selected: boolean;
  onClick: () => void;
  label: string;
  details: string;
}

function DifficultyButton({ selected, onClick, label, details }: DifficultyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-primary-500 bg-primary-900 text-white'
          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
      }`}
    >
      <div className="font-bold text-lg font-army">{label}</div>
      <div className="text-sm mt-1 font-army">{details}</div>
    </button>
  );
}
