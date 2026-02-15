'use client';

import { useState } from 'react';
import BadgeCard from './BadgeCard';

// Badge catalog organized by category
const BADGE_CATALOG = {
  onboarding: {
    emoji: "🟢",
    label: "Onboarding",
    badges: [
      { id: "hello-world", name: "Hello World", level: 1, tier: "bronze", category: "onboarding", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-hello-world.svg", description: "Primer día en el equipo. ¡Bienvenido!" },
      { id: "first-commit", name: "First Commit", level: 1, tier: "bronze", category: "onboarding", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-commit.svg", description: "Primer commit al repositorio del equipo." },
      { id: "first-pr", name: "First PR", level: 1, tier: "bronze", category: "onboarding", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-pr.svg", description: "Primer Pull Request aprobado y mergeado." },
      { id: "first-review", name: "First Review", level: 1, tier: "bronze", category: "onboarding", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-review.svg", description: "Primera code review realizada a un compañero." },
    ]
  },
  coding: {
    emoji: "🔵",
    label: "Coding",
    badges: [
      { id: "code-ninja", name: "Code Ninja", level: 2, tier: "silver", category: "coding", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-code-ninja.svg", description: "Código limpio, rápido y eficiente." },
      { id: "bug-hunter", name: "Bug Hunter", level: 2, tier: "silver", category: "coding", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-bug-hunter.svg", description: "Detecta y corrige bugs antes de producción." },
      { id: "refactor-master", name: "Refactor Master", level: 2, tier: "silver", category: "coding", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-refactor-master.svg", description: "Mejora código legado sin romper funcionalidad." },
      { id: "algorithm-ace", name: "Algorithm Ace", level: 3, tier: "gold", category: "coding", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-algorithm-ace.svg", description: "Resuelve problemas complejos con algoritmos óptimos." },
      { id: "clean-code", name: "Clean Code", level: 2, tier: "silver", category: "coding", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-clean-code.svg", description: "Código legible, documentado y mantenible." },
      { id: "full-stack", name: "Full Stack", level: 3, tier: "gold", category: "coding", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-full-stack.svg", description: "Domina frontend y backend con soltura." },
    ]
  },
  devops: {
    emoji: "🟣",
    label: "DevOps",
    badges: [
      { id: "pipeline-pro", name: "Pipeline Pro", level: 2, tier: "silver", category: "devops", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-pipeline-pro.svg", description: "Pipelines de CI/CD rápidos y confiables." },
      { id: "docker-captain", name: "Docker Captain", level: 2, tier: "silver", category: "devops", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-docker-captain.svg", description: "Containerización limpia y eficiente." },
      { id: "cloud-deployer", name: "Cloud Deployer", level: 3, tier: "gold", category: "devops", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-cloud-deployer.svg", description: "Despliegues en la nube sin downtime." },
      { id: "cicd-master", name: "CI/CD Master", level: 3, tier: "gold", category: "devops", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-cicd-master.svg", description: "Automatización total del ciclo de desarrollo." },
    ]
  },
  collaboration: {
    emoji: "🟡",
    label: "Colaboración",
    badges: [
      { id: "mentor", name: "Mentor", level: 1, tier: "bronze", category: "collaboration", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor.svg", description: "Guía a compañeros nuevos en el equipo." },
      { id: "mentor-master", name: "Mentor Master", level: 3, tier: "gold", category: "collaboration", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor-master.svg", description: "Ha guiado a 20+ colegas al éxito." },
      { id: "team-spirit", name: "Team Spirit", level: 2, tier: "silver", category: "collaboration", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-team-spirit.svg", description: "Mantiene la moral alta del equipo." },
      { id: "code-reviewer", name: "Code Reviewer", level: 2, tier: "silver", category: "collaboration", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-code-reviewer.svg", description: "Reviews detallados y constructivos." },
      { id: "pair-programmer", name: "Pair Programmer", level: 2, tier: "silver", category: "collaboration", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-pair-programmer.svg", description: "Programación en pareja efectiva." },
    ]
  },
  leadership: {
    emoji: "🔴",
    label: "Liderazgo",
    badges: [
      { id: "crisis-averted", name: "Crisis Averted", level: 3, tier: "gold", category: "leadership", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-crisis-averted.svg", description: "Salvó el deploy en un momento crítico." },
      { id: "sprint-hero", name: "Sprint Hero", level: 2, tier: "silver", category: "leadership", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-sprint-hero.svg", description: "Entrega excepcional en el sprint." },
      { id: "architect", name: "Architect", level: 3, tier: "gold", category: "leadership", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-architect.svg", description: "Arquitectura sólida y escalable." },
      { id: "tech-lead", name: "Tech Lead", level: 3, tier: "gold", category: "leadership", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-tech-lead.svg", description: "Lidera decisiones técnicas con visión estratégica." },
    ]
  },
  documentation: {
    emoji: "⚪",
    label: "Documentación",
    badges: [
      { id: "docs-hero", name: "Docs Hero", level: 1, tier: "bronze", category: "documentation", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-docs-hero.svg", description: "Documentación clara para todo el equipo." },
      { id: "api-designer", name: "API Designer", level: 2, tier: "silver", category: "documentation", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-api-designer.svg", description: "APIs bien diseñadas y documentadas." },
      { id: "open-source", name: "Open Source", level: 2, tier: "silver", category: "documentation", imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-open-source.svg", description: "Contribuciones activas a proyectos open source." },
    ]
  },
};

const CATEGORY_KEYS = Object.keys(BADGE_CATALOG);

const USER_DATA = {
  username: "dawnweaber",
  topBadge: {
    name: "Mentor Master",
    description: "Awarded for guiding 20+ colleagues to success",
    imageUrl: "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor-master.svg"
  },
  stats: {
    totalKudos: 45,
    streak: 12,
    totalBadges: 26,
  },
};

const TIER_LABEL: Record<string, string> = {
  bronze: "🥉 Bronce",
  silver: "🥈 Plata",
  gold: "🥇 Oro",
};

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const allBadges = Object.values(BADGE_CATALOG).flatMap(cat => cat.badges);
  const filteredBadges = activeCategory === "all"
    ? allBadges
    : BADGE_CATALOG[activeCategory as keyof typeof BADGE_CATALOG]?.badges || [];

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
              <p className="text-xs text-gray-500 mt-1">
                Verificado por <span className="text-purple-400">Bloomflow</span> @ <a href="https://www.ursol.com" className="text-blue-400 hover:underline" target="_blank" rel="noreferrer">Sistemas Ursol</a>
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-0 flex gap-8 text-right">
            <div>
              <span className="block text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                {USER_DATA.stats.totalKudos}
              </span>
              <span className="text-sm text-gray-400 uppercase tracking-widest">Kudos</span>
            </div>
            <div>
              <span className="block text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                {USER_DATA.stats.totalBadges}
              </span>
              <span className="text-sm text-gray-400 uppercase tracking-widest">Medallas</span>
            </div>
          </div>
        </header>

        {/* Top Badge Feature */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full group-hover:bg-yellow-500/20 transition-all"></div>
            <h2 className="text-xl font-bold text-yellow-500 mb-6 uppercase tracking-widest z-10">Top Badge</h2>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={USER_DATA.topBadge.imageUrl}
              alt={USER_DATA.topBadge.name}
              className="w-48 h-48 drop-shadow-[0_0_35px_rgba(234,179,8,0.4)] z-10"
            />

            <h3 className="text-3xl font-bold text-white mt-6 z-10">{USER_DATA.topBadge.name}</h3>
            <p className="text-gray-400 mt-2 max-w-sm z-10">{USER_DATA.topBadge.description}</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-blue-400 mb-6 uppercase tracking-widest">Tiers</h2>
            <div className="space-y-4">
              {Object.entries(TIER_LABEL).map(([tier, label]) => {
                const count = allBadges.filter(b => b.tier === tier).length;
                return (
                  <div key={tier} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
                    <span className="text-white font-medium">{label}</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-300">{count} medallas</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Categorías</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_KEYS.map(key => {
                  const cat = BADGE_CATALOG[key as keyof typeof BADGE_CATALOG];
                  return (
                    <span key={key} className="px-2 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                      {cat.emoji} {cat.label} ({cat.badges.length})
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Badge Vault */}
        <section>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold text-white">🏅 Badge Vault</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                }`}
              >
                Todas ({allBadges.length})
              </button>
              {CATEGORY_KEYS.map(key => {
                const cat = BADGE_CATALOG[key as keyof typeof BADGE_CATALOG];
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
                      activeCategory === key
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                name={badge.name}
                level={badge.level}
                imageUrl={badge.imageUrl}
                description={badge.description}
                tier={badge.tier}
                category={badge.category}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
