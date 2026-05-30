import { useNavigate } from 'react-router-dom';

const gameModes = [
  {
    id: 'tower',
    title: '词汇阶梯爬塔',
    description: '15层塔楼挑战，每层5个高级单词，限时40秒',
    icon: '🏰',
    color: 'from-gold to-yellow-600'
  },
  {
    id: 'trap',
    title: '词义陷阱大考验',
    description: '辨析易混高级词，攻克考点，错题回顾',
    icon: '🎯',
    color: 'from-blue-400 to-purple-600'
  },
  {
    id: 'chamber',
    title: '盲词记忆密室',
    description: '根据中文释义默写单词，词根词缀辅助',
    icon: '🔐',
    color: 'from-emerald-400 to-teal-600'
  },
  {
    id: 'reverse',
    title: '单词逆向速答',
    description: '中文释义提示，限时快速反应',
    icon: '⚡',
    color: 'from-rose-400 to-pink-600'
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 gold-gradient">
            高阶单词闯关
          </h1>
          <p className="text-xl text-gold-light/80 max-w-2xl mx-auto">
            沉浸在单词的世界，攀登词汇的巅峰
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gameModes.map((mode, index) => (
            <button
              key={mode.id}
              onClick={() => navigate(`/${mode.id}`)}
              className="group relative overflow-hidden bg-primary-light/40 backdrop-blur-sm vintage-border rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-gold-glow hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative z-10">
                <div className="text-5xl mb-4">{mode.icon}</div>
                <h2 className="text-3xl font-serif font-bold text-gold mb-3 group-hover:text-gold-light transition-colors">
                  {mode.title}
                </h2>
                <p className="text-gold-light/70 text-lg leading-relaxed">
                  {mode.description}
                </p>
                <div className="mt-6 flex items-center text-gold font-semibold group-hover:translate-x-2 transition-transform">
                  开始挑战
                  <span className="ml-2 text-xl">→</span>
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            </button>
          ))}
        </div>

        <div className="mt-16 text-center text-gold-light/50">
          <p className="font-serif italic">
            "The limits of my language are the limits of my world"
          </p>
          <p className="text-sm mt-2">- Ludwig Wittgenstein</p>
        </div>
      </div>
    </div>
  );
}