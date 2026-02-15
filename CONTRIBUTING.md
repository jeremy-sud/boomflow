# Contributing to BOOMFLOW

Thank you for your interest in contributing to BOOMFLOW! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

- **Report bugs** — Found a bug? Open an issue!
- **Suggest features** — Have an idea? We'd love to hear it!
- **Fix bugs** — Check out our open issues
- **Add badges** — Help expand our badge collection
- **Improve docs** — Documentation can always be better
- **Write tests** — Help improve code coverage

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/boomflow.git
cd boomflow
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 4. Make Your Changes

Follow our coding guidelines below.

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing new feature"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no feature/fix |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### 6. Push and Open a PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

## 📝 Code Guidelines

### JavaScript/TypeScript

- Use **ES6+** features
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names
- Add JSDoc comments for functions

```javascript
/**
 * Build badge section for a user
 * @param {object} userData - User data object
 * @param {object} catalogIndex - Badge catalog indexed by ID
 * @returns {string} HTML badge section
 */
function buildUserBadgeSection(userData, catalogIndex) {
  // ...
}
```

### SVG Badges

When creating new badges:

1. Use 128x128 canvas
2. Follow the tier color scheme
3. Use vector icons (no emojis)
4. Include gradient backgrounds
5. Add the shine effect
6. Test rendering on GitHub

### React Components

- Use functional components with hooks
- Follow the existing component structure
- Use TypeScript for type safety
- Keep components small and focused
- **Mark props interfaces as `readonly`** for immutability
- **Use `useMemo` for context values** to prevent unnecessary re-renders
- **Use semantic HTML elements** (`<button>` instead of clickable `<div>`)
- **Associate labels with form controls** using `htmlFor` and `id` attributes

```tsx
// ✅ Good - Props marked as readonly
interface BadgeCardProps {
  readonly badge: Badge;
  readonly onClick?: () => void;
}

// ✅ Good - Using useMemo for context
const contextValue = useMemo(() => ({ 
  toasts, addToast, removeToast 
}), [toasts, addToast, removeToast])

// ✅ Good - Semantic button with keyboard support
<button
  type="button"
  onClick={handleClick}
  aria-pressed={isSelected}
>
  Filter
</button>

// ✅ Good - Label associated with input
<label htmlFor="kudo-message">Message</label>
<input id="kudo-message" type="text" />
```

### Avoid Nested Ternaries

Replace nested ternary operators with helper functions or lookup objects:

```typescript
// ❌ Bad - Nested ternary
const emoji = tier === 'GOLD' ? '🥇' : tier === 'SILVER' ? '🥈' : '🥉'

// ✅ Good - Lookup object
const TIER_EMOJI: Record<string, string> = {
  GOLD: '🥇',
  SILVER: '🥈', 
  BRONZE: '🥉'
}
const emoji = TIER_EMOJI[tier] ?? '🥉'
```

### Use Modern Node.js Imports

Prefer `node:` prefix for Node.js built-in modules:

```javascript
// ✅ Good
import * as fs from 'node:fs'
import * as path from 'node:path'

// ❌ Bad
import * as fs from 'fs'
import * as path from 'path'
```

## 🎨 Adding New Badges

### 1. Create the SVG

Create `assets/badge-{id}.svg` following the specification in DOCS.md.

### 2. Add to Catalog

Update `api-mock.json`:

```json
{
  "id": "new-badge",
  "emoji": "🎉",
  "label": "New Badge",
  "category": "coding",
  "tier": "silver",
  "meta": "Nivel 2",
  "description": "Description of what this badge represents.",
  "svg": "badge-new-badge.svg"
}
```

### 3. Update Documentation

Add the badge to:
- README.md badge gallery
- DOCS.md badge reference table

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test the GitHub Action Locally

```bash
cd github-action
node index.js
```

### Verify SVG Rendering

1. Push your SVG to a branch
2. Check the raw GitHub URL renders correctly
3. Test in a README preview

## 📋 Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows our style guidelines
- [ ] New features are documented
- [ ] Tests pass locally
- [ ] SVGs render correctly (if applicable)
- [ ] Commit messages follow conventional commits
- [ ] PR description explains the changes

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description** — Clear description of the bug
2. **Steps to reproduce** — How can we reproduce it?
3. **Expected behavior** — What should happen?
4. **Actual behavior** — What actually happens?
5. **Environment** — OS, Node version, browser
6. **Screenshots** — If applicable

## 💡 Feature Requests

When suggesting features, please include:

1. **Problem** — What problem does this solve?
2. **Solution** — How should it work?
3. **Alternatives** — Other approaches considered
4. **Priority** — How important is this to you?

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Give and accept constructive feedback
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Other unprofessional conduct

## 📞 Questions?

- Open an issue for general questions
- Email: dev@ursol.com
- Join our community discussions

---

Thank you for contributing to BOOMFLOW! 🌸
