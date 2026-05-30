import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Word } from '../types';
import { advancedWords } from '../data/words';

const TOTAL_FLOORS = 15;
const WORDS_PER_FLOOR = 5;
const TIME_LIMIT = 40;

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

    if (answer.includes(correctAnswer.substring(0, 2))) {
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
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-primary-light/40 backdrop-blur-sm vintage-border rounded-3xl p-10 text-center">
          <div className="text-7xl mb-6">🏰</div>
          <h1 className="text-4xl font-serif font-bold gold-gradient mb-6">词汇阶梯爬塔</h1>
          <div className="text-gold-light/80 text-lg mb-8 space-y-2">
            <p>共 {TOTAL_FLOORS} 层塔楼，每层 {WORDS_PER_FLOOR} 个高级单词</p>
            <p>限时 {TIME_LIMIT} 秒/层，答对全部解锁下一层</p>
            <p>错1个重闯本层，错2个退回上一层</p>
          </div>
          <button
            onClick={startGame}
            className="px-12 py-4 bg-gradient-to-r from-gold to-gold-dark text-primary-dark font-bold text-xl rounded-xl hover:shadow-gold-glow transition-all duration-300 hover:scale-105"
          >
            开始攀登
          </button>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-8 py-3 text-gold-light hover:text-gold transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-primary-light/40 backdrop-blur-sm vintage-border rounded-3xl p-10 text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-4xl font-serif font-bold gold-gradient mb-6">恭喜通关！</h1>
          <div className="text-gold-light/90 text-xl mb-8 space-y-3">
            <p>用时：{Math.floor(timeUsed / 60)} 分 {timeUsed % 60} 秒</p>
            <p>得分：{score}</p>
            <p>到达层数：{currentFloor - 1}/{TOTAL_FLOORS}</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={startGame}
              className="px-10 py-4 bg-gradient-to-r from-gold to-gold-dark text-primary-dark font-bold text-lg rounded-xl hover:shadow-gold-glow transition-all duration-300"
            >
              再来一次
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-10 py-4 bg-primary-light text-gold font-bold text-lg rounded-xl hover:bg-primary transition-all duration-300"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gold-light hover:text-gold transition-colors"
            >
              ← 返回
            </button>
            <div className="text-2xl font-serif text-gold">
              第 {currentFloor}/{TOTAL_FLOORS} 层
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-gold'}`}>
              ⏱ {timeLeft}s
            </div>
            <div className="text-xl text-gold-light">
              得分: {score}
            </div>
          </div>
        </div>

        <div className="bg-primary-light/40 backdrop-blur-sm vintage-border rounded-3xl p-8 md:p-12">
          {currentWord && (
            <div className={`transition-all duration-300 ${showCorrect ? 'scale-105' : ''}`}>
              <div className="text-center mb-8">
                <div className="text-6xl md:text-7xl font-serif font-bold gold-gradient mb-6">
                  {currentWord.word}
                </div>
                <div className="text-sm text-gold-light/60 uppercase tracking-widest">
                  {currentWord.level.toUpperCase()}
                </div>
              </div>

              <form onSubmit={handleAnswer} className="max-w-xl mx-auto">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="输入中文释义..."
                  className="w-full px-6 py-4 bg-primary/60 border-2 border-gold/50 rounded-xl text-xl text-gold-light placeholder-gold-light/40 focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all"
                  autoFocus
                />
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-gold to-gold-dark text-primary-dark font-bold rounded-xl hover:shadow-gold-glow transition-all"
                  >
                    确认
                  </button>
                </div>
              </form>

              <div className="mt-8 grid grid-cols-2 gap-4 text-gold-light/70 text-sm">
                <div>
                  <div className="text-gold mb-2">搭配:</div>
                  <div>{currentWord.collocations[0]}</div>
                </div>
                <div>
                  <div className="text-gold mb-2">近义词:</div>
                  <div>{currentWord.synonyms[0]}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: WORDS_PER_FLOOR }).map((_, i) => {
            const wordPos = (currentFloor - 1) * WORDS_PER_FLOOR + i;
            const isActive = wordPos === currentWordIndex;
            const isCompleted = wordPos < currentWordIndex;
            return (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  isActive ? 'bg-gold scale-125' : isCompleted ? 'bg-gold/60' : 'bg-gold/20'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}