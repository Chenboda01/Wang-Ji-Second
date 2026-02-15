# AGENTS.md

Agent playbook for this repository.

## Scope

- Repository root: `/home/bodachen/Wang-Ji-Second/Wang-Ji-Second`
- Project intent (from README): browser typing game built with HTML, CSS, and JavaScript.
- Current snapshot: repository is minimal and does not yet include app source files.

## Current Reality (Important)

At the time of writing, this repo contains:

- `README.md`
- Git metadata (`.git/`)

It does **not** currently include:

- `package.json`
- Build tooling config (`vite`, `webpack`, `parcel`, etc.)
- Lint/format config (`eslint`, `prettier`)
- Test framework config (`jest`, `vitest`, `playwright`)
- CI workflows (`.github/workflows/*`)
- Cursor rules (`.cursor/rules/*`, `.cursorrules`)
- Copilot instructions (`.github/copilot-instructions.md`)

If any of the above are later added, update this file to match the new source of truth.

## Commands

Because there is no package manager setup yet, there are no canonical build/lint/test commands.

### Build

- Current: `N/A` (no build pipeline configured)

### Lint

- Current: `N/A` (no linter configured)

### Test

- Current: `N/A` (no test framework configured)

### Run a Single Test

- Current: `N/A` (cannot run a single test because test tooling is not configured)

## Coding Standards (Baseline)

These are default standards for this repo until code-specific conventions exist.

### JavaScript

- Use `const` by default; use `let` only for reassignment.
- Prefer descriptive camelCase identifiers for variables/functions.
- Use PascalCase for constructor/class names.
- Keep functions small and focused.
- Use strict equality (`===` / `!==`).
- Avoid hidden coercion.
- Keep DOM references scoped and explicit.

### Imports and Modules

- If using plain browser JS, prefer one clear entry file (`main.js` or `app.js`).
- If using modules, use ESM (`import` / `export`) consistently.
- Do not mix CommonJS and ESM in the same project.
- Group imports in a stable order and keep it consistent.

### Formatting

- Use consistent indentation (2 spaces is preferred for web files).
- Use a consistent quote style across JS (`'` or `"`, pick one and enforce).
- Use semicolons consistently (preferred: always use semicolons).
- Keep line length readable.

### HTML

- Use semantic tags where appropriate (`main`, `section`, `button`, etc.).
- Prefer data attributes for JS hooks over styling class names.
- Ensure interactive elements are keyboard accessible.

### CSS

- Use class-based styling; avoid overusing IDs for style hooks.
- Keep selectors simple; avoid deep selector chains.
- Prefer CSS variables for repeated tokens (colors, spacing, timing).
- Avoid `!important` unless absolutely necessary.

### Naming

- Files: use kebab-case for web assets (`game-timer.js`, `round-panel.css`).
- CSS classes: pick one convention and stay consistent (kebab-case recommended).

### Error Handling

- Do not swallow errors silently.
- For unrecoverable errors, fail loudly and log context.
- Validate user input before applying game state updates.

### State and Game Logic

- Separate render/update logic from state transition logic.
- Use deterministic functions for scoring/time penalties.
- Keep DOM updates predictable and centralized where possible.

## Testing Guidance (When Added)

When a test framework is introduced, enforce these minimums:

- Unit-test pure game logic (timers, scoring, round difficulty).
- Add at least one integration/e2e path for a full round flow.
- Keep flaky timing tests out of CI unless stabilized.
- Name tests by behavior, not implementation details.

Single-test command guidance (after setup):

- Jest example: `npm test -- path/to/file.test.js`
- Vitest example: `npm run test:single -- path/to/file.test.js`
- Playwright example: `npx playwright test tests/game.spec.ts -g "round advances"`

## Agent Workflow Expectations

- Read this file before making edits.
- Verify whether tooling exists before running commands.
- If command assumptions fail, report actual repo state and adapt.
- Do not invent scripts that are not present.
- If you introduce tooling, update this file in the same change.

## Rule Files Status

Checked locations for agent instructions:

- `.cursor/rules/` -> not present
- `.cursorrules` -> not present
- `.github/copilot-instructions.md` -> not present

If these files are added later, merge their requirements into this guide and keep precedence clear.

## Maintenance Checklist

Update `AGENTS.md` whenever any of the following changes:

- Build/lint/test command names
- Tooling stack
- Directory structure
- Style conventions
- CI behavior and required checks
- Cursor/Copilot rule files

This file is intentionally explicit so future coding agents can execute reliably.
