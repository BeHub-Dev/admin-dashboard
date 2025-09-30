# BeHub Admin Dashboard

A modern admin dashboard built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components for managing BeHub service categories.

## Features

- **Authentication System**: Secure email/password login with JWT token management and automatic refresh
- **Service Category Management**: Full CRUD operations for service categories
- **Profile Management**: View and manage admin account information
- **Dark/Light Theme**: Toggle between dark and light modes with system preference support
- **Data Tables**: Responsive tables with pagination, search, and sorting
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application
- **Protected Routes**: Middleware-based route protection for authenticated pages

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Theme**: next-themes
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or download the project files

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

### Environment Variables

The application uses the following API base URL (hardcoded in the axios instance):

\`\`\`
https://behub-469408.uc.r.appspot.com/api/v1
\`\`\`

If you need to change this, update the `baseURL` in `lib/api/axios-instance.ts`.

### Running the Application

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
├── app/
│ ├── dashboard/ # Protected dashboard pages
│ │ ├── service-categories/ # Service category management
│ │ ├── profile/ # User profile page
│ │ └── layout.tsx # Dashboard layout with sidebar
│ ├── login/ # Login page
│ └── layout.tsx # Root layout
├── components/
│ ├── auth/ # Authentication components
│ ├── dashboard/ # Dashboard layout components
│ ├── service-categories/ # Service category components
│ ├── theme-provider.tsx # Theme provider component
│ └── ui/ # shadcn/ui components
├── lib/
│ ├── api/ # API configuration
│ │ ├── axios-instance.ts # Axios setup with interceptors
│ │ └── endpoints.ts # API endpoint constants
│ ├── constants/ # Application constants
│ ├── helpers/ # Helper functions
│ ├── services/ # API service layer
│ └── types/ # TypeScript type definitions
└── middleware.ts # Route protection middleware
\`\`\`

## API Integration

The dashboard integrates with the BeHub API for:

- **Authentication**: Login and token refresh
- **Service Categories**: Create, read, update, and delete operations

### Authentication Flow

1. User logs in with email and password
2. Access token stored in cookies (with optional "Remember Me" for 30 days)
3. Refresh token stored in localStorage
4. Automatic token refresh when access token expires
5. Automatic logout on refresh token expiration

## Key Features

### Service Category Management

- **List View**: Paginated table with advanced search functionality
- **Search with Clear**: Search box with clear button (X icon) for easy search term removal
- **Create**: Form to add new service categories
- **Edit**: Update existing categories
- **Delete**: Remove categories with confirmation
- **Sorting**: Categories sorted by sort order
- **Debounced Search**: Search input with 500ms debounce for optimal performance

### Profile Management

- **View Profile**: Display admin account information including name, email, phone, role, and status
- **Account Details**: View account creation date, last update, and verification status
- **Avatar Display**: Profile picture with fallback initials

### Theme Support

- **Dark Mode**: Full dark mode support across all pages
- **Light Mode**: Clean light mode interface
- **System Preference**: Automatically detects and follows system theme preference
- **Theme Toggle**: Easy switching between themes via header button
- **Persistent**: Theme preference saved across sessions

### SEO & Crawling Protection

This is an admin dashboard and should not be indexed by search engines. Multiple layers of protection are implemented:

- **Meta Robots Tags**: Added to root layout with `noindex`, `nofollow`, and `nocache` directives
- **robots.txt**: Blocks all major search engine crawlers (Google, Bing, Yahoo, DuckDuckGo, Baidu, Yandex)
- **X-Robots-Tag Header**: HTTP header sent with every response to prevent indexing, following, archiving, and caching
- **Triple Layer Protection**: Ensures the admin dashboard remains private and unsearchable

## Development

### Adding New Features

1. Define types in `lib/types/`
2. Add API endpoints in `lib/api/endpoints.ts`
3. Create service methods in `lib/services/`
4. Build UI components in `components/`
5. Create pages in `app/`

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use client components ("use client") for interactive features
- Implement proper error handling
- Use shadcn/ui components for consistency

## Troubleshooting

### Common Issues

**Login not working:**

- Check API base URL in `lib/api/axios-instance.ts`
- Verify credentials are correct
- Check browser console for errors

**Token refresh failing:**

- Clear browser cookies and localStorage
- Log in again to get fresh tokens

**API errors:**

- Verify the API is accessible
- Check network tab in browser dev tools
- Ensure proper CORS configuration on the API

## License

This project is private and proprietary.
