import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { advancedWords } from '../data/words';
import { Word } from '../types';

const TOTAL_WORDS = 15;
const TIME_LIMIT = 30;

export default function ChamberGame() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [wrongCount, setWrongCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [round, setRound] = useState(1);

  useEffect(() => {
    const shuffled = [...advancedWords].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, TOTAL_WORDS));
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
    const shuffled = [...advancedWords].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, TOTAL_WORDS));
    setCurrentIndex(0);
    setWrongCount(0);
    setTimeLeft(TIME_LIMIT);
    setGameState('playing');
    setRound(1);
  }, []);

  const handleAnswer = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!words[currentIndex]) return;

    const answer = userAnswer.trim().toLowerCase();
    const correctAnswer = words[currentIndex].word.toLowerCase();
    const correct = answer === correctAnswer;

    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => {
      if (correct) {
        nextWord();
      } else {
        handleWrong();
      }
      setShowResult(false);
      setUserAnswer('');
    }, 1000);
  }, [userAnswer, words, currentIndex]);

  const handleWrong = () => {
    const newWrongCount = wrongCount + 1;
    setWrongCount(newWrongCount);
    if (newWrongCount >= 3) {
      setGameState('result');
    } else {
      nextWord();
    }
    setTimeLeft(TIME_LIMIT);
  };

  const nextWord = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      if (round === 1 && wrongCount < 3) {
        setRound(2);
        setCurrentIndex(0);
        setTimeLeft(TIME_LIMIT);
      } else {
        setGameState('result');
      }
    } else {
      setCurrentIndex(nextIndex);
      setTimeLeft(TIME_LIMIT);
    }
  };

  const currentWord = words[currentIndex];

  if (gameState === 'start') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-primary-light/40 backdrop-blur-sm vintage-border rounded-3xl p-10 text-center">
          <div className="text-7xl mb-6">🔐</div>
          <h1 className="text-4xl font-serif font-bold gold-gradient mb-6">盲词记忆密室</h1>
          <div className="text-gold-light/80 text-lg mb-8 space-y-2">
            <p>第1轮：根据中文释义默写单词</p>
            <p>第2轮：根据词根词缀推导单词</p>
            <p>累计错3个挑战失败</p>
          </div>
          <button
            onClick={startGame}
            className="px-12 py-4 bg-gradient-to-r from-gold to-gold-dark text-primary-dark font-bold text-xl rounded-xl hover:shadow-gold-glow transition-all duration-300 hover:scale-105"
          >
            进入密室
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
          <div className="text-7xl mb-6">
            {wrongCount >= 3 ? '💀' : '🎉'}
          </div>
          <h1 className="text-4xl font-serif font-bold gold-gradient mb-6">
            {wrongCount >= 3 ? '挑战失败' : '密室逃脱成功！'}
          </h1>
          <div className="text-gold-light/90 text-xl mb-8 space-y-3">
            <p>完成轮次：{round}</p>
            <p>错误次数：{wrongCount}/3</p>
            <p>完成单词：{currentIndex}/{words.length}</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={startGame}
              className="px-10 py-4 bg-gradient-to-r from-gold to-gold-dark text-primary-dark font-bold text-lg rounded-xl hover:shadow-gold-glow transition-all duration-300"
            >
              再次挑战
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
              第 {round} 轮 - 第 {currentIndex + 1}/{words.length} 词
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-gold'}`}>
              ⏱ {timeLeft}s
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${i < wrongCount ? 'bg-red-500' : 'bg-gold/20'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {currentWord && (
          <div className="bg-primary-light/40 backdrop-blur-sm vintage-border rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="text-lg text-gold-light/60 mb-4">
                {round === 1 ? '根据中文释义默写单词' : '根据词根词缀推导单词'}
              </div>
              
              {round === 1 ? (
                <div className="text-4xl md:text-5xl font-bold gold-gradient mb-4">
                  {currentWord.definition}
                </div>
              ) : (
                <div className="text-3xl md:text-4xl font-bold gold-gradient mb-4">
                  {currentWord.root || '词根/词缀'}
                </div>
              )}

              <div className="text-gold-light/60 mt-4">
                {round === 1 && (
                  <div>搭配: {currentWord.collocations[0]}</div>
                )}
                {round === 2 && (
                  <div>释义: {currentWord.definition}</div>
                )}
              </div>
            </div>

            <form onSubmit={handleAnswer} className="max-w-xl mx-auto">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="输入英文单词..."
                className={`w-full px-6 py-4 bg-primary/60 border-2 rounded-xl text-xl text-gold-light placeholder-gold-light/40 focus:outline-none transition-all ${
                  showResult
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-500/20'
                      : 'border-red-400 bg-red-500/20'
                    : 'border-gold/50 focus:border-gold focus:shadow-gold-glow'
                }`}
                autoFocus
              />
              {showResult && !isCorrect && (
                <div className="mt-4 text-center text-red-300">
                  正确答案: {currentWord.word}
                </div>
              )}
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={showResult}
                  className="px-8 py-3 bg-gradient-to-r from-gold to-gold-dark text-primary-dark font-bold rounded-xl hover:shadow-gold-glow transition-all disabled:opacity-50"
                >
                  确认
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-gold-light/50 text-sm">
              {Array.from({ length: currentWord.word.length }).map((_, i) => (
                <span key={i} className="inline-block w-6 h-1 mx-1 bg-gold/30 rounded" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}