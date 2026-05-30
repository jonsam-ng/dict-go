import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'tower',
      title: '🏰 词汇阶梯爬塔',
      description: '挑战词汇高度，逐层进阶',
      color: 'from-amber-500/20 to-transparent',
      borderColor: 'border-amber-500/30',
    },
    {
      id: 'trap',
      title: '🎯 词义陷阱大考验',
      description: '辨析易混词，避开陷阱',
      color: 'from-rose-500/20 to-transparent',
      borderColor: 'border-rose-500/30',
    },
    {
      id: 'chamber',
      title: '🔐 盲词记忆密室',
      description: '深度记忆，挑战极限',
      color: 'from-violet-500/20 to-transparent',
      borderColor: 'border-violet-500/30',
    },
    {
      id: 'reverse',
      title: '⚡ 单词逆向速答',
      description: '快速反应，碎片记忆',
      color: 'from-emerald-500/20 to-transparent',
      borderColor: 'border-emerald-500/30',
    },
  ];

  return (
    <div className="app-container safe-area-top safe-area-bottom">
      {/* 状态栏占位 */}
      <div className="status-bar"></div>
      
      {/* 头部 */}
      <div className="app-header flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold gold-gradient">词塔</h1>
          <p className="text-sm text-gray-400 mt-1">高阶单词闯关</p>
        </div>
      </div>

      {/* 内容区 */}
      <div className="app-content flex flex-col">
        {/* Logo/图标区域 */}
        <div className="flex-1 flex flex-col justify-center py-4">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-amber-400/30 to-amber-600/20 flex items-center justify-center float-animation border border-amber-500/30">
              <span className="text-5xl">🏰</span>
            </div>
            <p className="text-gray-400 text-sm">选择你的学习模式</p>
          </div>

          {/* 游戏卡片 */}
          <div className="space-y-3">
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(`/${game.id}`)}
                className="game-card"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-50`}></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{game.title}</h3>
                      <p className="text-gray-400 text-sm">{game.description}</p>
                    </div>
                    <div className="ml-3 mt-1 text-amber-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="home-bottom pt-2">
          <p className="text-center text-gray-500 text-xs">
            坚持学习，每天进步
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
