# Copilot Instructions for React Training Project

## Project Overview
This is a frontend learning-oriented training project using React 19, Vite, TypeScript, Node.js Express backend, and SQLite database.

## Code Style and Architecture

### General Rules
- **TypeScript Only**: All code must be written in TypeScript. No JavaScript files allowed.
- **Feature Slice Pattern**: Organize all code using the feature slice pattern.
- **No Direct API Calls**: Components never call API directly. Always use Redux + Saga.

### File Organization
Each feature should follow this structure:
```
pages/
  <feature>/
    components/
    store/
      <feature>.slice.ts
      <feature>.saga.ts
    api/
      <feature>.api.ts
    <Feature>List.tsx
    <Feature>Form.tsx
```

### Redux Architecture
- **Actions**: Define clear action types in slices
- **Reducers**: Keep reducers pure and simple
- **Sagas**: Handle all side effects (API calls) in sagas
- **Selectors**: Use selectors for accessing state

### Component Guidelines
- Use functional components with hooks
- Keep components small and focused
- Minimal validation for forms (this is a training project)
- Use TypeScript interfaces for all props and state

### API Communication
- All API calls must go through saga middleware
- API functions return typed responses
- Handle errors consistently across all features

### Backend Guidelines
- RESTful API endpoints
- Consistent response format: `{ success: boolean, data?: any, error?: string }`
- Use Express middleware for error handling
- SQLite for data persistence

## Code Quality
- Follow ESLint rules strictly
- Use meaningful variable and function names
- Keep functions small and single-purpose
- Add comments only when necessary for complex logic
