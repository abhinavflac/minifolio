# Contributing to Portfolio

Thank you for your interest in contributing to this portfolio project! This document provides guidelines for contributing to the codebase.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   # Fill in your API keys in .env
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Code Standards

### TypeScript
- Use strict typing
- Avoid `any` types
- Use proper interfaces and types

### Svelte Components
- Use TypeScript for component props
- Follow Svelte best practices
- Use proper event handling

### Styling
- Use Tailwind CSS classes
- Follow mobile-first approach
- Maintain consistent spacing

## Commit Guidelines

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code refactoring
- `test:` for adding tests

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Run `npm run check` to ensure quality
4. Submit a pull request with a clear description

## Code Quality

Before submitting:
- Run `npm run lint` to check for linting issues
- Run `npm run format` to format code
- Run `npm run type-check` for TypeScript validation
- Run `npm run build` to ensure the project builds

## Questions?

Feel free to open an issue for any questions or suggestions!
