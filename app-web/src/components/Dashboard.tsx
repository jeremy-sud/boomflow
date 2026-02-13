import BadgeCard from './BadgeCard';

// Mock Data (mirroring api-mock.json)
const USER_DATA = {
  username: "dawnweaber",
  topBadge: {
    name: "Master Mentor",
    description: "Awarded for guiding 20+ colleagues to success",
    imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor.svg"
  },
  stats: {
    totalKudos: 45,
    streak: 12
  },
  badges: [
    { id: "helper", name: "Ayudante", level: 1, imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-helper.svg" },
    { id: "resilience", name: "Resiliencia", level: 2, imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-resilience.svg" },
    { id: "first-pr", name: "First PR", level: 1, imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-pr.svg" },
    { id: "bug-scout", name: "Bug Scout", level: 1, imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-bug-scout.svg" },
    { id: "hello-world", name: "Hello World", level: 1, imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-hello-world.svg" },
    { id: "code-ninja", name: "Code Ninja", level: 2, imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-code-ninja.svg" },
    { id: "reviewer", name: "Reviewer", level: 2, imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-reviewer.svg" },
    { id: "docs-hero", name: "Docs Hero", level: 2, imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-docs-hero.svg" },
    { id: "architect", name: "Architect", level: 3, imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-architect.svg" },
    { id: "crisis-averted", name: "Crisis Averted", level: 3, imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-crisis-averted.svg" },
    { id: "mentor-master", name: "Mentor Master", level: 3, imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor-master.svg" },
  ]
};

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center glass-panel p-8 rounded-2xl">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl font-bold">
                DW
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                {USER_DATA.username}
              </h1>
              <p className="text-gray-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Online • {USER_DATA.stats.streak} Day Streak
              </p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 text-right">
             <span className="block text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
               {USER_DATA.stats.totalKudos}
             </span>
             <span className="text-sm text-gray-400 uppercase tracking-widest">Total Kudos</span>
          </div>
        </header>

        {/* Top Badge Feature */}
        <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full group-hover:bg-yellow-500/20 transition-all"></div>
               <h2 className="text-xl font-bold text-yellow-500 mb-6 uppercase tracking-widest z-10">Current Status</h2>
               
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img 
                 src={USER_DATA.topBadge.imageUrl} 
                 alt={USER_DATA.topBadge.name} 
                 className="w-48 h-48 drop-shadow-[0_0_35px_rgba(234,179,8,0.4)] animate-float z-10"
               />
               
               <h3 className="text-3xl font-bold text-white mt-6 z-10">{USER_DATA.topBadge.name}</h3>
               <p className="text-gray-400 mt-2 max-w-sm z-10">{USER_DATA.topBadge.description}</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
               <h2 className="text-xl font-bold text-blue-400 mb-6 uppercase tracking-widest">Recent Activity</h2>
               <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-default">
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">🚀</div>
                          <div>
                              <p className="text-sm text-white">Received a kudo from <span className="text-blue-400 font-bold">@alex</span></p>
                              <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                      </div>
                  ))}
               </div>
            </div>
        </div>

        {/* Badge Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-3xl font-bold text-white">Badge Vault</h2>
             <div className="flex gap-2">
                 <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs border border-green-500/20">Easy</span>
                 <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs border border-purple-500/20">Medium</span>
                 <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs border border-yellow-500/20">Hard</span>
             </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {USER_DATA.badges.map((badge) => (
              <BadgeCard 
                key={badge.id}
                {...badge}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
