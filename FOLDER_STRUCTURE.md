# Manufacturing ERP - Folder Structure

```
new_erp/
├── app/                          # Next.js App Router directory
│   ├── (main)/                   # Route group for main application (protected routes)
│   │   ├── layout.tsx            # Main layout with sidebar
│   │   └── dashboard/
│   │       └── page.tsx          # Dashboard page with overview cards
│   ├── auth/                     # Authentication pages (to be created)
│   │   └── login/
│   │       └── page.tsx
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout with ThemeProvider
│   └── page.tsx                  # Home page (redirects to dashboard)
│
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx           # Persistent sidebar navigation
│   ├── providers/
│   │   └── ThemeProvider.tsx     # Theme context (dark/light mode)
│   └── ui/
│       └── ThemeToggle.tsx       # Theme toggle button
│
├── lib/                          # Utility functions (to be created)
│   ├── db/                       # Database helpers (Supabase/MongoDB)
│   └── utils.ts                  # General utilities
│
├── types/                        # TypeScript type definitions (to be created)
│   ├── inventory.ts
│   ├── employee.ts
│   ├── machine.ts
│   └── qc.ts
│
├── public/                       # Static assets
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.js                # Next.js configuration
├── postcss.config.js             # PostCSS configuration
└── README.md                     # Project documentation
```

## Planned Module Structure

The following modules will be added in the `app/(main)/` directory:

- `inventory/` - Inventory Management (Raw Materials & Finished Goods)
- `employees/` - Employee Directory
- `machines/` - Machine Tracking
- `quality-control/` - Quality Control Logs

Each module will have:
- `page.tsx` - Main page component
- `components/` - Module-specific components (if needed)

## Component Organization

- **Layout Components**: Sidebar, Header, Footer (in `components/layout/`)
- **UI Components**: Reusable components like buttons, cards, tables (in `components/ui/`)
- **Providers**: Context providers for theme, auth, etc. (in `components/providers/`)

## Database Integration Points

When connecting a database, you'll add:
- `lib/db/` - Database connection and query functions
- Replace mock data in each module with actual database calls
- Add data fetching in server components or API routes
