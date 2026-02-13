import Image from 'next/image';

interface BadgeCardProps {
  name: string;
  level: number;
  imageUrl: string;
  description?: string;
  className?: string;
}

export default function BadgeCard({ name, level, imageUrl, description, className = '' }: BadgeCardProps) {
  const getBorderColor = (level: number) => {
    switch (level) {
      case 1: return 'border-green-500/50';
      case 2: return 'border-purple-500/50';
      case 3: return 'border-yellow-500/50';
      default: return 'border-white/10';
    }
  };

  const getGlowColor = (level: number) => {
    switch (level) {
      case 1: return 'group-hover:shadow-green-500/20';
      case 2: return 'group-hover:shadow-purple-500/20';
      case 3: return 'group-hover:shadow-yellow-500/20';
      default: return 'group-hover:shadow-white/5';
    }
  };

  return (
    <div className={`group relative flex flex-col items-center justify-center p-4 rounded-xl glass-panel transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${getBorderColor(level)} ${getGlowColor(level)} ${className}`}>
      <div className="relative w-20 h-20 mb-3 transition-transform duration-500 group-hover:rotate-3">
        {/* We use a simple img here because we're pointing to external raw GitHub URLs which might not be configured in next.config.js yet */}
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
          Lvl {level}
        </span>
      </div>
      
      {description && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 text-center">
          <p className="text-xs text-gray-200">{description}</p>
        </div>
      )}
    </div>
  );
}
