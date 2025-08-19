# CelestiMap Frontend

CelestiMap is an **interactive 3D star mapping web application** designed for astronomy enthusiasts, educators, and researchers. The frontend is built as a modern **React Single-Page Application (SPA)**, providing immersive visualization and intuitive user interactions.

## ✨ Features

- **3D Star Map Visualization**
  - Powered by **Three.js** with **react-three-fiber** renderer.
  - Navigate with free camera movement (zoom, rotate, pan).
  - Interactive stars and constellation lines in real time.
  - Hover and click events show detailed star information.

- **Constellation & Project Editing**
  - Add, remove, and edit stars and constellation lines.
  - Offline mode with **localStorage** persistence.
  - Online mode for authenticated project management.

- **Public Gallery & Collaboration**
  - Browse community-created star maps with pagination, search, and sort.
  - Favorite and bookmark public projects.
  - View-only mode for public/shared projects.

- **Import / Export**
  - Import or export projects as **JSON** or **CSV**.
  - Interoperable with other tools.

- **NASA Integrations**
  - Astronomy Picture of the Day (APOD) viewer.
  - Near-Earth Object (NEO) asteroid visualization in 3D.

- **User Authentication**
  - Register/Login via JWT-secured API.
  - Conditional UI for guests vs. authenticated users.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/)
- **3D Rendering**: [Three.js](https://threejs.org/) via [react-three-fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- **UI Helpers**: [drei](https://github.com/pmndrs/drei), CSS/HTML
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management**: React Hooks & Context API
- **API Communication**: [Axios](https://axios-http.com/)
- **Persistence**: localStorage (guest mode), REST API (authenticated)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
