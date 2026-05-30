import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { advancedWords } from '../data/words';
import { Word } from '../types';

const TOTAL_WORDS = 20;
const TIME_LIMIT = 15;

type HintType = 'definition' | 'example' | 'synonym';

export default function ReverseGame() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [correctCount, setCorrectCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintType, setHintType] = useState<HintType>('definition');
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');

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
      handleTimeout();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = useCallback(() => {
    const shuffled = [...advancedWords].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, TOTAL_WORDS));
    setCurrentIndex(0);
    setCorrectCount(0);
    setTimeLeft(TIME_LIMIT);
    setGameState('playing');
    setHintType(getRandomHintType());
  }, []);

  const getRandomHintType = (): HintType => {
    const types: HintType[] = ['definition', 'example', 'synonym'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const getHintText = (word: Word, type: HintType) => {
    switch (type) {
      case 'definition':
        return word.definition;
      case 'example':
        return word.example.replace(new RegExp(word.word, 'gi'), '_____');
      case 'synonym':
        return word.synonyms[0] || word.definition;
    }
  };

  const getHintLabel = (type: HintType) => {
    switch (type) {
      case 'definition':
        return '中文释义';
      case 'example':
        return '例句填空';
      case 'synonym':
        return '同义词';
    }
  };

  const handleTimeout = () => {
    nextWord();
  };

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
        setCorrectCount(c => c + 1);
      }
      setShowResult(false);
      setUserAnswer('');
      nextWord();
    }, 800);
  }, [userAnswer, words, currentIndex]);

  const nextWord = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      setGameState('result');
    } else {
      setCurrentIndex(nextIndex);
      setHintType(getRandomHintType());
      setTimeLeft(TIME_LIMIT);
    }
  };

  const currentWord = words[currentIndex];

  if (gameState === 'start') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-primary-light/40 backdrop-blur-sm vintage-border rounded-3xl p-10 text-center">
          <div className="text-7xl mb-6">⚡</div>
          <h1 className="text-4xl font-serif font-bold gold-gradient mb-6">单词逆向速答</h1>
          <div className="text-gold-light/80 text-lg mb-8 space-y-2">
            <p>根据提示快速说出对应的英文单词</p>
            <p>{TOTAL_WORDS} 个单词，{TIME_LIMIT} 秒/题</p>
            <p>三种提示方式随机出现：释义、例句、同义词</p>
          </div>
          <button
            onClick={startGame}
            className="px-12 py-4 bg-gradient-to-r from-gold to-gold-dark text-primary-dark font-bold text-xl rounded-xl hover:shadow-gold-glow transition-all duration-300 hover:scale-105"
          >
            开始速答
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
            {correctCount >= TOTAL_WORDS * 0.8 ? '🏆' : correctCount >= TOTAL_WORDS * 0.5 ? '👍' : '💪'}
          </div>
          <h1 className="text-4xl font-serif font-bold gold-gradient mb-6">挑战完成！</h1>
          <div className="text-gold-light/90 text-xl mb-8 space-y-3">
            <p>正确：{correctCount}/{TOTAL_WORDS}</p>
            <p>正确率：{Math.round((correctCount / TOTAL_WORDS) * 100)}%</p>
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
              第 {currentIndex + 1}/{TOTAL_WORDS} 题
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-gold'}`}>
              ⏱ {timeLeft}s
            </div>
            <div className="text-xl text-gold-light">
              ✅ {correctCount}
            </div>
          </div>
        </div>

        {currentWord && (
          <div className="bg-primary-light/40 backdrop-blur-sm vintage-border rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="text-sm text-gold-light/60 mb-2 uppercase tracking-widest">
                {getHintLabel(hintType)}
              </div>
              <div className="text-3xl md:text-4xl font-serif gold-gradient leading-relaxed">
                {getHintText(currentWord, hintType)}
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
              {showResult && (
                <div className={`mt-4 text-center ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                  {isCorrect ? '正确！' : `答案: ${currentWord.word}`}
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

            {hintType !== 'definition' && (
              <div className="mt-8 text-center text-gold-light/50 text-sm">
                💡 {currentWord.definition}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: TOTAL_WORDS }).map((_, i) => {
            let status = 'pending';
            if (i < currentIndex) status = i < correctCount ? 'correct' : 'wrong';
            if (i === currentIndex) status = 'active';
            
            return (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  status === 'correct' ? 'bg-emerald-400' :
                  status === 'wrong' ? 'bg-red-400' :
                  status === 'active' ? 'bg-gold scale-125' : 'bg-gold/20'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}