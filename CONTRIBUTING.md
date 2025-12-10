# Contributing to Realtor India Platform

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/realtor-india-platform.git
   cd realtor-india-platform
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your credentials
   ```
5. **Run development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/property-comparison`)
- `fix/` - Bug fixes (e.g., `fix/search-filter-bug`)
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(search): add advanced property filters
fix(map): resolve marker clustering issue
docs(readme): update installation instructions
```

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Component Guidelines

1. **File Structure**
   ```
   components/
   ├── ui/           # Reusable UI components
   ├── property/     # Property-specific components
   ├── search/       # Search-related components
   └── maps/         # Map components
   ```

2. **Component Template**
   ```typescript
   'use client' // If using client-side features

   import { useState } from 'react'
   
   interface ComponentProps {
     // Define props
   }
   
   export default function Component({ }: ComponentProps) {
     // Component logic
     
     return (
       // JSX
     )
   }
   ```

3. **Best Practices**
   - Use TypeScript interfaces for props
   - Implement proper error handling
   - Add loading states
   - Make components accessible (ARIA labels)
   - Optimize for performance (memo, useMemo, useCallback)

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

**Test Guidelines:**
- Write unit tests for utilities
- Write integration tests for API calls
- Write E2E tests for critical user flows
- Aim for >80% code coverage

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference related issues
   - Describe what changed and why
   - Add screenshots for UI changes
   - Request review from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Feature Requests

1. Check existing issues first
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Use cases
   - Mockups/wireframes (if applicable)
3. Add appropriate labels

## Bug Reports

Include:
- **Description**: What happened?
- **Expected Behavior**: What should happen?
- **Steps to Reproduce**: How to trigger the bug?
- **Environment**: Browser, OS, device
- **Screenshots**: If applicable
- **Error Messages**: Console logs, stack traces

## Code Review Guidelines

### For Reviewers

- Be respectful and constructive
- Focus on code quality, not personal preferences
- Suggest improvements, don't demand
- Approve when ready, request changes if needed
- Test the changes locally if possible

### For Contributors

- Respond to feedback promptly
- Don't take criticism personally
- Ask questions if unclear
- Make requested changes
- Thank reviewers for their time

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Report inappropriate behavior
- Follow the Code of Conduct

## Questions?

- Open a GitHub Discussion
- Join our Discord (if available)
- Email: support@realtorindiaplatform.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Realtor India Platform! 🏠