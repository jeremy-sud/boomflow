interface BadgeCardProps {
  name: string;
  level: number;
  imageUrl: string;
  description?: string;
  tier?: string;
  category?: string;
  className?: string;
}

const TIER_COLORS: Record<string, { border: string; glow: string; label: string }> = {
  bronze: {
    border: "border-amber-700/50",
    glow: "group-hover:shadow-amber-700/20",
    label: "🥉",
  },
  silver: {
    border: "border-gray-400/50",
    glow: "group-hover:shadow-gray-400/20",
    label: "🥈",
  },
  gold: {
    border: "border-yellow-400/50",
    glow: "group-hover:shadow-yellow-400/20",
    label: "🥇",
  },
};

export default function BadgeCard({ name, level, imageUrl, description, tier = "bronze", category, className = '' }: BadgeCardProps) {
  const tierStyle = TIER_COLORS[tier] || TIER_COLORS.bronze;

  return (
    <div className={`group relative flex flex-col items-center justify-center p-4 rounded-xl glass-panel transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${tierStyle.border} ${tierStyle.glow} ${className}`}>
      <div className="relative w-20 h-20 mb-3 transition-transform duration-500 group-hover:rotate-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain filter drop-shadow-lg"
        />
      </div>

      <div className="text-center">
        <h3 className="font-bold text-sm tracking-wide text-white group-hover:text-blue-200 transition-colors">
          {name}
        </h3>
        <span className="text-xs text-gray-400 font-mono mt-1 block">
          {tierStyle.label} Lvl {level}
        </span>
      </div>

      {description && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 text-center">
          <p className="text-xs text-gray-200 mb-2">{description}</p>
          {category && (
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{category}</span>
          )}
        </div>
      )}
    </div>
  );
}
