# 🎨 BOOMFLOW Badge Skins

Visual customization system for BOOMFLOW badges. Each skin offers a unique style to represent your achievements.

## 📦 Available Skin Packs

### 1. **DEFAULT** - Original Design
The classic BOOMFLOW style with vibrant colors and modern gradients.
- **File:** Individual badges in `/assets/badges/`
- **Style:** Colorful, modern, professional
- **Access:** Free for all

### 2. **CRYSTAL** 💎 - Faceted Gem
Design inspired by precious stones with crystal effects and reflections.
- **File:** `assets/skins/skin-crystal-template.svg`
- **Colors:** Cyan blue tones with sparkles
- **Shape:** Hexagonal with facets
- **Access:** Free for all

### 3. **ACADEMIC** 🎓 - Scholarly/Formal
Classic academic style with shield, laurels, and gold medallion.
- **File:** `assets/skins/skin-academic-template.svg`
- **Colors:** Parchment, gold, laurel green
- **Shape:** Heraldic shield with ribbon
- **Access:** Free for all

### 4. **MINIMALIST** ◻️ - Clean and Simple
Ultra-minimalist design with clean lines and neutral colors.
- **File:** `assets/skins/skin-minimalist-template.svg`
- **Colors:** White, gray, slate
- **Shape:** Simple circle
- **Access:** Free for all

### 5. **VINTAGE** 🏛️ - Retro/Classic
Antique style with ornaments, aged textures, and sepia tones.
- **File:** `assets/skins/skin-vintage-template.svg`
- **Colors:** Brown, sepia, antique gold
- **Shape:** Ornate oval
- **Access:** Free for all

### 6. **NEON** ⚡ - Modern/Cyberpunk
Futuristic design with neon glow effects on a dark background.
- **File:** `assets/skins/skin-neon-template.svg`
- **Colors:** Neon pink, cyan, black background
- **Shape:** Octagon with glow
- **Access:** Available to all (reserved for future premium tier)

---

## 🔄 How to Change Skins

### Option 1: From the Web App
```
1. Go to your Profile → Badges
2. Click on any badge
3. Select "Change Skin"
4. Choose from the available packs
5. Save changes
```

### Option 2: Via API
```bash
# Get available skins
GET /api/badges/skins

# Change the skin of a specific badge
PATCH /api/badges/user/:badgeId
{
  "skinId": "crystal-v1"
}
```

### Option 3: JSON Configuration (advanced users)
Edit your file in `users/{username}.json`:
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

## 🛠️ Create Your Own Custom Skin

### Requirements
- Node.js 18+ installed
- SVG editor (Figma, Inkscape, Adobe Illustrator, or VS Code)

### Step 1: Use the Skin Generator

Run the interactive script:
```bash
node scripts/generate-custom-skin.js
```

This script will guide you through creating a custom SVG with:
- Base shape selection (circle, hexagon, shield, oval)
- Customizable color scheme
- Optional effects (glow, shadow, gradient)
- Custom text

### Step 2: SVG Structure

Your skin must follow this basic structure:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140">
  <defs>
    <!-- Gradients and filters go here -->
  </defs>
  
  <!-- Base shape (background) -->
  <!-- id: bg-shape -->
  
  <!-- Decorations/borders -->
  <!-- id: decorations -->
  
  <!-- Central area for badge icon -->
  <!-- id: icon-area - centered at (60, 65) -->
  
  <!-- Text area -->
  <!-- id: text-area - centered at (60, 120-130) -->
</svg>
```

### Step 3: Important Dimensions

| Element | Position | Size |
|---------|----------|------|
| ViewBox | - | 120 × 140 |
| Icon center | (60, 65) | 40-60px |
| Text area | (60, 105-130) | font-size 7-10 |
| Outer margin | 10-15px | - |

### Step 4: Register the Skin

Once your SVG is created, add it to the system:

```bash
# Copy to the skins directory
cp my-custom-skin.svg assets/skins/

# Register in the database (requires admin permissions)
node scripts/badge-admin.js register-skin \
  --name "My Custom Skin" \
  --slug "my-custom-skin" \
  --file "assets/skins/my-custom-skin.svg" \
  --style "CUSTOM"
```

---

## 🎨 Recommended Color Palettes

### For Light Backgrounds
```css
--primary: #3b82f6;    /* Blue */
--secondary: #f8fafc;  /* Light gray */
--accent: #fbbf24;     /* Gold */
--text: #1e293b;       /* Dark slate */
```

### For Dark Backgrounds
```css
--primary: #22d3ee;    /* Cyan */
--secondary: #0f172a;  /* Very dark blue */
--accent: #f472b6;     /* Pink */
--text: #e2e8f0;       /* Light gray */
```

### For Corporate Style
```css
--primary: #2563eb;    /* Corporate blue */
--secondary: #ffffff;  /* White */
--accent: #16a34a;     /* Success green */
--text: #374151;       /* Gray */
```

---

## 📋 Quick Style Reference

### `SkinStyle` Enum (Prisma Schema)
```typescript
enum SkinStyle {
  DEFAULT      // Original design
  CRYSTAL      // Faceted gem
  ACADEMIC     // Scholarly formal
  MINIMALIST   // Clean simple
  VINTAGE      // Retro classic
  NEON         // Bright cyberpunk
}
```

### Database Model
```typescript
model BadgeSkin {
  id          String    @id
  name        String    // Display name
  slug        String    @unique
  description String?
  svgIcon     String    // SVG content
  style       SkinStyle @default(DEFAULT)
  isDefault   Boolean   @default(false)
  isPremium   Boolean   @default(false)
}
```

---

## ❓ FAQ

### Can I use any skin for any badge?
Yes, all skins are compatible with all badges. The central icon adapts automatically.

### What if I don't like any of the available skins?
Create your own! Use the `generate-custom-skin.js` script or manually design an SVG following the specifications.

### Do premium skins cost money?
Not currently. All skins are available to all users. The `isPremium` flag in the database exists for potential future use, but is not enforced. The NEON skin was originally designed as exclusive, but all skins are currently accessible to everyone.

### Can I share my custom skins?
Absolutely! You can contribute your skins to the repository via a Pull Request. See [CONTRIBUTING.md](CONTRIBUTING.md).

### How do I display skins in my GitHub README profile?
Skins are automatically applied when you use badges in your README:
```markdown
![Badge](https://boomflow.sistemasursol.com/api/badge/your-username/first-commit?skin=crystal)
```

---

## 🤝 Contributing Skins

Designed an awesome skin? Share it!

1. Fork the repository
2. Add your SVG in `assets/skins/skin-{name}-template.svg`
3. Update this document with the description
4. Create a Pull Request

**Contribution requirements:**
- Valid SVG with viewBox `0 0 120 140`
- Include descriptive comments
- Follow the existing file structure
- Test that it works with at least 3 different badges

---

## 📁 File Structure

```
assets/
├── badges/              # Individual badges (DEFAULT style)
│   ├── badge-first-commit.svg
│   └── ...
└── skins/               # Skin templates
    ├── skin-academic-template.svg
    ├── skin-crystal-template.svg
    ├── skin-minimalist-template.svg
    ├── skin-neon-template.svg
    └── skin-vintage-template.svg

scripts/
├── generate-custom-skin.js    # Interactive skin generator
└── update-svg-gems.py         # Update icons to gem style
```

---

*BOOMFLOW Skins Documentation v1.0 - Sistemas Ursol*
