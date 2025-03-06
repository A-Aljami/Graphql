# GraphQL Profile Page

A modern React application that displays user profile information and statistics using GraphQL queries. The application includes a login page with authentication and a profile dashboard with interactive SVG charts.

## Features

- **Authentication System**

  - Login with username or email
  - JWT-based authentication
  - Secure API access

- **Profile Dashboard**

  - User information display
  - Key statistics overview
  - Interactive data visualizations

- **SVG Data Visualizations**
  - XP Timeline Chart - Shows progress over time
  - Project XP Distribution - Pie chart showing XP earned by project
  - Audit Ratio Gauge - Visual representation of audit ratio

## Technologies Used

- React 19
- React Router 7
- Apollo Client for GraphQL
- Styled Components
- JWT Authentication
- SVG for data visualization

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```
git clone <repository-url>
```

2. Install dependencies

```
npm install
```

3. Start the development server

```
npm start
```

4. Build for production

```
npm run build
```

## Project Structure

```
/
├── public/                # Static files
│   └── index.html         # HTML template
├── src/                   # Source code
│   ├── components/        # Reusable components
│   │   ├── XPTimelineChart.js
│   │   ├── ProjectXPChart.js
│   │   └── AuditRatioChart.js
│   ├── graphql/           # GraphQL related files
│   │   ├── client.js      # Apollo client configuration
│   │   └── queries.js     # GraphQL queries
│   ├── pages/             # Page components
│   │   ├── Login.js       # Login page
│   │   └── Profile.js     # Profile dashboard
│   ├── utils/             # Utility functions
│   │   └── AuthContext.js # Authentication context
│   ├── App.js             # Main application component
│   └── index.js           # Application entry point
├── package.json           # Project dependencies
└── webpack.config.js      # Webpack configuration
```

## Deployment

This application can be deployed to various hosting platforms:

- GitHub Pages
- Netlify
- Any static hosting service

## License

This project is licensed under the ISC License.
