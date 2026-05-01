# Think Tank Prediction System

Ein KI-gestütztes Vorhersagesystem, das komplexe Zukunftsfragen durch simulierte Expertendiskussionen analysiert. Zwölf spezialisierte KI-Agenten debattieren in strukturierten Phasen, um fundierte Prognosen zu entwickeln.

## 🎯 Überblick

Das System simuliert einen interdisziplinären Think Tank mit Experten aus verschiedenen Fachbereichen:
- **Quantitative Analyse** (Dr. Clara Weber)
- **Technologie & Innovation** (Max Chen)
- **Wissenschaftsphilosophie** (Prof. Karl Braun)
- **Wirtschaft & Strategie** (Sarah Müller)
- **Gesellschaft & Kultur** (Dr. Amara Okafor)
- **Systemtheorie** (Leo Nakamura)
- **Volkswirtschaft** (Dr. James Thornton)
- **Regulierung & Governance** (Elena Rossi)
- **Psychologie** (Dr. Yuki Tanaka)
- **Sicherheit & Risiko** (Marcus Okafor)
- **Historische Analyse** (Prof. Anna Lindqvist)
- **Ethik & Philosophie** (Dr. Priya Sharma)

### Diskussionsphasen

1. **Erstanalyse** - Initiale fundierte Analysen aller Experten
2. **Szenarienentwicklung** - Entwicklung denkbarer Zukunftsszenarien
3. **Methodenkritik** - Prüfung der Stichhaltigkeit
4. **Kontroverse Debatte** - Widersprüche und Gegenpositionen
5. **Antithese** - Konstruktion stärkster Gegenargumente
6. **Synthese** - Integration zu kohärenter Gesamtsicht
7. **Stresstest** - Extremszenarien und Robustheitsprüfung
8. **Konsensbildung** - Konvergenz zu gemeinsamer Position
9. **Validierung** - Finale Qualitätssicherung
10. **Prognose** - Finale strukturierte Vorhersage

## 🏗️ Tech Stack

### Frontend
- **React 19** mit TypeScript
- **Vite 7** als Build-Tool
- **React Router 7** für Navigation
- **TailwindCSS 3.4** + **shadcn/ui** für UI-Komponenten
- **TanStack Query** für State Management
- **tRPC** für Type-Safe API-Kommunikation

### Backend
- **Hono** als Web-Framework
- **tRPC** für API-Layer
- **Drizzle ORM** für Datenbankzugriff
- **MySQL** als Datenbank
- **Jose** für JWT-Authentifizierung
- **Kimi OAuth** für Benutzer-Login

### DevOps
- **Docker** für Containerisierung
- **ESLint** + **Prettier** für Code-Qualität
- **Vitest** für Testing

## 📁 Projektstruktur

```
app/
├── api/                      # Backend-Code
│   ├── boot.ts              # Server-Einstiegspunkt
│   ├── router.ts            # tRPC-Router
│   ├── context.ts           # Request-Context
│   ├── middleware.ts        # Auth-Middleware
│   ├── auth-router.ts       # Authentifizierungs-Routen
│   ├── kimi/                # Kimi OAuth-Integration
│   ├── lib/                 # Backend-Utilities
│   ├── queries/             # Datenbank-Queries
│   └── think-tank/          # KI-Agenten-Engine
├── contracts/               # Shared Types & Constants
├── db/                      # Datenbank-Schema & Migrations
│   ├── schema.ts           # Drizzle-Schema
│   ├── relations.ts        # Tabellen-Relationen
│   ├── seed.ts             # Seed-Daten
│   └── migrations/         # SQL-Migrationen
├── src/                     # Frontend-Code
│   ├── components/         # React-Komponenten
│   │   ├── ui/            # shadcn/ui-Komponenten (40+)
│   │   ├── AuthLayout.tsx
│   │   └── AuthLayoutSkeleton.tsx
│   ├── pages/              # Seiten-Komponenten
│   │   ├── Home.tsx       # Startseite mit Session-Erstellung
│   │   ├── Session.tsx    # Live-Diskussionsansicht
│   │   ├── Login.tsx      # Login-Seite
│   │   └── NotFound.tsx
│   ├── hooks/              # Custom React Hooks
│   ├── providers/          # Context-Provider
│   ├── types/              # TypeScript-Typen
│   ├── App.tsx            # Root-Komponente
│   └── main.tsx           # Einstiegspunkt
├── .env.example            # Umgebungsvariablen-Template
├── Dockerfile              # Container-Definition
├── package.json
└── vite.config.ts
```

## 🚀 Installation & Setup

### Voraussetzungen

- **Node.js 20+**
- **MySQL 8+**
- **npm** oder **pnpm**

### 1. Repository klonen

```bash
git clone <repository-url>
cd app
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren

Kopiere `.env.example` zu `.env` und fülle die Werte aus:

```bash
cp .env.example .env
```

**Erforderliche Variablen:**

```env
# Backend
APP_ID=your-app-id
APP_SECRET=your-secret-key-for-jwt

# Database
DATABASE_URL=mysql://user:password@localhost:3306/think_tank

# Frontend (Kimi OAuth)
VITE_KIMI_AUTH_URL=https://auth.kimi.com
VITE_APP_ID=your-kimi-app-id

# Backend (Kimi OAuth)
KIMI_AUTH_URL=https://auth.kimi.com
KIMI_OPEN_URL=https://open.kimi.com

# Admin
OWNER_UNION_ID=your-union-id-for-admin-role
```

### 4. Datenbank einrichten

```bash
# Schema generieren
npm run db:generate

# Migrationen ausführen
npm run db:migrate

# Optional: Seed-Daten laden
npm run db:push
```

### 5. Development-Server starten

```bash
npm run dev
```

Die App läuft auf `http://localhost:5173`

## 🐳 Docker Deployment

### Image bauen

```bash
docker build -t think-tank-app .
```

### Container starten

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://user:pass@host:3306/db \
  -e APP_ID=your-app-id \
  -e APP_SECRET=your-secret \
  -e KIMI_AUTH_URL=https://auth.kimi.com \
  -e KIMI_OPEN_URL=https://open.kimi.com \
  -e VITE_KIMI_AUTH_URL=https://auth.kimi.com \
  -e VITE_APP_ID=your-app-id \
  -e OWNER_UNION_ID=your-union-id \
  think-tank-app
```

## 📊 Datenbank-Schema

### Tabellen

**users**
- `id` - Primary Key
- `unionId` - Kimi OAuth Union ID (unique)
- `name`, `email`, `avatar` - Benutzerprofil
- `role` - `user` oder `admin`
- Timestamps: `createdAt`, `updatedAt`, `lastSignInAt`

**prediction_sessions**
- `id` - Primary Key
- `userId` - Foreign Key zu `users`
- `topic` - Fragestellung (max 500 Zeichen)
- `status` - `running`, `completed`, `failed`, `insufficient_consensus`
- `currentPhase` - Aktuelle Diskussionsphase
- Timestamps: `createdAt`, `updatedAt`

**discussion_messages**
- `id` - Primary Key
- `sessionId` - Foreign Key zu `prediction_sessions`
- `agentId` - ID des sprechenden Agenten
- `phase` - Phase der Nachricht
- `content` - Nachrichteninhalt (JSON)
- `timestamp` - Erstellungszeitpunkt

## 🔧 Verfügbare Scripts

```bash
npm run dev          # Development-Server (Vite + Backend)
npm run build        # Production-Build (Frontend + Backend)
npm run start        # Production-Server starten
npm run preview      # Build-Preview
npm run lint         # ESLint ausführen
npm run format       # Code mit Prettier formatieren
npm run check        # TypeScript-Typecheck
npm run test         # Tests ausführen (Vitest)
npm run db:generate  # Drizzle-Migrationen generieren
npm run db:migrate   # Migrationen ausführen
npm run db:push      # Schema direkt pushen (Dev)
```

## 🔐 Authentifizierung

Das System nutzt **Kimi OAuth** für die Benutzerauthentifizierung:

1. Benutzer klickt auf "Login"
2. Weiterleitung zu Kimi OAuth-Server
3. Nach erfolgreicher Authentifizierung: Callback mit Authorization Code
4. Backend tauscht Code gegen Access Token
5. Benutzerprofil wird abgerufen und in DB gespeichert
6. JWT-Token wird generiert und als Cookie gesetzt

Der erste Benutzer mit der `OWNER_UNION_ID` erhält automatisch die Admin-Rolle.

## 🎨 UI-Komponenten

Das Projekt nutzt **shadcn/ui** mit über 40 vorgefertigten Komponenten:

- Formulare: `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`
- Layout: `card`, `separator`, `tabs`, `accordion`, `collapsible`
- Navigation: `navigation-menu`, `menubar`, `breadcrumb`, `pagination`
- Feedback: `alert`, `toast` (sonner), `progress`, `spinner`, `skeleton`
- Overlays: `dialog`, `drawer`, `popover`, `tooltip`, `hover-card`
- Daten: `table`, `chart` (recharts), `calendar`, `carousel`
- Und viele mehr...

Import-Beispiel:
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📝 Code-Qualität

- **TypeScript** für Type-Safety
- **ESLint** für Code-Linting
- **Prettier** für Code-Formatierung
- **Vitest** für Unit-Tests

Vor dem Commit:
```bash
npm run lint
npm run format
npm run check
npm run test
```

## 🔒 Sicherheit

- JWT-basierte Authentifizierung
- Sichere Cookie-Verwaltung
- Input-Validierung mit Zod
- SQL-Injection-Schutz durch Drizzle ORM
- CORS-Konfiguration
- Body-Size-Limit (50MB)

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 👥 Autoren

**Alexander Ibach** ([@Lexylent](https://github.com/Lexylent))
- Konzept & Entwicklung
- System-Architektur
- KI-Agenten-Engine

Entwickelt mit Unterstützung von Claude Code (Anthropic).

## 🐛 Bug Reports & Feature Requests

Bitte öffne ein [Issue auf GitHub](https://github.com/Lexylent/oracle-ai/issues) für:
- 🐛 Bug Reports
- ✨ Feature Requests
- 💡 Verbesserungsvorschläge
- 📖 Dokumentations-Feedback

## 📞 Support

- **GitHub Issues:** [oracle-ai/issues](https://github.com/Lexylent/oracle-ai/issues)
- **Discussions:** [oracle-ai/discussions](https://github.com/Lexylent/oracle-ai/discussions)

---

**Entwickelt 2026** | Powered by React, Hono, tRPC & Drizzle ORM
