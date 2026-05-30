import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { confusablePairs } from '../data/words';
import { ConfusablePair } from '../types';

const TOTAL_PAIRS = 10;
const TIME_LIMIT = 20;

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
        <div className="max-w-2xl w-full bg-primary-light/40 backdrop-blur-sm vintage-border rounded-3xl p-10 text-center">
          <div className="text-7xl mb-6">🎯</div>
          <h1 className="text-4xl font-serif font-bold gold-gradient mb-6">词义陷阱大考验</h1>
          <div className="text-gold-light/80 text-lg mb-8 space-y-2">
            <p>辨析 {TOTAL_PAIRS} 组易混高级词</p>
            <p>限时 {TIME_LIMIT} 秒/组，连续答对获得连击加分</p>
            <p>答错的单词将进入错题回顾</p>
          </div>
          <button
            onClick={startGame}
            className="px-12 py-4 bg-gradient-to-r from-gold to-gold-dark text-primary-dark font-bold text-xl rounded-xl hover:shadow-gold-glow transition-all duration-300 hover:scale-105"
          >
            开始挑战
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

  if (gameState === 'review') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-primary-light/40 backdrop-blur-sm vintage-border rounded-3xl p-10 text-center">
          <div className="text-7xl mb-6">📝</div>
          <h1 className="text-4xl font-serif font-bold gold-gradient mb-6">错题回顾</h1>
          <p className="text-gold-light/80 text-lg mb-8">
            你有 {wrongPairs.length} 组单词需要复习
          </p>
          <div className="space-x-4">
            <button
              onClick={startReview}
              className="px-10 py-4 bg-gradient-to-r from-gold to-gold-dark text-primary-dark font-bold text-lg rounded-xl hover:shadow-gold-glow transition-all duration-300"
            >
              复习错题
            </button>
            <button
              onClick={() => setGameState('result')}
              className="px-10 py-4 bg-primary-light text-gold font-bold text-lg rounded-xl hover:bg-primary transition-all duration-300"
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
        <div className="max-w-2xl w-full bg-primary-light/40 backdrop-blur-sm vintage-border rounded-3xl p-10 text-center">
          <div className="text-7xl mb-6">🏆</div>
          <h1 className="text-4xl font-serif font-bold gold-gradient mb-6">挑战完成！</h1>
          <div className="text-gold-light/90 text-xl mb-8 space-y-3">
            <p>得分：{score}</p>
            <p>正确率：{Math.round(((TOTAL_PAIRS - wrongPairs.length) / TOTAL_PAIRS) * 100)}%</p>
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
              第 {currentIndex + 1}/{pairs.length} 组
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-gold'}`}>
              ⏱ {timeLeft}s
            </div>
            <div className="text-xl text-gold-light">
              得分: {score}
            </div>
            {consecutiveCorrect >= 3 && (
              <div className="text-xl text-yellow-400 animate-pulse">
                🔥 x{consecutiveCorrect}
              </div>
            )}
          </div>
        </div>

        {currentPair && (
          <div className="bg-primary-light/40 backdrop-blur-sm vintage-border rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="text-3xl md:text-4xl font-serif text-gold-light mb-4">
                这个释义对应哪个单词？
              </div>
              <div className="text-4xl md:text-5xl font-bold gold-gradient">
                {currentDefinition}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <button
                onClick={() => !showResult && handleSelect(currentPair.word1.word)}
                disabled={showResult}
                className={`p-8 rounded-2xl text-2xl font-serif font-bold transition-all duration-300 ${
                  selectedWord === currentPair.word1.word
                    ? showResult
                      ? (currentDefinition === currentPair.word1.definition ? 'bg-emerald-500/30 border-emerald-400' : 'bg-red-500/30 border-red-400')
                      : 'bg-gold/20 border-gold'
                    : 'bg-primary/40 border-gold/30 hover:bg-gold/10'
                } border-2`}
              >
                {currentPair.word1.word}
                <div className="text-sm font-normal text-gold-light/60 mt-2">
                  {currentPair.word1.definition}
                </div>
              </button>

              <button
                onClick={() => !showResult && handleSelect(currentPair.word2.word)}
                disabled={showResult}
                className={`p-8 rounded-2xl text-2xl font-serif font-bold transition-all duration-300 ${
                  selectedWord === currentPair.word2.word
                    ? showResult
                      ? (currentDefinition === currentPair.word2.definition ? 'bg-emerald-500/30 border-emerald-400' : 'bg-red-500/30 border-red-400')
                      : 'bg-gold/20 border-gold'
                    : 'bg-primary/40 border-gold/30 hover:bg-gold/10'
                } border-2`}
              >
                {currentPair.word2.word}
                <div className="text-sm font-normal text-gold-light/60 mt-2">
                  {currentPair.word2.definition}
                </div>
              </button>
            </div>

            <div className="mt-8 text-center text-gold-light/70">
              <p>💡 区别：{currentPair.difference}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}