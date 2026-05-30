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
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full vintage-card rounded-3xl p-10 text-center">
          <div className="text-8xl mb-6">🏰</div>
          <h1 className="text-5xl font-serif font-bold gold-gradient mb-6">词汇阶梯爬塔</h1>
          <div className="text-gold-light/80 text-lg mb-8 space-y-3">
            <p>共 <span className="text-gold font-bold">15</span> 层塔楼，每层 <span className="text-gold font-bold">5</span> 个高级单词</p>
            <p>限时 <span className="text-gold font-bold">40</span> 秒/层，答对全部解锁下一层</p>
            <p>错1个重闯本层，错2个退回上一层</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full px-12 py-4 btn-primary text-xl rounded-xl"
            >
              开始攀登
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 btn-secondary rounded-xl"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full vintage-card rounded-3xl p-10 text-center">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-5xl font-serif font-bold gold-gradient mb-6">挑战完成！</h1>
          <div className="text-gold-light/90 text-xl mb-8 space-y-3">
            <p>用时：<span className="text-gold font-bold">{Math.floor(timeUsed / 60)}</span> 分 <span className="text-gold font-bold">{timeUsed % 60}</span> 秒</p>
            <p>得分：<span className="text-gold font-bold">{score}</span></p>
            <p>到达层数：<span className="text-gold font-bold">{currentFloor - 1}</span>/{TOTAL_FLOORS}</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={startGame}
              className="px-10 py-4 btn-primary text-lg rounded-xl"
            >
              再来一次
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-10 py-4 btn-secondary rounded-xl"
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
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 btn-secondary rounded-lg text-sm"
            >
              ← 返回
            </button>
            <div className="text-2xl md:text-3xl font-serif text-gold font-bold">
              第 {currentFloor}/{TOTAL_FLOORS} 层
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`text-2xl md:text-3xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-gold'}`}>
              ⏱ {timeLeft}s
            </div>
            <div className="text-xl text-gold-light">
              得分: <span className="text-gold font-bold">{score}</span>
            </div>
          </div>
        </div>

        {currentWord && (
          <div className={`vintage-card rounded-3xl p-8 md:p-12 transition-all duration-300 ${showCorrect ? 'scale-[1.02] animate-pulse-gold' : ''}`}>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <h2 className="word-display text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold gold-gradient leading-tight">
                  {currentWord.word}
                </h2>
                <button
                  onClick={() => speakWord(currentWord.word)}
                  className="p-3 btn-secondary rounded-full hover:scale-110 transition-transform"
                  title="发音"
                >
                  🔊
                </button>
              </div>
              <div className="text-sm text-gold-light/60 uppercase tracking-widest">
                {currentWord.level.toUpperCase()}
              </div>
            </div>

            <form onSubmit={handleAnswer} className="max-w-2xl mx-auto">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="输入中文释义..."
                className="w-full px-6 py-5 bg-primary/60 border-2 border-gold/50 rounded-xl text-xl md:text-2xl text-gold-light placeholder-gold-light/40 focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all font-sans"
                autoFocus
              />
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="submit"
                  className="flex-1 px-8 py-4 btn-primary text-lg rounded-xl"
                >
                  确认答案
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-8 py-4 btn-secondary text-lg rounded-xl"
                >
                  跳过 →
                </button>
              </div>
            </form>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-gold-light/70">
              <div className="p-4 bg-primary/30 rounded-xl">
                <div className="text-gold font-semibold mb-2 text-sm uppercase tracking-wide">搭配</div>
                <div className="text-lg">{currentWord.collocations[0]}</div>
              </div>
              <div className="p-4 bg-primary/30 rounded-xl">
                <div className="text-gold font-semibold mb-2 text-sm uppercase tracking-wide">近义词</div>
                <div className="text-lg">{currentWord.synonyms[0]}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-center gap-3">
          {Array.from({ length: WORDS_PER_FLOOR }).map((_, i) => {
            const wordPos = (currentFloor - 1) * WORDS_PER_FLOOR + i;
            const isActive = wordPos === currentWordIndex;
            const isCompleted = wordPos < currentWordIndex;
            return (
              <div
                key={i}
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-gold scale-125 shadow-gold-glow' : 
                  isCompleted ? 'bg-emerald-400' : 'bg-gold/20'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}