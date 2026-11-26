# AI Usage Disclosure

**Project**: Scoreline – Sports Discovery App
**Module**: IN3210 Mobile Applications Development – Assignment 2
**Student Index Number**: 234089P

---

## Overview

This document discloses the use of AI-assisted tools during the development of the Scoreline project, in compliance with the module's AI usage policy.

---

## AI Tools Used

| Tool | Version / Provider | Purpose |
|------|-------------------|---------|
| **Google Antigravity** (Gemini 2.5 Pro) | Gemini / Google DeepMind | Architecture consultation, boilerplate scaffolding, test generation assistance, debugging assistance |

---

## How AI Was Used

### 1. Project Scaffolding and Architecture Design

**What AI helped with**: Initial folder structure decisions, Redux slice boilerplate, navigation configuration skeleton.

**Example prompt given**:
> "I'm building a React Native CLI app with TypeScript, Redux Toolkit, React Navigation (native stack + bottom tabs), and TheSportsDB API. What is a good feature-based folder structure?"

**AI output (paraphrased)**:
> Suggested `src/features/`, `src/components/`, `src/store/`, `src/services/`, `src/navigation/`, `src/theme/` with feature subfolders.

**How I used it**: Adopted the suggested structure as the base. Adjusted to include `src/features/details/components/` for shared detail-screen components (DetailsShared), which was not part of the AI's original suggestion.

---

### 2. Redux Thunk Boilerplate

**What AI helped with**: Generating the `createAsyncThunk` pattern for `loginThunk` and `restoreSessionThunk`.

**Example of AI-generated code (simplified)**:
```typescript
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    return response.data;
  }
);
```

**Problem I identified**: The AI-generated thunk did not include Keychain storage of the token. The returned token was only placed in Redux state, meaning it would be lost on app restart.

**Correction I made**:
```typescript
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const { token, ...user } = response.data;
      // AI missed this – token must be stored in Keychain, not just Redux
      await Keychain.setGenericPassword('scoreline_user', token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

**Why**: Redux state is in-memory and lost on restart. The assignment requires secure token storage using Keychain/Keystore. The AI did not account for the persistence requirement.

---

### 3. Jest Test Boilerplate

**What AI helped with**: Generating test file structure and common mock patterns for React Navigation, Redux store, AsyncStorage and React Native Keychain.

**Example of AI-generated mock (from jest.setup.js)**:
```javascript
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

**How I used it**: Used as a starting template. Added additional mocks for `react-native-keychain`, `react-native-vector-icons` and custom navigation context mocks that the AI did not include.

---

### 4. TheSportsDB API Response Parsing

**What AI helped with**: Understanding the response shape of TheSportsDB API endpoints.

**Problem I encountered**: AI suggested using the `3` API key (the documented free tier key). During development this returned HTTP 403 on some endpoints and 429 (rate limiting) on others.

**How I resolved it**: Through direct API testing I discovered that API key `123` is the correct stable free-tier key for TheSportsDB. This was not reflected in the AI's output and required manual investigation.

---

### 5. Deep Link Configuration

**What AI helped with**: Generating the React Navigation `linking` configuration structure for `scoreline://` scheme.

**AI-generated output**:
```typescript
const linking = {
  prefixes: ['scoreline://'],
  config: {
    screens: {
      TeamDetails: 'team/:teamId',
    }
  }
};
```

**What I had to extend**: The AI generated only a flat structure. The actual app has a nested navigator (Root → Main → Detail screens), requiring the config to reflect the navigator hierarchy with nested `screens` objects. I rewrote the linking config to match the actual nested navigation structure.

---

### 6. Dark Mode ThemeContext

**What AI helped with**: Initial `React.createContext` pattern for the theme system.

**Problem I identified**: The AI-generated context did not handle the case where `useAppTheme()` is called outside a `ThemeProvider` (e.g., in isolated Jest tests that render a single component). This caused `TypeError: Cannot read properties of undefined (reading 'colors')` in multiple test files.

**Correction I made**: Added a fallback default value to the context and to the `useAppTheme` hook:
```typescript
const ThemeContext = React.createContext<AppTheme>(lightTheme); // default = lightTheme

export const useAppTheme = (): AppTheme => {
  return useContext(ThemeContext) ?? lightTheme; // safe fallback
};
```

This ensures components work in test environments without wrapping in `ThemeProvider`, while still picking up the correct theme in the real app via `ThemeProvider`.

---

## Summary of AI Contributions vs My Contributions

| Area | AI Contribution | My Contribution |
|------|----------------|-----------------|
| Folder structure | Suggested base structure | Adapted and extended with details/components, finalized |
| Redux thunks | Boilerplate pattern | Added Keychain storage, error handling, session restore logic |
| Navigation config | Basic single-level config | Rewrote for nested navigator hierarchy + deep link paths |
| Jest tests | Mock setup patterns | Wrote all test assertions, edge cases, auth/nav/API/slice tests |
| API key | Suggested key `3` | Discovered key `123` through manual testing |
| ThemeContext | Basic context pattern | Added safe fallback for test environments, Redux+AsyncStorage integration |
| Secure storage | Not mentioned | Independently identified Keychain requirement from assignment spec |

---

## Ethical Statement

All AI outputs were reviewed, understood and tested before inclusion. AI was used as a development accelerator, not as a replacement for understanding. All architectural decisions, corrections to AI mistakes, and final implementations are my own work.

---

*AI_USAGE.md | 234089P | IN3210 Assignment 2 | Scoreline Sports Discovery App*
