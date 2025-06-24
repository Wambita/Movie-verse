# 🎬 MovieVerse – Movie & TV Discovery Web App

## 📌 Project Description

MovieVerse is a responsive web application that allows users to explore, search, and manage movies and TV shows. The platform integrates with TMDB and OMDB APIs to provide real-time data including posters, cast, plots, and ratings.

Users can:
- Search for movies and TV shows with live results
- View detailed information about titles
- Add/remove content from a personal watchlist
- Browse trending content by category
- Toggle between light and dark themes

## 🚀 Core Features

- **Search functionality**: Search for movies and TV shows with real-time results.
- **Detailed View Pages**: Show title, plot, cast, ratings, release date, and poster images.
- **Personal Watchlist Management**: Add/remove titles, mark as watched.
- **Trending Content Dashboard**: Discover popular movies and shows.
- **Genre-based Filtering**: Browse content by genre and category.
- **User Ratings Integration**: From multiple sources (IMDB, Rotten Tomatoes, TMDB).
- **Recommendation Engine**: Based on user's watchlist preferences.
- **Responsive Design**: Adapts to mobile and desktop viewing.

## 🛠️ Technical Requirements

- **API Integration**: Utilize TMDB API for core data and OMDB API for detailed ratings. Implement `async/await` with `try/catch` for error handling.
- **Loading States & Fallbacks**: Show loading states and fallback UIs for missing data.
- **Pagination**: For search results and content lists.
- **API Caching**: Cache API responses to improve performance.
- **Rate Limiting**: Handle API rate limiting gracefully.
- **Secure API Key Management**: Using environment variables.
- **Debouncing**: Implement debouncing for search input.

## 🗄️ Data Management

- **LocalStorage**: Store user preferences and watchlists.
- **Data Sync**: Between TMDB and OMDB APIs.
- **Fallback Handling**: Gracefully handle missing data.
- **Data Validation**: For API responses.

## 📂 Folder & File Structure

```
src/
├── components/          # Reusable UI components
├── features/            # Feature-specific components (e.g., search, watchlist, theme)
│   ├── search/
│   ├── movie-details/
│   ├── trending/
│   ├── watchlist/
│   └── theme/
├── services/            # API logic (tmdb.js, omdb.js)
├── utils/               # Utility functions (debounce, storage, helpers)
├── hooks/               # Custom React hooks
├── pages/               # Next.js pages
├── assets/              # Static assets like images
└── styles/              # Global styles
```

## 🎨 Styling

- **Tailwind CSS**: Used for styling.
- **Responsive Layout**: Adapts to mobile, tablet, and desktop views.
- **Dark/Light Theme Toggle**: Supported.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd Movie-verse
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory and a `.env.local` file in the `frontend` directory with your API keys:

**`backend/.env`**
```env
PORT=3001
TMDB_API_KEY=YOUR_TMDB_API_KEY
OMDB_API_KEY=YOUR_OMDB_API_KEY
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_TMDB_API_KEY=YOUR_TMDB_API_KEY
NEXT_PUBLIC_OMDB_API_KEY=YOUR_OMDB_API_KEY
```

Replace `YOUR_TMDB_API_KEY` and `YOUR_OMDB_API_KEY` with your actual API keys from TMDB and OMDB.

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

   The frontend application will be accessible at `http://localhost:3000` (or another port if 3000 is in use).

## 🤝 Pair Programming & Code Review Process

This project emphasizes collaborative development and code review. Please adhere to the following guidelines:

1.  **Partner Assignment**: Work in pairs for mutual code reviews.
2.  **Repository Setup**: Each candidate creates their own GitHub repository from scratch.
3.  **Cross-Review System**: You will review your partner's code, and they will review yours.
4.  **Collaboration Requirements**:
    *   Exchange GitHub repository links with your partner.
    *   Review each other's PRs within the given timeframe (e.g., 36 hours).
    *   Provide constructive feedback on code quality, best practices, and functionality.
    *   Respond professionally to feedback received.

## ✅ GitHub Process Checklist

1.  **Initialize Repository**: Create a new GitHub repository for your project.
2.  **Create Feature Branches**: For major functionality (e.g., `feature/search-and-discovery`, `feature/watchlist-management`).
3.  **Make Commits**: At least 5 commits with clear, descriptive messages (e.g., `feat: add search with debounce and API call`, `fix: handle empty TMDB responses gracefully`).
4.  **Push Branches**: Push your feature branches to your GitHub repository.
5.  **Open Pull Requests**: Against your main branch.
6.  **Request Review**: From your assigned partner.
7.  **Review Partner's PRs**: Provide meaningful feedback on:
    *   Code structure and organization
    *   API integration implementation
    *   Error handling approaches
    *   User experience considerations
    *   Performance optimizations
8.  **Address Feedback**: On your own PRs.
9.  **Do Not Merge Your Own PRs**: Until after peer review is complete.

## 📝 Code Review Guidelines

-   **Be Constructive**: Focus on code improvement, not criticism.
-   **Be Specific**: Point to exact lines and suggest alternatives.
-   **Ask Questions**: If something is unclear, ask for clarification.
-   **Acknowledge Good Work**: Highlight well-implemented features.
-   **Check for**: API error handling, code reusability, naming conventions, performance considerations.

## ✨ Bonus Features (Implemented/Planned)

-   **Dark/Light Theme Toggle**
-   Advanced filtering by year, rating, runtime
-   Social features - share favorite movies
-   Watch providers integration (Netflix, Hulu, etc.)
-   Trailer integration using YouTube API
-   Export watchlist as PDF or CSV

## 📊 Evaluation Criteria

-   Quality of code and architecture
-   Effective API integration and error handling
-   Thoroughness and professionalism of code reviews given
-   Responsiveness to feedback received
-   Git workflow and commit quality
-   Feature completeness and user experience

This task tests both individual development skills and collaborative code review abilities that are essential in team-based development environments.