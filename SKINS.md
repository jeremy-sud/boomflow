# 🎨 BOOMFLOW Badge Skins

Sistema de personalización visual para medallas BOOMFLOW. Cada skin ofrece un estilo único para representar tus logros.

## 📦 Paquetes de Skins Disponibles

### 1. **DEFAULT** - Diseño Original
El estilo clásico de BOOMFLOW con colores vibrantes y gradientes modernos.
- **Archivo:** Badges individuales en `/assets/badges/`
- **Estilo:** Colorido, moderno, profesional
- **Acceso:** Gratis para todos

### 2. **CRYSTAL** 💎 - Gema Facetada
Diseño inspirado en piedras preciosas con efectos de cristal y reflejos.
- **Archivo:** `assets/skins/skin-crystal-template.svg`
- **Colores:** Tonos azules cian con destellos
- **Forma:** Hexagonal con facetas
- **Acceso:** Gratis para todos

### 3. **ACADEMIC** 🎓 - Escolar/Formal
Estilo clásico académico con escudo, laureles y medallón dorado.
- **Archivo:** `assets/skins/skin-academic-template.svg`
- **Colores:** Pergamino, dorado, verde laurel
- **Forma:** Escudo heráldico con listón
- **Acceso:** Gratis para todos

### 4. **MINIMALIST** ◻️ - Limpio y Simple
Diseño ultra-minimalista con líneas limpias y colores neutros.
- **Archivo:** `assets/skins/skin-minimalist-template.svg`
- **Colores:** Blanco, gris, slate
- **Forma:** Círculo simple
- **Acceso:** Gratis para todos

### 5. **VINTAGE** 🏛️ - Retro/Clásico
Estilo antiguo con ornamentos, texturas envejecidas y tonos sepia.
- **Archivo:** `assets/skins/skin-vintage-template.svg`
- **Colores:** Marrón, sepia, dorado antiguo
- **Forma:** Óvalo ornamentado
- **Acceso:** Gratis para todos

### 6. **NEON** ⚡ - Moderno/Cyberpunk
Diseño futurista con efectos de brillo neón sobre fondo oscuro.
- **Archivo:** `assets/skins/skin-neon-template.svg`
- **Colores:** Rosa neón, cian, fondo negro
- **Forma:** Octágono con resplandor
- **Acceso:** **Premium** (requiere badge de patrón)

---

## 🔄 Cómo Cambiar de Skin

### Opción 1: Desde la Web App
```
1. Ve a tu Perfil → Medallas
2. Click en cualquier medalla
3. Selecciona "Cambiar Skin"
4. Elige de los paquetes disponibles
5. Guarda cambios
```

### Opción 2: Via API
```bash
# Obtener skins disponibles
GET /api/badges/skins

# Cambiar skin de una medalla específica
PATCH /api/badges/user/:badgeId
{
  "skinId": "crystal-v1"
}
```

### Opción 3: Configuración en JSON (usuarios avanzados)
Edita tu archivo en `users/{username}.json`:
```json
{
  "badges": [
    {
      "id": "first-commit",
      "awardedAt": "2024-01-22",
      "awardedBy": "system",
      "skinPreference": "crystal"
    }
  ],
  "defaultSkin": "minimalist"
}
```

---

## 🛠️ Crear tu Propia Skin Personalizada

### Requisitos
- Node.js 18+ instalado
- Editor de SVG (Figma, Inkscape, Adobe Illustrator, o VS Code)

### Paso 1: Usar el Generador de Skins

Ejecuta el script interactivo:
```bash
node scripts/generate-custom-skin.js
```

Este script te guiará para crear un SVG personalizado con:
- Selección de forma base (círculo, hexágono, escudo, óvalo)
- Esquema de colores personalizable
- Efectos opcionales (brillo, sombra, gradiente)
- Texto personalizado

### Paso 2: Estructura del SVG

Tu skin debe seguir esta estructura básica:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140">
  <defs>
    <!-- Gradientes y filtros aquí -->
  </defs>
  
  <!-- Forma base (background) -->
  <!-- id: bg-shape -->
  
  <!-- Decoraciones/bordes -->
  <!-- id: decorations -->
  
  <!-- Área central para ícono de badge -->
  <!-- id: icon-area - centrado en (60, 65) -->
  
  <!-- Área de texto -->
  <!-- id: text-area - centrado en (60, 120-130) -->
</svg>
```

### Paso 3: Dimensiones Importantes

| Elemento | Posición | Tamaño |
|----------|----------|--------|
| ViewBox | - | 120 × 140 |
| Centro del ícono | (60, 65) | 40-60px |
| Área de texto | (60, 105-130) | font-size 7-10 |
| Margen exterior | 10-15px | - |

### Paso 4: Registrar la Skin

Una vez creado tu SVG, agrégalo al sistema:

```bash
# Copiar al directorio de skins
cp mi-skin-custom.svg assets/skins/

# Registrar en la base de datos (requiere permisos de admin)
node scripts/badge-admin.js register-skin \
  --name "Mi Skin Custom" \
  --slug "mi-skin-custom" \
  --file "assets/skins/mi-skin-custom.svg" \
  --style "CUSTOM"
```

---

## 🎨 Paletas de Colores Recomendadas

### Para Fondos Claros
```css
--primary: #3b82f6;    /* Azul */
--secondary: #f8fafc;  /* Gris claro */
--accent: #fbbf24;     /* Dorado */
--text: #1e293b;       /* Slate oscuro */
```

### Para Fondos Oscuros
```css
--primary: #22d3ee;    /* Cian */
--secondary: #0f172a;  /* Azul muy oscuro */
--accent: #f472b6;     /* Rosa */
--text: #e2e8f0;       /* Gris claro */
```

### Para Estilo Corporativo
```css
--primary: #2563eb;    /* Azul corporativo */
--secondary: #ffffff;  /* Blanco */
--accent: #16a34a;     /* Verde éxito */
--text: #374151;       /* Gris */
```

---

## 📋 Referencia Rápida de Estilos

### Enum `SkinStyle` (Prisma Schema)
```typescript
enum SkinStyle {
  DEFAULT      // Diseño original
  CRYSTAL      // Gema facetada
  ACADEMIC     // Formal escolar
  MINIMALIST   // Limpio simple
  VINTAGE      // Retro clásico
  NEON         // Cyberpunk brillante
}
```

### Modelo de Base de Datos
```typescript
model BadgeSkin {
  id          String    @id
  name        String    // Nombre legible
  slug        String    @unique
  description String?
  svgIcon     String    // Contenido SVG
  style       SkinStyle @default(DEFAULT)
  isDefault   Boolean   @default(false)
  isPremium   Boolean   @default(false)
}
```

---

## ❓ Preguntas Frecuentes

### ¿Puedo usar cualquier skin para cualquier badge?
Sí, todas las skins son compatibles con todas las medallas. El ícono central se adapta automáticamente.

### ¿Qué pasa si no me gusta ninguna skin?
¡Crea la tuya! Usa el script `generate-custom-skin.js` o diseña manualmente un SVG siguiendo las especificaciones.

### ¿Las skins premium cuestan dinero?
No directamente. Las skins premium se desbloquean al obtener badges de tipo "PREMIUM" (patrón/inversor del proyecto).

### ¿Puedo compartir mis skins personalizadas?
¡Absolutamente! Puedes contribuir tus skins al repositorio mediante un Pull Request. Ver [CONTRIBUTING.md](CONTRIBUTING.md).

### ¿Cómo veo las skins en mi perfil de GitHub README?
Las skins se aplican automáticamente cuando usas los badges en tu README:
```markdown
![Badge](https://boomflow.sistemasursol.com/api/badge/tu-usuario/first-commit?skin=crystal)
```

---

## 🤝 Contribuir Skins

¿Diseñaste una skin increíble? ¡Compártela!

1. Fork el repositorio
2. Agrega tu SVG en `assets/skins/skin-{nombre}-template.svg`
3. Actualiza este documento con la descripción
4. Crea un Pull Request

**Requisitos para contribuir:**
- SVG válido con viewBox `0 0 120 140`
- Incluir comentarios descriptivos
- Seguir la estructura de archivos existentes
- Probar que funciona con al menos 3 badges diferentes

---

## 📁 Estructura de Archivos

```
assets/
├── badges/              # Badges individuales (estilo DEFAULT)
│   ├── badge-first-commit.svg
│   └── ...
└── skins/               # Plantillas de skin
    ├── skin-academic-template.svg
    ├── skin-crystal-template.svg
    ├── skin-minimalist-template.svg
    ├── skin-neon-template.svg
    └── skin-vintage-template.svg

scripts/
├── generate-custom-skin.js    # Generador interactivo de skins
└── update-svg-gems.py         # Actualizar íconos a estilo gema
```

---

*Documentación BOOMFLOW Skins v1.0 - Sistemas Ursol*
