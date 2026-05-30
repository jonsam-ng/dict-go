import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { advancedWords } from '../data/words';
import { Word } from '../types';

const TOTAL_WORDS = 20;
const TIME_LIMIT = 15;

type HintType = 'definition' | 'example' | 'synonym';

const speakWord = (word: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
};

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
  const [answeredWords, setAnsweredWords] = useState<{ word: string; correct: boolean }[]>([]);

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
    setAnsweredWords([]);
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
    setAnsweredWords(prev => [...prev, { word: words[currentIndex].word, correct: false }]);
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
    setAnsweredWords(prev => [...prev, { word: words[currentIndex].word, correct }]);

    setTimeout(() => {
      if (correct) {
        setCorrectCount(c => c + 1);
      }
      setShowResult(false);
      setUserAnswer('');
      nextWord();
    }, 1000);
  }, [userAnswer, words, currentIndex]);

  const handleSkip = useCallback(() => {
    setAnsweredWords(prev => [...prev, { word: words[currentIndex].word, correct: false }]);
    nextWord();
  }, [words, currentIndex]);

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
        <div className="max-w-2xl w-full vintage-card rounded-3xl p-10 text-center">
          <div className="text-8xl mb-6">⚡</div>
          <h1 className="text-5xl font-serif font-bold gold-gradient mb-6">单词逆向速答</h1>
          <div className="text-gold-light/80 text-lg mb-8 space-y-3">
            <p>根据提示快速说出对应的英文单词</p>
            <p>20个单词，15秒/题</p>
            <p>三种提示方式随机出现：释义、例句、同义词</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full px-12 py-4 btn-primary text-xl rounded-xl"
            >
              开始速答
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
            {correctCount >= TOTAL_WORDS * 0.8 ? '🏆' : correctCount >= TOTAL_WORDS * 0.5 ? '👍' : '💪'}
          </div>
          <h1 className="text-5xl font-serif font-bold gold-gradient mb-6">挑战完成！</h1>
          <div className="text-gold-light/90 text-xl mb-8 space-y-3">
            <p>正确：{correctCount}/{TOTAL_WORDS}</p>
            <p>正确率：{Math.round((correctCount / TOTAL_WORDS) * 100)}%</p>
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
              第 {currentIndex + 1}/{TOTAL_WORDS} 题
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`text-2xl md:text-3xl font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-gold'}`}>
              ⏱ {timeLeft}s
            </div>
            <div className="text-xl text-gold-light">
              ✅ {correctCount}
            </div>
          </div>
        </div>

        {currentWord && (
          <div className="vintage-card rounded-3xl p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="text-sm text-gold-light/60 mb-4 uppercase tracking-widest">
                {getHintLabel(hintType)}
              </div>
              <div className="text-4xl md:text-5xl font-serif gold-gradient leading-relaxed mb-8">
                {getHintText(currentWord, hintType)}
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

              {showResult && (
                <div className={`text-center mb-8 text-xl ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                  {isCorrect ? '正确！' : `答案: ${currentWord.word}`}
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

            {hintType !== 'definition' && (
              <div className="mt-10 text-center text-gold-light/50 text-lg">
                💡 {currentWord.definition}
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: TOTAL_WORDS }).map((_, i) => {
            let status = 'pending';
            if (i < currentIndex) {
              status = answeredWords[i]?.correct ? 'correct' : 'wrong';
            }
            if (i === currentIndex) status = 'active';

            return (
              <div
                key={i}
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 ${
                  status === 'correct' ? 'bg-emerald-400' :
                  status === 'wrong' ? 'bg-red-400' :
                  status === 'active' ? 'bg-gold scale-125 shadow-gold-glow' : 'bg-gold/20'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}