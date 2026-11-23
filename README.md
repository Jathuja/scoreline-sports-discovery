# Scoreline – Sports Discovery App

> **IN3210 Mobile Applications Development – Assignment 2**  
> **Student Index Number:** 234089P  
> **Domain:** Sports  
> **Assigned Special Feature:** Share & Deep Link  

Scoreline is a cross-platform Sports Discovery mobile application built using **React Native CLI** and **TypeScript**. The application enables users to discover leagues, teams, and players across various sports, bookmark favourites with offline persistence, and share sports items via direct deep links.

---

## 1. Features & Capabilities

- **Secure Authentication:** Register and log in backed by DummyJSON with credentials and session tokens stored securely via `react-native-keychain`.
- **Sports Discovery:** Browse sports categories, discover leagues, view rosters, and explore comprehensive sports metadata via TheSportsDB API.
- **Search & Filter:** Instant search across teams, leagues, and sports players with debounced queries.
- **Rich Detail Views:** Dedicated details screens for teams, leagues, and players highlighting statistics, stadium details, and badges.
- **Offline-Ready Favourites:** Save favourite teams and leagues locally using `@react-native-async-storage/async-storage` for offline availability.
- **Special Feature – Share & Deep Link:** Share sports items with custom `scoreline://` deep links that route straight to the item details screen on app launch.

---

## 2. Technical Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native CLI (TypeScript) |
| **State Management** | Redux Toolkit (RTK) |
| **Navigation** | React Navigation (Native Stack + Bottom Tabs) |
| **Sports Data API** | TheSportsDB |
| **Authentication API** | DummyJSON |
| **Secure Token Storage** | `react-native-keychain` |
| **Non-Sensitive Storage** | `@react-native-async-storage/async-storage` |
| **Icons & Design** | Feather Icons, Centralized Theme System (44pt / 48dp touch targets) |
| **Code Quality** | ESLint, TypeScript Strict Checking, Prettier |
| **Testing** | Jest, React Native Testing Library |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |

---

## 3. Architecture & Project Structure

The project follows a modular, **feature-based architecture** separating UI, API, business logic, and state management:

```text
scoreline-sports-discovery/
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI pipeline (lint, type-check, tests)
├── .dockerignore
├── .env.example                   # Environment configuration template
├── Dockerfile                     # Containerized Node.js toolchain
├── docker-compose.yml
├── __tests__/                     # Unit and integration test suites
└── src/
    ├── api/                       # API clients (TheSportsDB, DummyJSON)
    ├── assets/                    # Static assets, fonts, icons
    ├── components/                # Reusable UI components & state feedback views
    │   ├── common/
    │   └── feedback/              # LoadingView, ErrorView, EmptyStateView
    ├── config/                    # Environment & runtime constants
    ├── features/                  # Domain feature modules
    │   ├── auth/                  # Authentication & session management
    │   ├── discovery/             # Sports browsing and search
    │   ├── details/               # Individual entity detail views
    │   ├── favourites/            # Favourites management with offline storage
    │   └── share/                 # Deep linking configuration & share handling
    ├── navigation/                # Navigation containers, stacks, tabs & deep linking
    ├── services/                  # Persistent storage services (Keychain & AsyncStorage)
    ├── store/                     # Redux Toolkit store, rootReducer, hooks
    ├── theme/                     # Design tokens (colors, typography, spacing, touch targets)
    ├── types/                     # Shared domain and navigation TypeScript types
    └── utils/                     # Formatting and helper utilities
```

---

## 4. Git Branch Strategy & Workflow

Strict branch strategy without direct commits to production:

```text
main (Stable Production)
  └── develop (Integration)
        └── feature/<feature-name> (Isolated feature branches)
```

1. All features are branched from `develop`.
2. Mandatory quality gates prior to commit: Jest, ESLint, TypeScript check, Docker build & tests.
3. Feature branches are committed with Conventional Commits and pushed.
4. Feature branches are merged directly into `develop` using `--no-ff`.
5. Post-merge verification is executed on `develop`.
6. Only verified releases are merged from `develop` into `main`.

---

## 5. Development & Verification Commands

### Prerequisites
- Node.js $\ge$ 20
- npm $\ge$ 10
- Docker & Docker Compose
- Android Studio / Xcode (for native mobile development on host machine)

### Local Setup
```bash
# Clone the repository
git clone https://github.com/Jathuja/scoreline-sports-discovery.git
cd scoreline-sports-discovery

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### Quality & Test Suite
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Run Jest tests
npm test
```

### Docker Verification
```bash
# Build Docker test container
docker compose build

# Run lint and tests inside container
docker compose run --rm test
```

---

## 6. Continuous Integration (CI)

GitHub Actions runs on every push and pull request targeting `main` and `develop`:
1. Dependency installation (`npm ci`).
2. ESLint verification.
3. TypeScript strict type-checking (`tsc --noEmit`).
4. Automated unit and integration test suite (`npm test`).
