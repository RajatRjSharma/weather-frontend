# weather-frontend

A modern, responsive weather dashboard application built with React and TypeScript using Vite, featuring current weather, 5-day forecast, local news, and nearby attractions integration.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Technologies](#technologies)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Search cities and save favorites with pagination support
- Displays current weather and a 5-day forecast with detailed information
- Shows nearby tourist attractions using external APIs
- Fetches local news headlines by country through backend
- User authentication and session management
- Responsive sidebar with mobile-friendly drawer
- Smooth user experience with loading skeletons and error handling

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

git clone https://github.com/rajatrjsharma/weather-frontend.git
cd weather-frontend

2. Install dependencies:

Using npm:

npm install

Using yarn:

yarn install

3. Create a `.env` file in the root directory with the following environment variable:

VITE_BACKEND_URL=http://localhost:3000/api

This variable defines the backend API base URL your frontend will communicate with.

4. Run the development server:

npm run dev

or

yarn dev

5. Open your browser at `http://localhost:5173` (default Vite port) to use the app.

---

## Project Structure

- `src/components` - Reusable components like Sidebar, WeatherDisplay, NewsList, AttractionsList
- `src/hooks` - Custom React hooks such as `useCurrentLocation`
- `src/context` - React context for authentication
- `src/api` - API helper modules that use `VITE_BACKEND_URL` as base URL
- `src/pages` - Main page components such as the Dashboard
- `src/styles` - Theme and style-related files

---

## Available Scripts

- `npm run dev` — Runs the app in development mode with hot reload
- `npm run build` — Builds the app for production to the `dist` folder
- `npm run preview` — Preview the production build locally
- `npm run lint` — Runs ESLint for code linting

---

## Technologies

- React 18 + TypeScript for UI
- Vite for fast bundling and dev server
- Material UI (MUI) for UI components and styling
- Axios for HTTP requests
- React Router for routing
- Custom hooks and context for state management

---

## Environment Variables

| Variable           | Description                         |
| ------------------ | ----------------------------------- |
| `VITE_BACKEND_URL` | Base URL for backend API endpoints. |

> **Note:** Variables must be prefixed with `VITE_` to work with Vite.

---

## Usage

- Search for cities using the search bar and select one to view detailed weather and news.
- Save favorite cities to the sidebar for quick access.
- Use the sidebar pagination controls to navigate through saved cities.
- View current weather, a detailed 5-day forecast, local attractions, and news headlines for selected cities.

---

## Contributing

Contributions and suggestions are welcome! Please fork the repository and make a pull request with descriptive commit messages.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

Thank you for using **weather-frontend**! If you have any questions or issues, please open an issue on the GitHub repository.
