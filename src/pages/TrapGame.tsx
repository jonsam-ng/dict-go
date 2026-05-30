import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { confusablePairs } from '../data/words';
import { ConfusablePair } from '../types';

const TOTAL_PAIRS = 10;
const TIME_LIMIT = 20;

const speakWord = (word: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
};

export default function TrapGame() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pairs, setPairs] = useState<ConfusablePair[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [wrongPairs, setWrongPairs] = useState<ConfusablePair[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'review' | 'result'>('start');
  const [currentDefinition, setCurrentDefinition] = useState('');

  useEffect(() => {
    const shuffled = [...confusablePairs].sort(() => Math.random() - 0.5);
    setPairs(shuffled.slice(0, Math.min(TOTAL_PAIRS, shuffled.length)));
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
    const shuffled = [...confusablePairs].sort(() => Math.random() - 0.5);
    setPairs(shuffled.slice(0, Math.min(TOTAL_PAIRS, shuffled.length)));
    setCurrentIndex(0);
    setScore(0);
    setConsecutiveCorrect(0);
    setWrongPairs([]);
    setTimeLeft(TIME_LIMIT);
    setGameState('playing');
    prepareQuestion(0, shuffled);
  }, []);

  const prepareQuestion = (index: number, pairList: ConfusablePair[]) => {
    const pair = pairList[index];
    if (!pair) return;
    const isWord1 = Math.random() > 0.5;
    setCurrentDefinition(isWord1 ? pair.word1.definition : pair.word2.definition);
  };

  const handleTimeout = () => {
    if (pairs[currentIndex]) {
      setWrongPairs(wp => [...wp, pairs[currentIndex]]);
    }
    setConsecutiveCorrect(0);
    nextQuestion();
  };

  const handleSkip = useCallback(() => {
    if (pairs[currentIndex]) {
      setWrongPairs(wp => [...wp, pairs[currentIndex]]);
    }
    setConsecutiveCorrect(0);
    nextQuestion();
  }, [pairs, currentIndex]);

  const handleSelect = useCallback((word: string) => {
    setSelectedWord(word);
    const pair = pairs[currentIndex];
    if (!pair) return;

    const isCorrect = 
      (word === pair.word1.word && currentDefinition === pair.word1.definition) ||
      (word === pair.word2.word && currentDefinition === pair.word2.definition);

    setShowResult(true);

    setTimeout(() => {
      if (isCorrect) {
        const bonus = consecutiveCorrect >= 4 ? 20 : 10;
        setScore(s => s + bonus);
        setConsecutiveCorrect(c => c + 1);
      } else {
        setWrongPairs(wp => [...wp, pair]);
        setConsecutiveCorrect(0);
      }
      setShowResult(false);
      setSelectedWord(null);
      nextQuestion();
    }, 1000);
  }, [pairs, currentIndex, currentDefinition, consecutiveCorrect]);

  const nextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= pairs.length) {
      if (wrongPairs.length > 0) {
        setGameState('review');
      } else {
        setGameState('result');
      }
    } else {
      setCurrentIndex(nextIndex);
      prepareQuestion(nextIndex, pairs);
      setTimeLeft(TIME_LIMIT);
    }
  };

  const startReview = () => {
    setPairs([...wrongPairs]);
    setWrongPairs([]);
    setCurrentIndex(0);
    setTimeLeft(TIME_LIMIT);
    setGameState('playing');
    prepareQuestion(0, wrongPairs);
  };

  const currentPair = pairs[currentIndex];

  if (gameState === 'start') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full vintage-card rounded-3xl p-10 text-center">
          <div className="text-8xl mb-6">🎯</div>
          <h1 className="text-5xl font-serif font-bold gold-gradient mb-6">词义陷阱大考验</h1>
          <div className="text-gold-light/80 text-lg mb-8 space-y-3">
            <p>辨析 <span className="text-gold font-bold">10</span> 组易混高级词</p>
            <p>限时 <span className="text-gold font-bold">20</span> 秒/组，连续答对获得连击加分</p>
            <p>答错的单词将进入错题回顾</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="w-full px-12 py-4 btn-primary text-xl rounded-xl"
            >
              开始挑战
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

  if (gameState === 'review') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full vintage-card rounded-3xl p-10 text-center">
          <div className="text-8xl mb-6">📝</div>
          <h1 className="text-5xl font-serif font-bold gold-gradient mb-6">错题回顾</h1>
          <p className="text-gold-light/80 text-lg mb-8">
            你有 <span className="text-gold font-bold">{wrongPairs.length}</span> 组单词需要复习
          </p>
          <div className="space-x-4">
            <button
              onClick={startReview}
              className="px-10 py-4 btn-primary text-lg rounded-xl"
            >
              复习错题
            </button>
            <button
              onClick={() => setGameState('result')}
              className="px-10 py-4 btn-secondary rounded-xl"
            >
              查看结果
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
          <div className="text-8xl mb-6">🏆</div>
          <h1 className="text-5xl font-serif font-bold gold-gradient mb-6">挑战完成！</h1>
          <div className="text-gold-light/90 text-xl mb-8 space-y-3">
            <p>得分：<span className="text-gold font-bold">{score}</span></p>
            <p>正确率：<span className="text-gold font-bold">{Math.round(((TOTAL_PAIRS - wrongPairs.length) / TOTAL_PAIRS) * 100)}</span>%</p>
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
              第 {currentIndex + 1}/{pairs.length} 组
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`text-2xl md:text-3xl font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-gold'}`}>
              ⏱ {timeLeft}s
            </div>
            <div className="text-xl text-gold-light">
              得分: <span className="text-gold">{score}</span>
            </div>
            {consecutiveCorrect >= 3 && (
              <div className="text-xl text-yellow-400 animate-pulse">
                🔥 x{consecutiveCorrect}
              </div>
            )}
          </div>
        </div>

        {currentPair && (
          <div className="vintage-card rounded-3xl p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="text-3xl md:text-4xl font-serif text-gold-light mb-4">
                这个释义对应哪个单词？
              </div>
              <div className="text-4xl md:text-5xl font-bold gold-gradient leading-relaxed">
                {currentDefinition}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
              <button
                onClick={() => !showResult && handleSelect(currentPair.word1.word)}
                disabled={showResult}
                className={`p-8 rounded-2xl text-2xl font-serif font-bold transition-all duration-300 border-2 ${
                  selectedWord === currentPair.word1.word
                    ? showResult
                      ? (currentDefinition === currentPair.word1.definition ? 'bg-emerald-500/30 border-emerald-400' : 'bg-red-500/30 border-red-400')
                      : 'bg-gold/20 border-gold'
                    : 'bg-primary/40 border-gold/30 hover:bg-gold/10'
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="word-display">{currentPair.word1.word}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(currentPair.word1.word);
                    }}
                    className="p-2 text-gold hover:text-gold-light transition-colors"
                  >
                    🔊
                  </button>
                </div>
                <div className="text-sm font-normal text-gold-light/60">
                  {currentPair.word1.definition}
                </div>
              </button>

              <button
                onClick={() => !showResult && handleSelect(currentPair.word2.word)}
                disabled={showResult}
                className={`p-8 rounded-2xl text-2xl font-serif font-bold transition-all duration-300 border-2 ${
                  selectedWord === currentPair.word2.word
                    ? showResult
                      ? (currentDefinition === currentPair.word2.definition ? 'bg-emerald-500/30 border-emerald-400' : 'bg-red-500/30 border-red-400')
                      : 'bg-gold/20 border-gold'
                    : 'bg-primary/40 border-gold/30 hover:bg-gold/10'
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="word-display">{currentPair.word2.word}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(currentPair.word2.word);
                    }}
                    className="p-2 text-gold hover:text-gold-light transition-colors"
                  >
                    🔊
                  </button>
                </div>
                <div className="text-sm font-normal text-gold-light/60">
                  {currentPair.word2.definition}
                </div>
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSkip}
                disabled={showResult}
                className="px-8 py-3 btn-secondary text-lg rounded-xl"
              >
                跳过 →
              </button>
            </div>

            <div className="mt-10 text-center text-gold-light/70">
              <div className="p-4 bg-primary/30 rounded-xl max-w-2xl mx-auto">
                <div className="text-gold font-semibold mb-2 text-sm uppercase tracking-wide">
                  💡 区别提示
                </div>
                <div className="text-lg">
                  {currentPair.difference}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}