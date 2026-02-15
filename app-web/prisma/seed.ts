import { PrismaClient, BadgeCategory, BadgeTier, TriggerType, SkinStyle } from '../src/generated/prisma'

const prisma = new PrismaClient()

// Category mapping to Prisma enums
const categoryMap: Record<string, BadgeCategory> = {
  'onboarding': BadgeCategory.ONBOARDING,
  'coding': BadgeCategory.CODING,
  'devops': BadgeCategory.DEVOPS,
  'collaboration': BadgeCategory.COLLABORATION,
  'leadership': BadgeCategory.LEADERSHIP,
  'documentation': BadgeCategory.DOCUMENTATION,
  'quality': BadgeCategory.QUALITY,
  'innovation': BadgeCategory.INNOVATION,
  'special': BadgeCategory.SPECIAL,
  'community': BadgeCategory.COMMUNITY,
  'premium': BadgeCategory.PREMIUM,
  'milestone': BadgeCategory.MILESTONE,
  'growth': BadgeCategory.GROWTH,
}

const tierMap: Record<string, BadgeTier> = {
  'bronze': BadgeTier.BRONZE,
  'silver': BadgeTier.SILVER,
  'gold': BadgeTier.GOLD,
}

// Las 89 badges de BOOMFLOW
const BADGES = [
  // ONBOARDING (4)
  { slug: 'hello-world', name: 'Hello World', emoji: '👋', tier: 'bronze', category: 'onboarding', description: 'Primer día en el equipo. ¡Bienvenido!', triggerType: TriggerType.FIRST_ACTION },
  { slug: 'first-commit', name: 'First Commit', emoji: '📝', tier: 'bronze', category: 'onboarding', description: 'Primer commit al repositorio del equipo.', triggerType: TriggerType.FIRST_ACTION },
  { slug: 'first-pr', name: 'First PR', emoji: '🔀', tier: 'bronze', category: 'onboarding', description: 'Primer Pull Request aprobado y mergeado.', triggerType: TriggerType.PULL_REQUESTS, triggerValue: 1 },
  { slug: 'first-review', name: 'First Review', emoji: '👀', tier: 'bronze', category: 'onboarding', description: 'Primera code review realizada.', triggerType: TriggerType.CODE_REVIEWS, triggerValue: 1 },
  
  // CODING (15)
  { slug: 'code-ninja', name: 'Code Ninja', emoji: '🥷', tier: 'silver', category: 'coding', description: 'Código limpio, rápido y eficiente.', triggerType: TriggerType.PULL_REQUESTS, triggerValue: 10 },
  { slug: 'bug-hunter', name: 'Bug Hunter', emoji: '🐛', tier: 'silver', category: 'coding', description: 'Detecta y corrige bugs antes de producción.', triggerType: TriggerType.ISSUES_CLOSED, triggerValue: 20 },
  { slug: 'refactor-master', name: 'Refactor Master', emoji: '♻️', tier: 'silver', category: 'coding', description: 'Mejora código legado sin romper funcionalidad.', triggerType: TriggerType.MANUAL },
  { slug: 'algorithm-ace', name: 'Algorithm Ace', emoji: '🧮', tier: 'gold', category: 'coding', description: 'Resuelve problemas complejos con algoritmos óptimos.', triggerType: TriggerType.MANUAL },
  { slug: 'clean-code', name: 'Clean Code', emoji: '✨', tier: 'silver', category: 'coding', description: 'Código legible, documentado y mantenible.', triggerType: TriggerType.MANUAL },
  { slug: 'full-stack', name: 'Full Stack', emoji: '🌐', tier: 'gold', category: 'coding', description: 'Domina frontend y backend con soltura.', triggerType: TriggerType.MANUAL },
  { slug: 'typescript-wizard', name: 'TypeScript Wizard', emoji: '🔷', tier: 'silver', category: 'coding', description: 'Tipado estricto y genéricos avanzados.', triggerType: TriggerType.MANUAL },
  { slug: 'python-master', name: 'Python Master', emoji: '🐍', tier: 'silver', category: 'coding', description: 'Dominio avanzado de Python.', triggerType: TriggerType.MANUAL },
  { slug: 'rust-pioneer', name: 'Rust Pioneer', emoji: '🦀', tier: 'gold', category: 'coding', description: 'Programación de sistemas en Rust.', triggerType: TriggerType.MANUAL },
  { slug: 'regex-guru', name: 'Regex Guru', emoji: '🔍', tier: 'bronze', category: 'coding', description: 'Expresiones regulares complejas.', triggerType: TriggerType.MANUAL },
  { slug: 'sql-sorcerer', name: 'SQL Sorcerer', emoji: '🗃️', tier: 'silver', category: 'coding', description: 'Queries optimizados y diseño de DB.', triggerType: TriggerType.MANUAL },
  { slug: 'api-artisan', name: 'API Artisan', emoji: '🔗', tier: 'silver', category: 'coding', description: 'APIs RESTful bien diseñadas.', triggerType: TriggerType.MANUAL },
  { slug: 'graphql-guru', name: 'GraphQL Guru', emoji: '◈', tier: 'silver', category: 'coding', description: 'Schemas y resolvers eficientes.', triggerType: TriggerType.MANUAL },
  { slug: 'test-champion', name: 'Test Champion', emoji: '✅', tier: 'silver', category: 'coding', description: 'Tests robustos y alta cobertura.', triggerType: TriggerType.MANUAL },
  { slug: 'performance-ninja', name: 'Performance Ninja', emoji: '⚡', tier: 'gold', category: 'coding', description: 'Optimización extrema de rendimiento.', triggerType: TriggerType.MANUAL },
  
  // DEVOPS (12)
  { slug: 'pipeline-pro', name: 'Pipeline Pro', emoji: '🔄', tier: 'silver', category: 'devops', description: 'Pipelines de CI/CD rápidos y confiables.', triggerType: TriggerType.MANUAL },
  { slug: 'docker-captain', name: 'Docker Captain', emoji: '🐳', tier: 'silver', category: 'devops', description: 'Containerización limpia y eficiente.', triggerType: TriggerType.MANUAL },
  { slug: 'cloud-deployer', name: 'Cloud Deployer', emoji: '☁️', tier: 'gold', category: 'devops', description: 'Despliegues en la nube sin downtime.', triggerType: TriggerType.MANUAL },
  { slug: 'cicd-master', name: 'CI/CD Master', emoji: '🚀', tier: 'gold', category: 'devops', description: 'Automatización total del ciclo de desarrollo.', triggerType: TriggerType.MANUAL },
  { slug: 'kubernetes-king', name: 'Kubernetes King', emoji: '☸️', tier: 'gold', category: 'devops', description: 'Orquestación de containers a gran escala.', triggerType: TriggerType.MANUAL },
  { slug: 'terraform-titan', name: 'Terraform Titan', emoji: '🏗️', tier: 'silver', category: 'devops', description: 'Infraestructura como código impecable.', triggerType: TriggerType.MANUAL },
  { slug: 'monitoring-maven', name: 'Monitoring Maven', emoji: '📊', tier: 'silver', category: 'devops', description: 'Observabilidad completa del sistema.', triggerType: TriggerType.MANUAL },
  { slug: 'security-sentinel', name: 'Security Sentinel', emoji: '🛡️', tier: 'gold', category: 'devops', description: 'Seguridad en cada capa.', triggerType: TriggerType.MANUAL },
  { slug: 'aws-architect', name: 'AWS Architect', emoji: '🌩️', tier: 'gold', category: 'devops', description: 'Arquitectura AWS a nivel profesional.', triggerType: TriggerType.MANUAL },
  { slug: 'gcp-guru', name: 'GCP Guru', emoji: '🌈', tier: 'silver', category: 'devops', description: 'Google Cloud Platform expert.', triggerType: TriggerType.MANUAL },
  { slug: 'azure-ace', name: 'Azure Ace', emoji: '💠', tier: 'silver', category: 'devops', description: 'Microsoft Azure master.', triggerType: TriggerType.MANUAL },
  { slug: 'sre-specialist', name: 'SRE Specialist', emoji: '⚙️', tier: 'gold', category: 'devops', description: 'Site Reliability Engineering.', triggerType: TriggerType.MANUAL },
  
  // COLLABORATION (12)
  { slug: 'mentor', name: 'Mentor', emoji: '🧑‍🏫', tier: 'bronze', category: 'collaboration', description: 'Guía a compañeros nuevos en el equipo.', triggerType: TriggerType.MANUAL },
  { slug: 'mentor-master', name: 'Mentor Master', emoji: '🎓', tier: 'gold', category: 'collaboration', description: 'Ha guiado a 20+ colegas al éxito.', triggerType: TriggerType.MANUAL },
  { slug: 'team-spirit', name: 'Team Spirit', emoji: '🤝', tier: 'silver', category: 'collaboration', description: 'Mantiene la moral alta del equipo.', triggerType: TriggerType.KUDOS_RECEIVED, triggerValue: 50 },
  { slug: 'code-reviewer', name: 'Code Reviewer', emoji: '🔎', tier: 'silver', category: 'collaboration', description: 'Reviews detallados y constructivos.', triggerType: TriggerType.CODE_REVIEWS, triggerValue: 100 },
  { slug: 'pair-programmer', name: 'Pair Programmer', emoji: '👥', tier: 'silver', category: 'collaboration', description: 'Programación en pareja efectiva.', triggerType: TriggerType.MANUAL },
  { slug: 'knowledge-sharer', name: 'Knowledge Sharer', emoji: '📚', tier: 'silver', category: 'collaboration', description: 'Comparte conocimiento con el equipo.', triggerType: TriggerType.MANUAL },
  { slug: 'conflict-resolver', name: 'Conflict Resolver', emoji: '🕊️', tier: 'silver', category: 'collaboration', description: 'Resuelve conflictos con diplomacia.', triggerType: TriggerType.MANUAL },
  { slug: 'feedback-friend', name: 'Feedback Friend', emoji: '💬', tier: 'bronze', category: 'collaboration', description: 'Da feedback constructivo siempre.', triggerType: TriggerType.KUDOS_SENT, triggerValue: 20 },
  { slug: 'culture-champion', name: 'Culture Champion', emoji: '🎭', tier: 'silver', category: 'collaboration', description: 'Promueve la cultura del equipo.', triggerType: TriggerType.MANUAL },
  { slug: 'remote-rockstar', name: 'Remote Rockstar', emoji: '🏠', tier: 'silver', category: 'collaboration', description: 'Excelente colaboración remota.', triggerType: TriggerType.MANUAL },
  { slug: 'onboarding-hero', name: 'Onboarding Hero', emoji: '🦸', tier: 'silver', category: 'collaboration', description: 'Hace el onboarding memorable.', triggerType: TriggerType.MANUAL },
  { slug: 'community-builder', name: 'Community Builder', emoji: '🌱', tier: 'gold', category: 'collaboration', description: 'Construye comunidad interna.', triggerType: TriggerType.MANUAL },
  
  // LEADERSHIP (10)
  { slug: 'crisis-averted', name: 'Crisis Averted', emoji: '🚨', tier: 'gold', category: 'leadership', description: 'Salvó el deploy en un momento crítico.', triggerType: TriggerType.MANUAL },
  { slug: 'sprint-hero', name: 'Sprint Hero', emoji: '🏃', tier: 'silver', category: 'leadership', description: 'Entrega excepcional en el sprint.', triggerType: TriggerType.MANUAL },
  { slug: 'architect', name: 'Architect', emoji: '🏛️', tier: 'gold', category: 'leadership', description: 'Arquitectura sólida y escalable.', triggerType: TriggerType.MANUAL },
  { slug: 'tech-lead', name: 'Tech Lead', emoji: '👑', tier: 'gold', category: 'leadership', description: 'Lidera decisiones técnicas con visión.', triggerType: TriggerType.MANUAL },
  { slug: 'decision-maker', name: 'Decision Maker', emoji: '⚖️', tier: 'silver', category: 'leadership', description: 'Toma decisiones difíciles con criterio.', triggerType: TriggerType.MANUAL },
  { slug: 'project-captain', name: 'Project Captain', emoji: '🧭', tier: 'silver', category: 'leadership', description: 'Lleva proyectos a buen puerto.', triggerType: TriggerType.MANUAL },
  { slug: 'innovation-leader', name: 'Innovation Leader', emoji: '💡', tier: 'gold', category: 'leadership', description: 'Impulsa innovación en el equipo.', triggerType: TriggerType.MANUAL },
  { slug: 'change-agent', name: 'Change Agent', emoji: '🔄', tier: 'silver', category: 'leadership', description: 'Facilita el cambio organizacional.', triggerType: TriggerType.MANUAL },
  { slug: 'stakeholder-whisperer', name: 'Stakeholder Whisperer', emoji: '🗣️', tier: 'silver', category: 'leadership', description: 'Comunica con stakeholders experto.', triggerType: TriggerType.MANUAL },
  { slug: 'roadmap-visionary', name: 'Roadmap Visionary', emoji: '🗺️', tier: 'gold', category: 'leadership', description: 'Visión de producto a largo plazo.', triggerType: TriggerType.MANUAL },
  
  // DOCUMENTATION (8)
  { slug: 'docs-hero', name: 'Docs Hero', emoji: '📖', tier: 'bronze', category: 'documentation', description: 'Documentación clara para todo el equipo.', triggerType: TriggerType.MANUAL },
  { slug: 'api-designer', name: 'API Designer', emoji: '📋', tier: 'silver', category: 'documentation', description: 'APIs bien diseñadas y documentadas.', triggerType: TriggerType.MANUAL },
  { slug: 'open-source', name: 'Open Source', emoji: '🌍', tier: 'silver', category: 'documentation', description: 'Contribuciones a proyectos open source.', triggerType: TriggerType.MANUAL },
  { slug: 'readme-writer', name: 'README Writer', emoji: '📄', tier: 'bronze', category: 'documentation', description: 'READMEs que la gente lee.', triggerType: TriggerType.MANUAL },
  { slug: 'wiki-wizard', name: 'Wiki Wizard', emoji: '📚', tier: 'silver', category: 'documentation', description: 'Wikis organizados y útiles.', triggerType: TriggerType.MANUAL },
  { slug: 'diagram-artist', name: 'Diagram Artist', emoji: '🎨', tier: 'bronze', category: 'documentation', description: 'Diagramas que explican todo.', triggerType: TriggerType.MANUAL },
  { slug: 'changelog-keeper', name: 'Changelog Keeper', emoji: '📝', tier: 'bronze', category: 'documentation', description: 'Changelogs detallados siempre.', triggerType: TriggerType.MANUAL },
  { slug: 'tutorial-teacher', name: 'Tutorial Teacher', emoji: '🎬', tier: 'silver', category: 'documentation', description: 'Tutoriales que enseñan de verdad.', triggerType: TriggerType.MANUAL },
  
  // QUALITY (10)
  { slug: 'zero-bugs', name: 'Zero Bugs', emoji: '🎯', tier: 'gold', category: 'quality', description: 'Código sin bugs en producción.', triggerType: TriggerType.MANUAL },
  { slug: 'qa-champion', name: 'QA Champion', emoji: '🔬', tier: 'silver', category: 'quality', description: 'Testing riguroso y completo.', triggerType: TriggerType.MANUAL },
  { slug: 'accessibility-advocate', name: 'Accessibility Advocate', emoji: '♿', tier: 'silver', category: 'quality', description: 'Accesibilidad como prioridad.', triggerType: TriggerType.MANUAL },
  { slug: 'performance-guardian', name: 'Performance Guardian', emoji: '📈', tier: 'silver', category: 'quality', description: 'Vigila el rendimiento constante.', triggerType: TriggerType.MANUAL },
  { slug: 'code-coverage-king', name: 'Code Coverage King', emoji: '📊', tier: 'silver', category: 'quality', description: 'Cobertura de tests impecable.', triggerType: TriggerType.MANUAL },
  { slug: 'load-tester', name: 'Load Tester', emoji: '🏋️', tier: 'silver', category: 'quality', description: 'Tests de carga profesionales.', triggerType: TriggerType.MANUAL },
  { slug: 'e2e-expert', name: 'E2E Expert', emoji: '🔄', tier: 'silver', category: 'quality', description: 'Tests end-to-end robustos.', triggerType: TriggerType.MANUAL },
  { slug: 'security-scanner', name: 'Security Scanner', emoji: '🔒', tier: 'silver', category: 'quality', description: 'Escaneo de vulnerabilidades.', triggerType: TriggerType.MANUAL },
  { slug: 'tech-debt-fighter', name: 'Tech Debt Fighter', emoji: '⚔️', tier: 'silver', category: 'quality', description: 'Reduce deuda técnica activamente.', triggerType: TriggerType.MANUAL },
  { slug: 'standards-setter', name: 'Standards Setter', emoji: '📏', tier: 'silver', category: 'quality', description: 'Define estándares del equipo.', triggerType: TriggerType.MANUAL },
  
  // INNOVATION (10)
  { slug: 'hackathon-winner', name: 'Hackathon Winner', emoji: '🏆', tier: 'gold', category: 'innovation', description: 'Ganador de hackathon interno.', triggerType: TriggerType.MANUAL },
  { slug: 'poc-pioneer', name: 'PoC Pioneer', emoji: '🧪', tier: 'silver', category: 'innovation', description: 'Proof of Concepts que convencen.', triggerType: TriggerType.MANUAL },
  { slug: 'tech-explorer', name: 'Tech Explorer', emoji: '🔭', tier: 'bronze', category: 'innovation', description: 'Explora nuevas tecnologías.', triggerType: TriggerType.MANUAL },
  { slug: 'automation-ace', name: 'Automation Ace', emoji: '🤖', tier: 'silver', category: 'innovation', description: 'Automatiza todo lo repetitivo.', triggerType: TriggerType.MANUAL },
  { slug: 'tool-builder', name: 'Tool Builder', emoji: '🔧', tier: 'silver', category: 'innovation', description: 'Crea herramientas para el equipo.', triggerType: TriggerType.MANUAL },
  { slug: 'ai-integrator', name: 'AI Integrator', emoji: '🧠', tier: 'gold', category: 'innovation', description: 'Integra IA de forma práctica.', triggerType: TriggerType.MANUAL },
  { slug: 'patent-holder', name: 'Patent Holder', emoji: '📜', tier: 'gold', category: 'innovation', description: 'Inventor con patente registrada.', triggerType: TriggerType.MANUAL },
  { slug: 'research-lead', name: 'Research Lead', emoji: '🔬', tier: 'silver', category: 'innovation', description: 'Lidera investigación técnica.', triggerType: TriggerType.MANUAL },
  { slug: 'early-adopter', name: 'Early Adopter', emoji: '🚀', tier: 'bronze', category: 'innovation', description: 'Primero en adoptar lo nuevo.', triggerType: TriggerType.MANUAL },
  { slug: 'disruptor', name: 'Disruptor', emoji: '💥', tier: 'gold', category: 'innovation', description: 'Ideas que cambian el juego.', triggerType: TriggerType.MANUAL },
  
  // SPECIAL (8)
  { slug: 'ursol-founder', name: 'Ursol Founder', emoji: '⭐', tier: 'gold', category: 'special', description: 'Founder of Sistemas Ursol.', triggerType: TriggerType.MANUAL },
  { slug: 'anniversary-1', name: '1 Year', emoji: '🎂', tier: 'bronze', category: 'special', description: '1 year at the organization.', triggerType: TriggerType.TENURE_DAYS, triggerValue: 365 },
  { slug: 'anniversary-3', name: '3 Years', emoji: '🎉', tier: 'silver', category: 'special', description: '3 years at the organization.', triggerType: TriggerType.TENURE_DAYS, triggerValue: 1095 },
  { slug: 'anniversary-5', name: '5 Years', emoji: '🏅', tier: 'gold', category: 'special', description: '5 years at the organization.', triggerType: TriggerType.TENURE_DAYS, triggerValue: 1825 },
  { slug: 'boomflow-creator', name: 'BOOMFLOW Creator', emoji: '🚀', tier: 'gold', category: 'special', description: 'Creator of the BOOMFLOW system.', triggerType: TriggerType.MANUAL },
  { slug: 'first-100', name: 'First 100', emoji: '💯', tier: 'silver', category: 'special', description: 'Among the first 100 users.', triggerType: TriggerType.MANUAL },
  { slug: 'mvp', name: 'MVP', emoji: '🌟', tier: 'gold', category: 'special', description: 'Most Valuable Player of the quarter.', triggerType: TriggerType.MANUAL },
  { slug: 'legend', name: 'Legend', emoji: '🏛️', tier: 'gold', category: 'special', description: 'Legendary contribution to the team.', triggerType: TriggerType.MANUAL },

  // COMMUNITY - Peer-to-Peer Badges (4)
  { slug: 'resonancia', name: 'Resonance', emoji: '🔔', tier: 'bronze', category: 'community', description: 'Received first peer-to-peer badge.', triggerType: TriggerType.PEER_AWARDS_COUNT, triggerValue: 1 },
  { slug: 'vinculo-fuerte', name: 'Strong Bond', emoji: '🔗', tier: 'silver', category: 'community', description: 'Received 5+ peer badges from different colleagues.', triggerType: TriggerType.PEER_AWARDS_COUNT, triggerValue: 5 },
  { slug: 'alma-del-equipo', name: 'Team Soul', emoji: '💎', tier: 'gold', category: 'community', description: 'Received 10+ peer badges. True team pillar.', triggerType: TriggerType.PEER_AWARDS_COUNT, triggerValue: 10 },
  { slug: 'generous-spirit', name: 'Generous Spirit', emoji: '🎁', tier: 'silver', category: 'community', description: 'Awarded all available peer badges this year.', triggerType: TriggerType.MANUAL_PEER_AWARD },

  // PREMIUM - Patron/Supporter Badges (4)
  { slug: 'patron-seed', name: 'Patron Seed', emoji: '🌱', tier: 'bronze', category: 'premium', description: 'Early supporter of BOOMFLOW platform.', triggerType: TriggerType.INVESTMENT },
  { slug: 'patron-growth', name: 'Patron Growth', emoji: '🌿', tier: 'silver', category: 'premium', description: 'Sustained supporter with continued investment.', triggerType: TriggerType.INVESTMENT },
  { slug: 'patron-bloom', name: 'Patron Bloom', emoji: '🌸', tier: 'gold', category: 'premium', description: 'Major supporter enabling platform growth.', triggerType: TriggerType.INVESTMENT },
  { slug: 'eco-champion', name: 'Eco Champion', emoji: '🌍', tier: 'gold', category: 'premium', description: 'Champion of the BOOMFLOW ecosystem.', triggerType: TriggerType.MANUAL },
]

// Kudo Categories
const KUDO_CATEGORIES = [
  { name: 'Teamwork', emoji: '🤝', description: 'Collaboration and support' },
  { name: 'Innovation', emoji: '💡', description: 'Creative ideas and solutions' },
  { name: 'Quality', emoji: '✨', description: 'Excellence in work' },
  { name: 'Mentorship', emoji: '🎓', description: 'Teaching and guidance' },
  { name: 'Communication', emoji: '💬', description: 'Clarity and effectiveness' },
  { name: 'Leadership', emoji: '👑', description: 'Guiding and motivating' },
  { name: 'Resilience', emoji: '💪', description: 'Overcoming challenges' },
  { name: 'Speed', emoji: '⚡', description: 'Fast delivery' },
]

// Default Badge Skins
const BADGE_SKINS = [
  { name: 'Crystal', slug: 'crystal', description: 'Gem-like crystal design with faceted edges', style: SkinStyle.CRYSTAL, isDefault: true, isPremium: false },
  { name: 'Academic', slug: 'academic', description: 'Formal scholarly design with laurel motifs', style: SkinStyle.ACADEMIC, isDefault: false, isPremium: false },
  { name: 'Minimalist', slug: 'minimalist', description: 'Clean, simple design with subtle elegance', style: SkinStyle.MINIMALIST, isDefault: false, isPremium: false },
  { name: 'Vintage', slug: 'vintage', description: 'Classic retro design with ornate details', style: SkinStyle.VINTAGE, isDefault: false, isPremium: true },
  { name: 'Neon', slug: 'neon', description: 'Vibrant glowing design with modern aesthetics', style: SkinStyle.NEON, isDefault: false, isPremium: true },
]

// SVG generator for badges
function generateBadgeSvg(emoji: string, name: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140">
  <defs>
    <linearGradient id="bg-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <path d="M60 5 L110 35 L110 95 L60 135 L10 95 L10 35 Z" fill="url(#bg-${name})" stroke="#4a4a6a" stroke-width="2"/>
  <text x="60" y="70" font-size="40" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  <text x="60" y="115" font-size="8" fill="#a0a0c0" text-anchor="middle" font-family="sans-serif">${name}</text>
</svg>`
}

// SVG generator for badge skin preview
function generateSkinSvg(style: SkinStyle): string {
  const styles: Record<SkinStyle, { bg: string, stroke: string, accent: string }> = {
    [SkinStyle.DEFAULT]: { bg: '#1a1a2e', stroke: '#4a4a6a', accent: '#a0a0c0' },
    [SkinStyle.CRYSTAL]: { bg: '#0f172a', stroke: '#38bdf8', accent: '#7dd3fc' },
    [SkinStyle.ACADEMIC]: { bg: '#1c1917', stroke: '#d4af37', accent: '#fbbf24' },
    [SkinStyle.MINIMALIST]: { bg: '#f8fafc', stroke: '#cbd5e1', accent: '#64748b' },
    [SkinStyle.VINTAGE]: { bg: '#292524', stroke: '#a16207', accent: '#ca8a04' },
    [SkinStyle.NEON]: { bg: '#0c0a09', stroke: '#d946ef', accent: '#f472b6' },
  }
  const s = styles[style]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140">
  <defs>
    <linearGradient id="skin-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${s.bg}"/>
      <stop offset="100%" style="stop-color:${s.bg}"/>
    </linearGradient>
  </defs>
  <path d="M60 5 L110 35 L110 95 L60 135 L10 95 L10 35 Z" fill="url(#skin-bg)" stroke="${s.stroke}" stroke-width="3"/>
  <circle cx="60" cy="65" r="25" fill="none" stroke="${s.accent}" stroke-width="2"/>
  <text x="60" y="115" font-size="10" fill="${s.accent}" text-anchor="middle" font-family="sans-serif">${style}</text>
</svg>`
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.badgeSkin.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.kudo.deleteMany()
  await prisma.kudoCategory.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.team.deleteMany()
  await prisma.organization.deleteMany()

  // Create demo organization
  console.log('🏢 Creating demo organization...')
  const org = await prisma.organization.create({
    data: {
      name: 'Sistemas Ursol',
      slug: 'sistemas-ursol',
      description: 'BOOMFLOW demo organization',
    },
  })

  // Create demo team
  console.log('👥 Creating demo team...')
  const team = await prisma.team.create({
    data: {
      name: 'Development',
      slug: 'development',
      description: 'Development team',
      organizationId: org.id,
    },
  })

  // Create kudo categories
  console.log('🏷️ Creating kudo categories...')
  for (const cat of KUDO_CATEGORIES) {
    await prisma.kudoCategory.create({
      data: cat,
    })
  }

  // Create badges
  console.log('🎖️ Creating badges...')
  let badgeCount = 0
  for (const badge of BADGES) {
    await prisma.badge.create({
      data: {
        name: badge.name,
        slug: badge.slug,
        description: badge.description,
        svgIcon: generateBadgeSvg(badge.emoji, badge.name),
        category: categoryMap[badge.category],
        tier: tierMap[badge.tier],
        isAutomatic: badge.triggerType !== TriggerType.MANUAL,
        triggerType: badge.triggerType,
        triggerValue: badge.triggerValue || null,
      },
    })
    badgeCount++
  }
  console.log(`✅ Created ${badgeCount} badges`)

  // Create badge skins
  console.log('🎨 Creating badge skins...')
  for (const skin of BADGE_SKINS) {
    await prisma.badgeSkin.create({
      data: {
        name: skin.name,
        slug: skin.slug,
        description: skin.description,
        svgIcon: generateSkinSvg(skin.style),
        style: skin.style,
        isDefault: skin.isDefault,
        isPremium: skin.isPremium,
      },
    })
  }
  console.log(`✅ Created ${BADGE_SKINS.length} badge skins`)

  // Create demo users
  console.log('👤 Creating demo users...')
  const ursolcr = await prisma.user.create({
    data: {
      email: 'ursolcr@example.com',
      name: 'ursolcr',
      username: 'ursolcr',
      githubId: '123456',
      organizationId: org.id,
      teamId: team.id,
    },
  })

  const jeremySud = await prisma.user.create({
    data: {
      email: 'jeremy@example.com',
      name: 'Jeremy Sud',
      username: 'jeremy-sud',
      githubId: '789012',
      organizationId: org.id,
      teamId: team.id,
    },
  })

  // Assign badges to demo users
  console.log('🎖️ Assigning badges to demo users...')
  const ursolBadges = ['ursol-founder', 'boomflow-creator', 'hello-world', 'first-commit', 'first-pr', 'first-review', 'code-ninja', 'mentor-master', 'team-spirit', 'architect']
  const jeremyBadges = ['hello-world', 'first-commit', 'first-pr', 'first-review', 'code-ninja', 'team-spirit']

  for (const slug of ursolBadges) {
    const badge = await prisma.badge.findUnique({ where: { slug } })
    if (badge) {
      await prisma.userBadge.create({
        data: {
          userId: ursolcr.id,
          badgeId: badge.id,
          awardedBy: 'system',
          reason: 'Initial badge',
        },
      })
    }
  }

  for (const slug of jeremyBadges) {
    const badge = await prisma.badge.findUnique({ where: { slug } })
    if (badge) {
      await prisma.userBadge.create({
        data: {
          userId: jeremySud.id,
          badgeId: badge.id,
          awardedBy: 'system',
          reason: 'Initial badge',
        },
      })
    }
  }

  // Create kudos between users
  console.log('💬 Creating demo kudos...')
  const teamworkCategory = await prisma.kudoCategory.findUnique({ where: { name: 'Teamwork' } })
  const innovationCategory = await prisma.kudoCategory.findUnique({ where: { name: 'Innovation' } })

  await prisma.kudo.createMany({
    data: [
      { fromId: ursolcr.id, toId: jeremySud.id, message: 'Excellent work on the new feature!', categoryId: teamworkCategory?.id },
      { fromId: jeremySud.id, toId: ursolcr.id, message: 'Thanks for the mentoring, learned a lot.', categoryId: innovationCategory?.id },
      { fromId: ursolcr.id, toId: jeremySud.id, message: 'Great collaboration during the sprint.', categoryId: teamworkCategory?.id },
    ],
  })

  console.log('✅ Seed completed!')
  console.log(`
📊 Summary:
- 1 Organization: Sistemas Ursol
- 1 Team: Development
- 8 Kudo Categories
- ${badgeCount} Badges
- ${BADGE_SKINS.length} Badge Skins
- 2 Users (ursolcr, jeremy-sud)
- 3 Demo Kudos
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
