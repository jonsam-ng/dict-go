import { useNavigate } from 'react-router-dom';

const gameModes = [
  {
    id: 'tower',
    title: '词汇阶梯爬塔',
    description: '15层塔楼挑战，每层5个高级单词，限时40秒',
    icon: '🏰',
    color: 'from-amber-400 to-yellow-600'
  },
  {
    id: 'trap',
    title: '词义陷阱大考验',
    description: '辨析易混高级词，攻克考点，错题回顾',
    icon: '🎯',
    color: 'from-blue-400 to-indigo-600'
  },
  {
    id: 'chamber',
    title: '盲词记忆密室',
    description: '根据中文释义默写单词，词根词缀辅助',
    icon: '🔐',
    color: 'from-emerald-400 to-cyan-600'
  },
  {
    id: 'reverse',
    title: '单词逆向速答',
    description: '中文释义提示，限时快速反应',
    icon: '⚡',
    color: 'from-pink-400 to-rose-600'
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-light/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="px-6 py-2 border border-gold/30 rounded-full text-gold-light/70 text-sm tracking-widest uppercase">
              Advanced Vocabulary Mastery
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-extrabold mb-6 gold-gradient leading-tight">
            高阶单词闯关
          </h1>
          <p className="text-xl md:text-2xl text-gold-light/70 max-w-3xl mx-auto font-light leading-relaxed">
            沉浸在单词的世界，攀登词汇的巅峰
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gameModes.map((mode, index) => (
            <button
              key={mode.id}
              onClick={() => navigate(`/${mode.id}`)}
              className="group relative overflow-hidden vintage-card rounded-3xl p-10 text-left transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{ background: `linear-gradient(135deg, ${mode.color.includes('amber') ? 'rgba(212,175,55,0.15)' : mode.color.includes('blue') ? 'rgba(59,130,246,0.15)' : mode.color.includes('emerald') ? 'rgba(16,185,129,0.15)' : 'rgba(236,72,153,0.15)'}, transparent)` }} />
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {mode.icon}
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold gold-gradient mb-4">
                  {mode.title}
                </h2>
                <p className="text-gold-light/70 text-lg leading-relaxed mb-8">
                  {mode.description}
                </p>
                <div className="flex items-center text-gold font-semibold group-hover:translate-x-3 transition-all duration-300">
                  <span className="text-lg">开始挑战</span>
                  <span className="ml-3 text-2xl">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-block border-t border-gold/20 pt-8">
            <p className="font-serif italic text-2xl text-gold-light/60 mb-4">
              "The limits of my language are the limits of my world"
            </p>
            <p className="text-sm text-gold-light/40 tracking-wider uppercase">
              — Ludwig Wittgenstein
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}