import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Word } from '../types';
import { advancedWords } from '../data/words';

const TOTAL_FLOORS = 15;
const WORDS_PER_FLOOR = 5;
const TIME_LIMIT = 40;

const speakWord = (word: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
};

export default function TowerGame() {
  const navigate = useNavigate();
  const [currentFloor, setCurrentFloor] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showCorrect, setShowCorrect] = useState(false);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    const shuffled = [...advancedWords].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, TOTAL_FLOORS * WORDS_PER_FLOOR));
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleWrong();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = useCallback(() => {
    setCurrentFloor(1);
    setCurrentWordIndex(0);
    setScore(0);
    setWrongCount(0);
    setTimeLeft(TIME_LIMIT);
    setGameState('playing');
    setStartTime(Date.now());
    const shuffled = [...advancedWords].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, TOTAL_FLOORS * WORDS_PER_FLOOR));
  }, []);

  const handleAnswer = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!words[currentWordIndex]) return;

    const answer = userAnswer.trim().toLowerCase();
    const correctAnswer = words[currentWordIndex].definition;

    if (answer.includes(correctAnswer.substring(0, 2)) || answer === correctAnswer) {
      setScore(s => s + 10);
      setShowCorrect(true);
      setTimeout(() => {
        setShowCorrect(false);
        nextWord();
      }, 800);
    } else {
      handleWrong();
    }
    setUserAnswer('');
  }, [userAnswer, words, currentWordIndex]);

  const handleSkip = useCallback(() => {
    setWrongCount(w => w + 1);
    if (wrongCount === 1) {
      setCurrentFloor(f => Math.max(1, f - 1));
      setCurrentWordIndex((currentFloor - 1) * WORDS_PER_FLOOR);
      setWrongCount(0);
    } else {
      nextWord();
    }
    setTimeLeft(TIME_LIMIT);
    setUserAnswer('');
  }, [wrongCount, currentFloor]);

  const handleWrong = () => {
    setWrongCount(w => w + 1);
    if (wrongCount === 1) {
      setCurrentFloor(f => Math.max(1, f - 1));
      setCurrentWordIndex((currentFloor - 1) * WORDS_PER_FLOOR);
      setWrongCount(0);
    } else {
      nextWord();
    }
    setTimeLeft(TIME_LIMIT);
  };

  const nextWord = () => {
    const nextIndex = currentWordIndex + 1;
    if (nextIndex % WORDS_PER_FLOOR === 0) {
      const nextFloor = currentFloor + 1;
      if (nextFloor > TOTAL_FLOORS) {
        setGameState('result');
        return;
      }
      setCurrentFloor(nextFloor);
    }
    setCurrentWordIndex(nextIndex);
    setTimeLeft(TIME_LIMIT);
  };

  const currentWord = words[currentWordIndex];
  const timeUsed = Math.floor((Date.now() - startTime) / 1000);

  if (gameState === 'start') {
    return (
      <div className="app-container safe-area-top safe-area-bottom">
        <div className="status-bar"></div>
        
        <div className="app-header flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-white">词汇阶梯爬塔</h1>
          <div className="w-10"></div>
        </div>

        <div className="app-content flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-amber-400/30 to-amber-600/20 flex items-center justify-center float-animation border border-amber-500/30">
                <span className="text-4xl">🏰</span>
              </div>
              <h1 className="text-2xl font-bold gold-gradient mb-2">词汇阶梯爬塔</h1>
            </div>

            <div className="vintage-card p-6 mb-6">
              <div className="text-gray-300 text-sm space-y-2">
                <p>• 共 <span className="text-amber-400 font-bold">15</span> 层塔楼，每层 <span className="text-amber-400 font-bold">5</span> 个高级单词</p>
                <p>• 限时 <span className="text-amber-400 font-bold">40</span> 秒/层，答对全部解锁下一层</p>
                <p>• 错1个重闯本层，错2个退回上一层</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="btn-primary w-full"
            >
              开始攀登
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="app-container safe-area-top safe-area-bottom">
        <div className="status-bar"></div>
        
        <div className="app-header flex items-center justify-center">
          <h1 className="text-lg font-semibold text-white">挑战完成！</h1>
        </div>

        <div className="app-content flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-400/30 to-emerald-600/20 flex items-center justify-center float-animation border border-emerald-500/30">
                <span className="text-5xl">🎉</span>
              </div>
              <h1 className="text-2xl font-bold gold-gradient mb-6">挑战完成！</h1>
            </div>

            <div className="vintage-card p-6 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">用时</span>
                  <span className="text-amber-400 font-bold">
                    {Math.floor(timeUsed / 60)} 分 {timeUsed % 60} 秒
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">得分</span>
                  <span className="text-amber-400 font-bold">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">到达层数</span>
                  <span className="text-amber-400 font-bold">{currentFloor - 1}/{TOTAL_FLOORS}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={startGame}
                className="btn-primary w-full"
              >
                再来一次
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-secondary w-full"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container safe-area-top safe-area-bottom">
      <div className="status-bar"></div>
      
      <div className="app-header">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <div className="text-amber-400 font-bold text-lg">第 {currentFloor}/{TOTAL_FLOORS} 层</div>
          </div>
          <div className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
            ⏱ {timeLeft}s
          </div>
        </div>
        
        <div className="flex justify-center gap-2">
          {Array.from({ length: WORDS_PER_FLOOR }).map((_, i) => {
            const wordPos = (currentFloor - 1) * WORDS_PER_FLOOR + i;
            const isActive = wordPos === currentWordIndex;
            const isCompleted = wordPos < currentWordIndex;
            return (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 flex-1 ${
                  isActive ? 'bg-amber-400' : 
                  isCompleted ? 'bg-emerald-400' : 'bg-amber-400/20'
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="app-content flex flex-col">
        {currentWord && (
          <div className="flex-1 flex flex-col">
            <div className={`vintage-card p-6 mb-4 flex-1 flex flex-col justify-center ${showCorrect ? 'pulse-animation' : ''}`}>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <h2 className="word-display font-bold gold-gradient">
                    {currentWord.word}
                  </h2>
                  <button
                    onClick={() => speakWord(currentWord.word)}
                    className="p-2 btn-secondary rounded-full w-10 h-10 flex items-center justify-center"
                    title="发音"
                  >
                    🔊
                  </button>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  {currentWord.level.toUpperCase()}
                </div>
              </div>

              <form onSubmit={handleAnswer} className="flex-1 flex flex-col justify-end">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="输入中文释义..."
                  className="input-app w-full mb-4"
                  autoFocus
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="btn-secondary"
                  >
                    跳过
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    确认
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="vintage-card p-4">
                <div className="text-amber-400 font-semibold mb-1 text-xs uppercase tracking-wide">搭配</div>
                <div className="text-sm text-gray-300">{currentWord.collocations[0]}</div>
              </div>
              <div className="vintage-card p-4">
                <div className="text-amber-400 font-semibold mb-1 text-xs uppercase tracking-wide">近义词</div>
                <div className="text-sm text-gray-300">{currentWord.synonyms[0]}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
