# MERN-APP BOILERPLATE README

Welcome to the MERN-APP boilerplate, a complete solution to quickly start a modern and secure full-stack application. This project is designed to help you create robust applications with secure authentication, role management, and much more.

## Table of Contents

<details>
  <summary>📑 Table of Contents</summary>
  
  - [Author](#author)
  - [Technologies Used](#technologies-used)
  - [Requirements](#requirements)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Run the Application](#run-the-application)
  - [Application Configuration](#application-configuration)
  - [Unit Tests](#unit-tests)
  - [Husky](#husky)
  - [Features](#features)
  - [Contribution](#contribution)
  
</details>

## Author

👨‍💻 **[Téo Villet](https://github.com/teovlt)** - Web Developer

## Technologies Used

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## Requirements

📦 Before starting, make sure you have the following installed:

- **Node.js**: v22.x or higher
- **pnpm**: v10.x or higher
- **Git**: v2.47.x or higher (for Husky hooks)
- **A modern browser** (Chrome, Firefox, etc.)

You can check your installed versions using:

```bash
node -v
pnpm -v
git --version
```

## Backend

🔙 Navigate to the `server` directory.  
You need to create a **.env** file containing the backend environment variables.

Example:

```env
PORT=
MONG_URI=
MONG_URI_TEST=
SECRET_ACCESS_TOKEN=
CORS_ORIGIN=
```

- **PORT** → The port your server will use.
- **MONG_URI** → MongoDB connection string (don’t forget to allow your IP in MongoDB Atlas if applicable).
- **MONG_URI_TEST** → Test DB URI (data gets wiped during tests — use a separate DB).
- **SECRET_ACCESS_TOKEN** → JWT token secret (use this command : *openssl rand -base64 64*).
- **CORS_ORIGIN** → Frontend URL for CORS setup.

Refer to the `.env.example` file in the `server` directory for guidance.

## Frontend

🎨 Navigate to the `client` directory and create a **.env** file:

```env
VITE_API_URL=
```

- **VITE_API_URL** → URL of your backend server (e.g. `http://localhost:5000`)

See `.env.example` in `client` for reference.

## Run the Application

⚡ Install and run the frontend and backend separately in two terminals:

**Terminal 1: Start the Frontend**

```bash
cd client
pnpm i
pnpm dev
```

**Terminal 2: Start the Backend**

```bash
cd server
pnpm i
pnpm dev
```

You should see the following messages in the terminal:

```bash
Server listenning on port ... 🚀
Connected to the database 🧰
```

Once both are running, go to [http://localhost:5173](http://localhost:5173) to see the application.

## Application Configuration

This boilerplate includes a `config` table in the database which stores dynamic configuration values, including the **application name**.

🧩 After cloning and launching the app:

1. **Register a new user** via the **Register** page (first user is an administrator by default).
2. Access the **Admin Dashboard**.
3. Go to the **Settings** section.
4. Set your **application name** (APP_NAME).

📛 This name will be displayed in various places across the app, providing a personalized brand. Once configured, your application is fully ready to be extended for your use case.

## Unit Tests

🧪 First, turn off the server if it's running, then run:

```bash
pnpm run test
```

To check full test coverage:

```bash
pnpm run coverage
```

The coverage report will be generated in the `server/coverage` folder.  
Don’t forget to restart the server afterward.

## Husky

🐶 **Husky Integration**:

This project uses **Husky** to automatically run code formatting and lint checks before each commit, ensuring a consistent codebase.
If the pre-commit hook doesn’t work, verify that husky have the correct permissions:

```bash
chmod +x .husky/pre-commit
```

### Benefits

- ✨ **Consistent Style**
- 🛠️ **Less Manual Work**
- ✅ **Reliable Codebase**

## Features

🚀 **Features:**

- 📜 Log Management
- 👥 User CRUD (Create, Read, Update, Delete)
- 🔒 JWT-based Authentication
- 🏢 Role-based Access Control (Admin, User)
- ✅ Unit Testing with Coverage
- 📝 Fully Commented Backend Code
- 🔗 API Requests with Axios
- 📊 Admin Dashboard
- 🔐 Protected & Conditional Routing
- 🌙 Light/Dark Theme Toggle
- 🌍 i18n Multi-language Support
- 🎨 TailwindCSS + ShadCN UI
- 📋 Ready-to-use Auth Forms
- 🔄 Prettier Formatting
- 🖼 Avatar Upload with GIF support
- 📡 Real-time Online Status via WebSocket
- 🧩 Application Configuration via Database

## Contribution

🤝 We welcome contributions! To contribute:

1. **Fork** the repository.
2. Create a new branch: `git checkout -b feature/my-feature`.
3. Commit your changes: `git commit -m 'Add my feature'`.
4. Push to GitHub: `git push origin feature/my-feature`.
5. Open a Pull Request.

### Contribution Guidelines

- Comment your code when necessary.
- Follow naming and style conventions.
- Add unit tests when applicable.
