# 💎 BOOMFLOW — Economía de Reconocimiento

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Uso_Exclusivo-Sistemas_Ursol-8B5CF6.svg" alt="Exclusivo"/>
  <img src="https://img.shields.io/badge/Versión-1.0-gold.svg" alt="Versión"/>
</p>

> **"En Ursol, el valor no solo se genera con commits, se genera con conexiones y apoyo mutuo. Estas medallas representan la inversión en nuestra comunidad."**

---

## 📖 Índice

1. [Filosofía del Sistema](#filosofía-del-sistema)
2. [Medallas de Vínculo (Peer-to-Peer)](#-medallas-de-vínculo-peer-to-peer)
3. [Medallas de Inversión (Premium/Patron)](#-medallas-de-inversión-premiumpatron)
4. [Beneficios por Categoría](#beneficios-por-categoría)
5. [Protección contra "Pay-to-Win"](#-protección-contra-pay-to-win)
6. [Implementación Técnica](#implementación-técnica)

---

## Filosofía del Sistema

BOOMFLOW reconoce que el talento va más allá del código. Un equipo excepcional se construye sobre **tres pilares**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DIMENSIONES DEL VALOR                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ⚙️ TÉCNICO           ❤️ SOCIAL            💎 COMPROMISO       │
│   ──────────          ────────             ───────────          │
│   • Código            • Vínculos           • Inversión          │
│   • DevOps            • Mentoría           • Patrocinio         │
│   • Arquitectura      • Cultura            • Sostenibilidad     │
│                                                                 │
│   Medallas de         Medallas de          Medallas de          │
│   mérito técnico      conexión humana      apoyo comunitario    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❤️ Medallas de Vínculo (Peer-to-Peer)

### El Concepto: "Resonancia"

En entornos corporativos, preferimos llamarlas medallas de **Resonancia** o **Vínculo**. No son medallas que "ganas" por métricas — son medallas que **transfieres** a un compañero.

### Mecánica

```yaml
# Reglas del Sistema de Resonancia
allocation:
  badges_per_user_per_year: 2
  type: "compañerismo"
  transferable: true
  
restrictions:
  - no_self_award: true
  - no_reciprocal_immediate: true  # No puedes dar a quien te dio en 30 días
  - requires_message: true          # Debe incluir razón
```

### ¿Por qué funciona?

| Aspecto | Medalla Automática | Medalla de Vínculo |
|---------|-------------------|-------------------|
| Origen | Algoritmo | Colega |
| Valor | Objetivo | Emocional |
| Mensaje | "Cumpliste X commits" | "Gracias por aguantarme en el despliegue del viernes" |
| Impacto | Reconocimiento | Conexión humana |

### Medallas Disponibles

| Medalla | Descripción | Trigger |
|---------|-------------|---------|
| 🤝 **Resonancia** | Un colega te reconoce por tu apoyo | `MANUAL_PEER_AWARD` |
| 💫 **Vínculo Fuerte** | Recibiste 3+ medallas de Resonancia | Automático |
| 🌟 **Alma del Equipo** | Recibiste 10+ medallas de Resonancia | Automático |

---

## 💎 Medallas de Inversión (Premium/Patron)

### El Concepto: Compromiso Tangible

Cuando un miembro invierte (aunque sea simbólicamente) en el ecosistema BOOMFLOW, está haciendo un **compromiso público** con la comunidad de Ursol.

### Beneficios Sensibles

```yaml
# Tier de Beneficios por Inversión
patron_tiers:
  - tier: "seed"        # $1-5
    benefits:
      - badge: "patron-seed"
      - recognition_wall: true
      
  - tier: "growth"      # $10-20
    benefits:
      - badge: "patron-growth" 
      - time_off: "1 tarde libre al mes"
      - course_access: "1 curso Udemy/Coursera"
      
  - tier: "bloom"       # $50+
    benefits:
      - badge: "patron-bloom"
      - project_choice: "Prioridad en elección de stack"
      - impact_certificate: "Donación a causa social"
```

### Impacto Social (Opcional)

El dinero recaudado puede destinarse a:

| Destino | Descripción |
|---------|-------------|
| 🌳 **Reforestación** | Plantar árboles con el fondo |
| 💻 **Educación** | Becar a estudiantes de programación |
| 🏠 **Comunidad** | Apoyar proyectos open source |

La medalla se convierte en un **recibo** de que "Ursol y yo ayudamos".

### Medallas Disponibles

| Medalla | Inversión | Beneficio Principal |
|---------|-----------|---------------------|
| 🌱 **Patron Seed** | $1-5 | Reconocimiento público |
| 🌿 **Patron Growth** | $10-20 | Tiempo de desconexión |
| 🌸 **Patron Bloom** | $50+ | Elección de proyecto |
| 🌳 **Eco Champion** | Donación social | Certificado de impacto |

---

## Beneficios por Categoría

### Matriz de Beneficios

| Categoría | Tipo de Medalla | Beneficio Tangible |
|-----------|-----------------|-------------------|
| 🔵 Coding | Mérito técnico | Reconocimiento profesional |
| 🟣 DevOps | Mérito técnico | Reconocimiento profesional |
| ❤️ Community | Vínculo social | Conexión humana |
| 💎 Premium | Inversión | Beneficios reales |

### Tiempo de Desconexión

```
┌─────────────────────────────────────────────────────────────────┐
│                  🎫 PASE DE DESCONEXIÓN                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Este pase otorga 1 tarde libre (4 horas) al mes              │
│                                                                 │
│   Válido para: Patrons Growth y Bloom                          │
│   Uso: Cualquier viernes del mes                               │
│   Requisito: Aviso 48h antes                                   │
│                                                                 │
│   "El descanso es parte de la productividad."                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Protección contra "Pay-to-Win"

### El Riesgo

El principal peligro de monetizar medallas es que las de **mérito técnico** se perciban como menos valiosas que las "compradas".

### Solución: Separación Visual y Semántica

```yaml
badge_visual_distinction:
  merit_badges:         # Coding, DevOps, Leadership
    border: "standard"
    category_label: "MÉRITO"
    
  community_badges:     # Vínculo, Resonancia
    border: "heart_shape"
    category_label: "SOCIAL"
    
  patron_badges:        # Inversión
    border: "diamond_sparkle"
    category_label: "PATRON"
    color_scheme: "purple_gradient"
```

### Principios de Diseño

1. **Estética Diferenciada**: Las medallas de inversión tienen un marco especial (borde brillante tipo diamante)
2. **Categoría Visible**: Siempre se muestra "PATRON" o "SOCIAL" para distinguirlas del mérito técnico
3. **No Compiten**: Las medallas de inversión **nunca** aparecen en el leaderboard de habilidades técnicas
4. **Transparencia Total**: El perfil muestra claramente el origen de cada medalla

### Lo que NO se puede comprar

| ❌ Nunca comprables | ✅ Obtenibles por inversión |
|--------------------|----------------------------|
| Code Ninja | Patron Seed |
| Bug Slayer | Patron Growth |
| Algorithm Ace | Patron Bloom |
| Tech Lead | Eco Champion |
| Cualquier medalla de mérito | Medallas de categoría Premium |

---

## Implementación Técnica

### Nuevas Categorías en el Schema

```prisma
enum BadgeCategory {
  // ... categorías existentes
  COMMUNITY    // ❤️ Medallas sociales/vínculo
  PREMIUM      // 💎 Medallas de inversión/patron
}
```

### Nuevos Triggers

```prisma
enum TriggerType {
  // ... triggers existentes
  MANUAL_PEER_AWARD    // Otorgado por un compañero (Resonancia)
  INVESTMENT           // Otorgado por inversión/donación
}
```

### API Endpoints

```http
# Dar medalla de Resonancia a un compañero
POST /api/badges/peer-award
{
  "toUserId": "user123",
  "message": "Gracias por tu apoyo en el sprint"
}

# Procesar inversión y otorgar medalla Patron
POST /api/badges/patron
{
  "tier": "growth",
  "paymentId": "stripe_123",
  "impactChoice": "reforestation"  // opcional
}
```

### Validaciones

```typescript
// peer-award: máximo 2 por año por usuario
const peerAwardsThisYear = await getPeerAwardsCount(fromUserId, currentYear)
if (peerAwardsThisYear >= 2) {
  throw new Error('Has agotado tus medallas de Resonancia este año')
}

// No auto-otorgamiento
if (fromUserId === toUserId) {
  throw new Error('No puedes darte una medalla a ti mismo')
}
```

---

## 📊 Resumen de Categorías

| Categoría | Emoji | Tipo | Origen |
|-----------|-------|------|--------|
| 🟢 Onboarding | 🟢 | Mérito | Automático |
| 🔵 Coding | 🔵 | Mérito | Automático/Manual |
| 🟣 DevOps | 🟣 | Mérito | Automático/Manual |
| 🩷 Collaboration | 🩷 | Mérito | Manual |
| 🟡 Leadership | 🟡 | Mérito | Manual |
| 📚 Documentation | 📚 | Mérito | Manual |
| 🌱 Growth | 🌱 | Mérito | Manual |
| ❤️ Milestones | ❤️ | Acumulativo | Automático |
| ⭐ Special | ⭐ | Especial | Automático |
| ❤️ **Community** | ❤️ | **Social** | **Peer-to-Peer** |
| 💎 **Premium** | 💎 | **Inversión** | **Donación** |

---

<p align="center">
  <strong>🌸 BOOMFLOW Economy — Valor Multidimensional</strong><br/>
  <sub>El mérito técnico es solo una dimensión del talento — Sistemas Ursol</sub>
</p>
