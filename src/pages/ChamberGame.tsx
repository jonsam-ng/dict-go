import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { advancedWords } from '../data/words';
import { Word } from '../types';

const TOTAL_WORDS = 15;
const TIME_LIMIT = 30;

const speakWord = (word: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
};

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

  const handleSkip = useCallback(() => {
    setWrongCount(w => w + 1);
    if (wrongCount + 1 >= 3) {
      setGameState('result');
    } else {
      nextWord();
    }
    setTimeLeft(TIME_LIMIT);
    setUserAnswer('');
  }, [wrongCount]);

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
        <div className="max-w-2xl w-full vintage-card rounded-3xl p-10 text-center">
          <div className="text-8xl mb-6">🔐</div>
          <h1 className="text-5xl font-serif font-bold gold-gradient mb-6">盲词记忆密室</h1>
          <div className="text-gold-light/80 text-lg mb-8 space-y-3">
            <p>第1轮：根据中文释义默写单词</p>
            <p>第2轮：根据词根词缀推导单词</p>
            <p>累计错3个挑战失败</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full px-12 py-4 btn-primary text-xl rounded-xl"
            >
              进入密室
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
          <div className="text-8xl mb-6">
            {wrongCount >= 3 ? '💀' : '🎉'}
          </div>
          <h1 className="text-5xl font-serif font-bold gold-gradient mb-6">
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
              className="px-10 py-4 btn-primary text-lg rounded-xl"
            >
              再次挑战
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
              第 {round} 轮 - 第 {currentIndex + 1}/{words.length} 词
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`text-2xl md:text-3xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-gold'}`}>
              ⏱ {timeLeft}s
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full ${i < wrongCount ? 'bg-red-500' : 'bg-gold/20'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {currentWord && (
          <div className="vintage-card rounded-3xl p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="text-lg text-gold-light/60 mb-6">
                {round === 1 ? '根据中文释义默写单词' : '根据词根词缀推导单词'}
              </div>

              {round === 1 ? (
                <div className="text-4xl md:text-5xl font-bold gold-gradient mb-8 leading-relaxed">
                  {currentWord.definition}
                </div>
              ) : (
                <div className="text-4xl md:text-5xl font-bold gold-gradient mb-8 leading-relaxed">
                  {currentWord.root || '词根/词缀'}
                </div>
              )}

              <div className="text-gold-light/60 mb-8">
                {round === 1 && (
                  <div className="text-xl">搭配: {currentWord.collocations[0]}</div>
                )}
                {round === 2 && (
                  <div className="text-xl">释义: {currentWord.definition}</div>
                )}
              </div>
            </div>

            <form onSubmit={handleAnswer} className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-8">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="输入英文单词..."
                  className={`flex-1 px-8 py-5 bg-primary/60 border-2 rounded-xl text-xl md:text-2xl text-gold-light placeholder-gold-light/40 focus:outline-none transition-all font-sans ${
                    showResult
                      ? isCorrect
                        ? 'border-emerald-400 bg-emerald-500/20'
                        : 'border-red-400 bg-red-500/20'
                      : 'border-gold/50 focus:border-gold focus:shadow-gold-glow'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => speakWord(currentWord.word)}
                  className="p-4 btn-secondary rounded-xl"
                >
                  🔊
                </button>
              </div>

              {showResult && !isCorrect && (
                <div className="text-center mb-8 text-red-300 text-xl">
                  正确答案: {currentWord.word}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="submit"
                  disabled={showResult}
                  className="flex-1 px-8 py-4 btn-primary text-lg rounded-xl"
                >
                  确认
                </button>
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={showResult}
                  className="px-8 py-4 btn-secondary text-lg rounded-xl"
                >
                  跳过 →
                </button>
              </div>
            </form>

            <div className="mt-10 text-center text-gold-light/50 text-sm">
              {Array.from({ length: currentWord.word.length }).map((_, i) => (
                <span key={i} className="inline-block w-7 h-1.5 mx-1.5 bg-gold/30 rounded" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}