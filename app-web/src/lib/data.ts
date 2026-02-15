// Datos mock centralizados para BOOMFLOW Dashboard
// En producción esto vendrá de la API/Base de datos

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  tier: 'bronze' | 'silver' | 'gold';
  category: string;
  description: string;
  howToGet: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  badges: string[]; // badge IDs
  kudosReceived: number;
  kudosGiven: number;
  streak: number;
  joinedAt: string;
}

export interface Activity {
  id: string;
  type: 'badge_earned' | 'kudo_sent' | 'kudo_received' | 'milestone';
  userId: string;
  targetUserId?: string;
  badgeId?: string;
  message?: string;
  timestamp: string;
}

// ============================================
// BADGE CATALOG - Todas las 89 medallas
// ============================================

export const BADGE_CATALOG: Badge[] = [
  // ONBOARDING (4)
  { id: 'hello-world', name: 'Hello World', emoji: '👋', tier: 'bronze', category: 'onboarding', description: 'Primer día en el equipo. ¡Bienvenido!', howToGet: 'Unirse al equipo de Sistemas Ursol' },
  { id: 'first-commit', name: 'First Commit', emoji: '📝', tier: 'bronze', category: 'onboarding', description: 'Primer commit al repositorio del equipo.', howToGet: 'Hacer tu primer commit en cualquier repo de la org' },
  { id: 'first-pr', name: 'First PR', emoji: '🔀', tier: 'bronze', category: 'onboarding', description: 'Primer Pull Request aprobado y mergeado.', howToGet: 'Mergear tu primer PR' },
  { id: 'first-review', name: 'First Review', emoji: '👀', tier: 'bronze', category: 'onboarding', description: 'Primera code review realizada.', howToGet: 'Revisar el código de un compañero' },
  
  // CODING (15)
  { id: 'code-ninja', name: 'Code Ninja', emoji: '🥷', tier: 'silver', category: 'coding', description: 'Código limpio, rápido y eficiente.', howToGet: '10+ PRs con código de alta calidad' },
  { id: 'bug-hunter', name: 'Bug Hunter', emoji: '🐛', tier: 'silver', category: 'coding', description: 'Detecta y corrige bugs antes de producción.', howToGet: 'Encontrar y corregir 20+ bugs' },
  { id: 'refactor-master', name: 'Refactor Master', emoji: '♻️', tier: 'silver', category: 'coding', description: 'Mejora código legado sin romper funcionalidad.', howToGet: 'Refactorizar 5+ módulos críticos' },
  { id: 'algorithm-ace', name: 'Algorithm Ace', emoji: '🧮', tier: 'gold', category: 'coding', description: 'Resuelve problemas complejos con algoritmos óptimos.', howToGet: 'Implementar algoritmos que mejoren performance 10x' },
  { id: 'clean-code', name: 'Clean Code', emoji: '✨', tier: 'silver', category: 'coding', description: 'Código legible, documentado y mantenible.', howToGet: 'Mantener 95%+ code coverage y documentación' },
  { id: 'full-stack', name: 'Full Stack', emoji: '🌐', tier: 'gold', category: 'coding', description: 'Domina frontend y backend con soltura.', howToGet: 'Contribuir significativamente a ambos lados' },
  { id: 'typescript-wizard', name: 'TypeScript Wizard', emoji: '🔷', tier: 'silver', category: 'coding', description: 'Tipado estricto y genéricos avanzados.', howToGet: 'Escribir tipos complejos que prevengan bugs' },
  { id: 'python-master', name: 'Python Master', emoji: '🐍', tier: 'silver', category: 'coding', description: 'Dominio avanzado de Python.', howToGet: 'Liderar proyectos Python exitosos' },
  { id: 'rust-pioneer', name: 'Rust Pioneer', emoji: '🦀', tier: 'gold', category: 'coding', description: 'Programación de sistemas en Rust.', howToGet: 'Implementar componentes críticos en Rust' },
  { id: 'regex-guru', name: 'Regex Guru', emoji: '🔍', tier: 'bronze', category: 'coding', description: 'Expresiones regulares complejas.', howToGet: 'Escribir regex que otros no pueden leer' },
  { id: 'sql-sorcerer', name: 'SQL Sorcerer', emoji: '🗃️', tier: 'silver', category: 'coding', description: 'Queries optimizados y diseño de DB.', howToGet: 'Optimizar queries críticos' },
  { id: 'api-artisan', name: 'API Artisan', emoji: '🔗', tier: 'silver', category: 'coding', description: 'APIs RESTful bien diseñadas.', howToGet: 'Diseñar APIs usadas por el equipo' },
  { id: 'graphql-guru', name: 'GraphQL Guru', emoji: '◈', tier: 'silver', category: 'coding', description: 'Schemas y resolvers eficientes.', howToGet: 'Implementar API GraphQL en producción' },
  { id: 'test-champion', name: 'Test Champion', emoji: '✅', tier: 'silver', category: 'coding', description: 'Tests robustos y alta cobertura.', howToGet: '90%+ coverage en proyectos clave' },
  { id: 'performance-ninja', name: 'Performance Ninja', emoji: '⚡', tier: 'gold', category: 'coding', description: 'Optimización extrema de rendimiento.', howToGet: 'Reducir tiempos de carga 50%+' },
  
  // DEVOPS (12)
  { id: 'pipeline-pro', name: 'Pipeline Pro', emoji: '🔄', tier: 'silver', category: 'devops', description: 'Pipelines de CI/CD rápidos y confiables.', howToGet: 'Configurar pipelines para 5+ proyectos' },
  { id: 'docker-captain', name: 'Docker Captain', emoji: '🐳', tier: 'silver', category: 'devops', description: 'Containerización limpia y eficiente.', howToGet: 'Dockerizar aplicaciones de producción' },
  { id: 'cloud-deployer', name: 'Cloud Deployer', emoji: '☁️', tier: 'gold', category: 'devops', description: 'Despliegues en la nube sin downtime.', howToGet: 'Implementar zero-downtime deployments' },
  { id: 'cicd-master', name: 'CI/CD Master', emoji: '🚀', tier: 'gold', category: 'devops', description: 'Automatización total del ciclo de desarrollo.', howToGet: 'Automatizar todo el flujo de deployment' },
  { id: 'kubernetes-king', name: 'Kubernetes King', emoji: '☸️', tier: 'gold', category: 'devops', description: 'Orquestación de containers a gran escala.', howToGet: 'Administrar clusters de producción' },
  { id: 'terraform-titan', name: 'Terraform Titan', emoji: '🏗️', tier: 'silver', category: 'devops', description: 'Infraestructura como código impecable.', howToGet: 'IaC para toda la infraestructura' },
  { id: 'monitoring-maven', name: 'Monitoring Maven', emoji: '📊', tier: 'silver', category: 'devops', description: 'Observabilidad completa del sistema.', howToGet: 'Implementar dashboards y alertas' },
  { id: 'security-sentinel', name: 'Security Sentinel', emoji: '🛡️', tier: 'gold', category: 'devops', description: 'Seguridad en cada capa.', howToGet: 'Implementar security best practices' },
  { id: 'aws-architect', name: 'AWS Architect', emoji: '🌩️', tier: 'gold', category: 'devops', description: 'Arquitectura AWS a nivel profesional.', howToGet: 'Diseñar arquitecturas AWS escalables' },
  { id: 'gcp-guru', name: 'GCP Guru', emoji: '🌈', tier: 'silver', category: 'devops', description: 'Google Cloud Platform expert.', howToGet: 'Implementar soluciones en GCP' },
  { id: 'azure-ace', name: 'Azure Ace', emoji: '💠', tier: 'silver', category: 'devops', description: 'Microsoft Azure master.', howToGet: 'Implementar soluciones en Azure' },
  { id: 'sre-specialist', name: 'SRE Specialist', emoji: '⚙️', tier: 'gold', category: 'devops', description: 'Site Reliability Engineering.', howToGet: 'Mantener 99.9% uptime' },
  
  // COLLABORATION (12)
  { id: 'mentor', name: 'Mentor', emoji: '🧑‍🏫', tier: 'bronze', category: 'collaboration', description: 'Guía a compañeros nuevos en el equipo.', howToGet: 'Mentorear a 3+ nuevos miembros' },
  { id: 'mentor-master', name: 'Mentor Master', emoji: '🎓', tier: 'gold', category: 'collaboration', description: 'Ha guiado a 20+ colegas al éxito.', howToGet: 'Mentorear a 20+ personas' },
  { id: 'team-spirit', name: 'Team Spirit', emoji: '🤝', tier: 'silver', category: 'collaboration', description: 'Mantiene la moral alta del equipo.', howToGet: 'Reconocido por el equipo por su actitud' },
  { id: 'code-reviewer', name: 'Code Reviewer', emoji: '🔎', tier: 'silver', category: 'collaboration', description: 'Reviews detallados y constructivos.', howToGet: 'Hacer 100+ code reviews de calidad' },
  { id: 'pair-programmer', name: 'Pair Programmer', emoji: '👥', tier: 'silver', category: 'collaboration', description: 'Programación en pareja efectiva.', howToGet: 'Sesiones regulares de pairing' },
  { id: 'knowledge-sharer', name: 'Knowledge Sharer', emoji: '📚', tier: 'silver', category: 'collaboration', description: 'Comparte conocimiento con el equipo.', howToGet: 'Dar 5+ tech talks o workshops' },
  { id: 'conflict-resolver', name: 'Conflict Resolver', emoji: '🕊️', tier: 'silver', category: 'collaboration', description: 'Resuelve conflictos con diplomacia.', howToGet: 'Mediar en desacuerdos técnicos' },
  { id: 'feedback-friend', name: 'Feedback Friend', emoji: '💬', tier: 'bronze', category: 'collaboration', description: 'Da feedback constructivo siempre.', howToGet: 'Ser reconocido por dar buen feedback' },
  { id: 'culture-champion', name: 'Culture Champion', emoji: '🎭', tier: 'silver', category: 'collaboration', description: 'Promueve la cultura del equipo.', howToGet: 'Organizar eventos de team building' },
  { id: 'remote-rockstar', name: 'Remote Rockstar', emoji: '🏠', tier: 'silver', category: 'collaboration', description: 'Excelente colaboración remota.', howToGet: 'Destacar en trabajo remoto' },
  { id: 'onboarding-hero', name: 'Onboarding Hero', emoji: '🦸', tier: 'silver', category: 'collaboration', description: 'Hace el onboarding memorable.', howToGet: 'Crear materiales de onboarding' },
  { id: 'community-builder', name: 'Community Builder', emoji: '🌱', tier: 'gold', category: 'collaboration', description: 'Construye comunidad interna.', howToGet: 'Crear comunidades de práctica' },
  
  // LEADERSHIP (10)
  { id: 'crisis-averted', name: 'Crisis Averted', emoji: '🚨', tier: 'gold', category: 'leadership', description: 'Salvó el deploy en un momento crítico.', howToGet: 'Resolver crisis de producción' },
  { id: 'sprint-hero', name: 'Sprint Hero', emoji: '🏃', tier: 'silver', category: 'leadership', description: 'Entrega excepcional en el sprint.', howToGet: 'Destacar en 5+ sprints consecutivos' },
  { id: 'architect', name: 'Architect', emoji: '🏛️', tier: 'gold', category: 'leadership', description: 'Arquitectura sólida y escalable.', howToGet: 'Diseñar arquitectura de sistema crítico' },
  { id: 'tech-lead', name: 'Tech Lead', emoji: '👑', tier: 'gold', category: 'leadership', description: 'Lidera decisiones técnicas con visión.', howToGet: 'Liderar equipo técnico exitosamente' },
  { id: 'decision-maker', name: 'Decision Maker', emoji: '⚖️', tier: 'silver', category: 'leadership', description: 'Toma decisiones difíciles con criterio.', howToGet: 'Tomar decisiones que beneficien al equipo' },
  { id: 'project-captain', name: 'Project Captain', emoji: '🧭', tier: 'silver', category: 'leadership', description: 'Lleva proyectos a buen puerto.', howToGet: 'Liderar proyecto de principio a fin' },
  { id: 'innovation-leader', name: 'Innovation Leader', emoji: '💡', tier: 'gold', category: 'leadership', description: 'Impulsa innovación en el equipo.', howToGet: 'Proponer e implementar innovaciones' },
  { id: 'change-agent', name: 'Change Agent', emoji: '🔄', tier: 'silver', category: 'leadership', description: 'Facilita el cambio organizacional.', howToGet: 'Liderar transformaciones exitosas' },
  { id: 'stakeholder-whisperer', name: 'Stakeholder Whisperer', emoji: '🗣️', tier: 'silver', category: 'leadership', description: 'Comunica con stakeholders experto.', howToGet: 'Gestionar expectativas de stakeholders' },
  { id: 'roadmap-visionary', name: 'Roadmap Visionary', emoji: '🗺️', tier: 'gold', category: 'leadership', description: 'Visión de producto a largo plazo.', howToGet: 'Definir roadmap técnico adoptado' },
  
  // DOCUMENTATION (8)
  { id: 'docs-hero', name: 'Docs Hero', emoji: '📖', tier: 'bronze', category: 'documentation', description: 'Documentación clara para todo el equipo.', howToGet: 'Escribir documentación de calidad' },
  { id: 'api-designer', name: 'API Designer', emoji: '📋', tier: 'silver', category: 'documentation', description: 'APIs bien diseñadas y documentadas.', howToGet: 'Documentar APIs completamente' },
  { id: 'open-source', name: 'Open Source', emoji: '🌍', tier: 'silver', category: 'documentation', description: 'Contribuciones a proyectos open source.', howToGet: 'Contribuir a OSS reconocidos' },
  { id: 'readme-writer', name: 'README Writer', emoji: '📄', tier: 'bronze', category: 'documentation', description: 'READMEs que la gente lee.', howToGet: 'Escribir READMEs ejemplares' },
  { id: 'wiki-wizard', name: 'Wiki Wizard', emoji: '📚', tier: 'silver', category: 'documentation', description: 'Wikis organizados y útiles.', howToGet: 'Mantener wiki del equipo' },
  { id: 'diagram-artist', name: 'Diagram Artist', emoji: '🎨', tier: 'bronze', category: 'documentation', description: 'Diagramas que explican todo.', howToGet: 'Crear diagramas de arquitectura claros' },
  { id: 'changelog-keeper', name: 'Changelog Keeper', emoji: '📝', tier: 'bronze', category: 'documentation', description: 'Changelogs detallados siempre.', howToGet: 'Mantener changelogs actualizados' },
  { id: 'tutorial-teacher', name: 'Tutorial Teacher', emoji: '🎬', tier: 'silver', category: 'documentation', description: 'Tutoriales que enseñan de verdad.', howToGet: 'Crear tutoriales para el equipo' },
  
  // QUALITY (10)
  { id: 'zero-bugs', name: 'Zero Bugs', emoji: '🎯', tier: 'gold', category: 'quality', description: 'Código sin bugs en producción.', howToGet: 'Sprint sin bugs reportados' },
  { id: 'qa-champion', name: 'QA Champion', emoji: '🔬', tier: 'silver', category: 'quality', description: 'Testing riguroso y completo.', howToGet: 'Implementar estrategia de QA' },
  { id: 'accessibility-advocate', name: 'Accessibility Advocate', emoji: '♿', tier: 'silver', category: 'quality', description: 'Accesibilidad como prioridad.', howToGet: 'Implementar a11y en proyectos' },
  { id: 'performance-guardian', name: 'Performance Guardian', emoji: '📈', tier: 'silver', category: 'quality', description: 'Vigila el rendimiento constante.', howToGet: 'Mantener SLOs de performance' },
  { id: 'code-coverage-king', name: 'Code Coverage King', emoji: '📊', tier: 'silver', category: 'quality', description: 'Cobertura de tests impecable.', howToGet: 'Mantener 90%+ coverage' },
  { id: 'load-tester', name: 'Load Tester', emoji: '🏋️', tier: 'silver', category: 'quality', description: 'Tests de carga profesionales.', howToGet: 'Implementar load testing completo' },
  { id: 'e2e-expert', name: 'E2E Expert', emoji: '🔄', tier: 'silver', category: 'quality', description: 'Tests end-to-end robustos.', howToGet: 'Suite de E2E tests completa' },
  { id: 'security-scanner', name: 'Security Scanner', emoji: '🔒', tier: 'silver', category: 'quality', description: 'Escaneo de vulnerabilidades.', howToGet: 'Implementar security scanning' },
  { id: 'tech-debt-fighter', name: 'Tech Debt Fighter', emoji: '⚔️', tier: 'silver', category: 'quality', description: 'Reduce deuda técnica activamente.', howToGet: 'Eliminar tech debt significativo' },
  { id: 'standards-setter', name: 'Standards Setter', emoji: '📏', tier: 'silver', category: 'quality', description: 'Define estándares del equipo.', howToGet: 'Crear coding standards adoptados' },
  
  // INNOVATION (10)
  { id: 'hackathon-winner', name: 'Hackathon Winner', emoji: '🏆', tier: 'gold', category: 'innovation', description: 'Ganador de hackathon interno.', howToGet: 'Ganar hackathon de la empresa' },
  { id: 'poc-pioneer', name: 'PoC Pioneer', emoji: '🧪', tier: 'silver', category: 'innovation', description: 'Proof of Concepts que convencen.', howToGet: 'Crear PoC que se implemente' },
  { id: 'tech-explorer', name: 'Tech Explorer', emoji: '🔭', tier: 'bronze', category: 'innovation', description: 'Explora nuevas tecnologías.', howToGet: 'Evaluar 5+ tecnologías nuevas' },
  { id: 'automation-ace', name: 'Automation Ace', emoji: '🤖', tier: 'silver', category: 'innovation', description: 'Automatiza todo lo repetitivo.', howToGet: 'Automatizar procesos manuales' },
  { id: 'tool-builder', name: 'Tool Builder', emoji: '🔧', tier: 'silver', category: 'innovation', description: 'Crea herramientas para el equipo.', howToGet: 'Desarrollar herramientas internas' },
  { id: 'ai-integrator', name: 'AI Integrator', emoji: '🧠', tier: 'gold', category: 'innovation', description: 'Integra IA de forma práctica.', howToGet: 'Implementar soluciones con IA' },
  { id: 'patent-holder', name: 'Patent Holder', emoji: '📜', tier: 'gold', category: 'innovation', description: 'Inventor con patente registrada.', howToGet: 'Obtener patente de invención' },
  { id: 'research-lead', name: 'Research Lead', emoji: '🔬', tier: 'silver', category: 'innovation', description: 'Lidera investigación técnica.', howToGet: 'Liderar proyecto de investigación' },
  { id: 'early-adopter', name: 'Early Adopter', emoji: '🚀', tier: 'bronze', category: 'innovation', description: 'Primero en adoptar lo nuevo.', howToGet: 'Implementar tecnología nueva primero' },
  { id: 'disruptor', name: 'Disruptor', emoji: '💥', tier: 'gold', category: 'innovation', description: 'Ideas que cambian el juego.', howToGet: 'Proponer cambio transformador' },
  
  // SPECIAL (8)
  { id: 'ursol-founder', name: 'Ursol Founder', emoji: '⭐', tier: 'gold', category: 'special', description: 'Fundador de Sistemas Ursol.', howToGet: 'Ser fundador de la organización' },
  { id: 'anniversary-1', name: '1 Year', emoji: '🎂', tier: 'bronze', category: 'special', description: '1 año en Sistemas Ursol.', howToGet: 'Cumplir 1 año en la org' },
  { id: 'anniversary-3', name: '3 Years', emoji: '🎉', tier: 'silver', category: 'special', description: '3 años en Sistemas Ursol.', howToGet: 'Cumplir 3 años en la org' },
  { id: 'anniversary-5', name: '5 Years', emoji: '🏅', tier: 'gold', category: 'special', description: '5 años en Sistemas Ursol.', howToGet: 'Cumplir 5 años en la org' },
  { id: 'boomflow-creator', name: 'BOOMFLOW Creator', emoji: '🚀', tier: 'gold', category: 'special', description: 'Creador del sistema BOOMFLOW.', howToGet: 'Crear BOOMFLOW' },
  { id: 'first-100', name: 'First 100', emoji: '💯', tier: 'silver', category: 'special', description: 'Entre los primeros 100 usuarios.', howToGet: 'Unirse entre los primeros 100' },
  { id: 'mvp', name: 'MVP', emoji: '🌟', tier: 'gold', category: 'special', description: 'Most Valuable Player del trimestre.', howToGet: 'Ser elegido MVP del trimestre' },
  { id: 'legend', name: 'Legend', emoji: '🏛️', tier: 'gold', category: 'special', description: 'Contribución legendaria al equipo.', howToGet: 'Reconocimiento unánime del equipo' },
];

// ============================================
// CATEGORIES
// ============================================

export const CATEGORIES = [
  { id: 'onboarding', name: 'Onboarding', emoji: '🟢', color: 'emerald' },
  { id: 'coding', name: 'Coding', emoji: '🔵', color: 'blue' },
  { id: 'devops', name: 'DevOps', emoji: '🟣', color: 'purple' },
  { id: 'collaboration', name: 'Colaboración', emoji: '🟡', color: 'yellow' },
  { id: 'leadership', name: 'Liderazgo', emoji: '🔴', color: 'red' },
  { id: 'documentation', name: 'Documentación', emoji: '⚪', color: 'zinc' },
  { id: 'quality', name: 'Calidad', emoji: '🟤', color: 'amber' },
  { id: 'innovation', name: 'Innovación', emoji: '🟠', color: 'orange' },
  { id: 'special', name: 'Especiales', emoji: '⭐', color: 'pink' },
];

export const TIERS = [
  { id: 'gold', name: 'Oro', emoji: '🥇', color: 'from-yellow-400 to-amber-600' },
  { id: 'silver', name: 'Plata', emoji: '🥈', color: 'from-zinc-300 to-zinc-500' },
  { id: 'bronze', name: 'Bronce', emoji: '🥉', color: 'from-orange-400 to-orange-700' },
];

// ============================================
// MOCK USERS
// ============================================

export const USERS: User[] = [
  {
    id: '1',
    username: 'ursolcr',
    displayName: 'ursolcr',
    badges: [
      'ursol-founder', 'boomflow-creator', 'hello-world', 'first-commit', 
      'first-pr', 'first-review', 'code-ninja', 'mentor-master', 
      'team-spirit', 'architect'
    ],
    kudosReceived: 156,
    kudosGiven: 89,
    streak: 45,
    joinedAt: '2020-01-15',
  },
  {
    id: '2',
    username: 'jeremy-sud',
    displayName: 'Jeremy Sud',
    badges: [
      'hello-world', 'first-commit', 'first-pr', 'first-review', 
      'code-ninja', 'team-spirit'
    ],
    kudosReceived: 45,
    kudosGiven: 32,
    streak: 12,
    joinedAt: '2024-06-01',
  },
];

// ============================================
// MOCK ACTIVITY FEED
// ============================================

export const ACTIVITY_FEED: Activity[] = [
  {
    id: '1',
    type: 'badge_earned',
    userId: '2',
    badgeId: 'team-spirit',
    timestamp: '2026-02-15T10:30:00Z',
  },
  {
    id: '2',
    type: 'kudo_sent',
    userId: '1',
    targetUserId: '2',
    message: '¡Excelente trabajo en el dashboard de BOOMFLOW!',
    timestamp: '2026-02-15T09:15:00Z',
  },
  {
    id: '3',
    type: 'badge_earned',
    userId: '2',
    badgeId: 'code-ninja',
    timestamp: '2026-02-14T16:45:00Z',
  },
  {
    id: '4',
    type: 'kudo_sent',
    userId: '2',
    targetUserId: '1',
    message: 'Gracias por la mentoría en arquitectura de sistemas',
    timestamp: '2026-02-14T14:20:00Z',
  },
  {
    id: '5',
    type: 'milestone',
    userId: '1',
    message: '¡ursolcr alcanzó 150 kudos recibidos!',
    timestamp: '2026-02-13T11:00:00Z',
  },
  {
    id: '6',
    type: 'badge_earned',
    userId: '1',
    badgeId: 'mentor-master',
    timestamp: '2026-02-12T15:30:00Z',
  },
  {
    id: '7',
    type: 'kudo_sent',
    userId: '1',
    targetUserId: '2',
    message: 'Gran refactor del módulo de autenticación',
    timestamp: '2026-02-11T10:00:00Z',
  },
  {
    id: '8',
    type: 'badge_earned',
    userId: '2',
    badgeId: 'first-review',
    timestamp: '2026-02-10T09:00:00Z',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getBadgeById(id: string): Badge | undefined {
  return BADGE_CATALOG.find(b => b.id === id);
}

export function getUserById(id: string): User | undefined {
  return USERS.find(u => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return USERS.find(u => u.username === username);
}

export function getUserBadges(user: User): Badge[] {
  return user.badges.map(id => getBadgeById(id)).filter((b): b is Badge => b !== undefined);
}

export function getBadgesByCategory(category: string): Badge[] {
  return BADGE_CATALOG.filter(b => b.category === category);
}

export function getBadgesByTier(tier: 'bronze' | 'silver' | 'gold'): Badge[] {
  return BADGE_CATALOG.filter(b => b.tier === tier);
}

export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins}m`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// Stats para el leaderboard
export function getLeaderboard(): User[] {
  return [...USERS].sort((a, b) => b.kudosReceived - a.kudosReceived);
}

export function getBadgeStats() {
  const total = BADGE_CATALOG.length;
  const byCategory = CATEGORIES.map(cat => ({
    ...cat,
    count: getBadgesByCategory(cat.id).length,
  }));
  const byTier = {
    gold: getBadgesByTier('gold').length,
    silver: getBadgesByTier('silver').length,
    bronze: getBadgesByTier('bronze').length,
  };
  return { total, byCategory, byTier };
}
