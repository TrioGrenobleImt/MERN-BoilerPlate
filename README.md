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
  - [Firebase OAuth Setup](#firebase-oauth-setup)
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

- [**Node.js**](https://nodejs.org/en): v22.x or higher
- [**pnpm**](https://pnpm.io/fr/): v10.x or higher
- [**Git**](https://git-scm.com/): v2.47.x or higher (for Husky hooks)
- [**MongoDB**](https://www.mongodb.com/): v8.0.9 or higher
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
- **SECRET_ACCESS_TOKEN** → JWT token secret (use this command : _openssl rand -base64 64_).
- **CORS_ORIGIN** → Frontend URL for CORS setup.

Refer to the `.env.example` file in the `server` directory for guidance.

## Frontend

🎨 Navigate to the `client` directory and create a **.env** file:

```env
VITE_API_URL=
```

- **VITE_API_URL** → URL of your backend server (e.g. `http://localhost:5000`)

See `.env.example` in `client` for reference.

## Firebase OAuth Setup

**Non mandatory**
🔑 If you want to enable Google OAuth for user authentication, follow these steps to set up Firebase:

🔐 This app uses **Firebase Authentication with Google OAuth** to let users sign in effortlessly.

Here’s how to set it up quickly:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and **create a new project**.
2. Once inside your project, click on **“Authentication”** in the sidebar.
3. Click on **“Get started”**, then select **Google** as the sign-in method.
4. Enable the provider:
   - (Optional) Change the **app name**
   - Add a **support email**
   - Save ✅

Next up:

5. Go back to your **Firebase dashboard**, and click the **web icon `</>`** to register a new web app.
6. Enter your app name and move to the next step.  
   You’ll get a config object like this:

```js
const firebaseConfig = {
  apiKey: "XXXX",
  authDomain: "XXXX.firebaseapp.com",
  projectId: "XXXX",
  storageBucket: "XXXX.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX",
  measurementId: "XXXX", // 👉 not needed
};
```

7. Copy every line **except `measurementId`** into your `.env` file inside the `client` folder:

```env
VITE_API_URL=...

VITE_FIREBASE_API_KEY=XXXX
VITE_FIREBASE_AUTH_DOMAIN=XXXX.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=XXXX
VITE_FIREBASE_STORAGE_BUCKET=XXXX.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=XXXX
VITE_FIREBASE_APP_ID=XXXX
```

8. Finally, click **“Go to Console”** to complete the setup.  
   Your app is now connected to Firebase and ready to support Google OAuth login 🚀

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
4. Set the configuration you want for your application.

Once configured, your application is fully ready to be extended for your use case.

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

- **Consistent Style**
- **Less Manual Work**
- **Reliable Codebase**

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
- 🔑 OAuth with Google via Firebase

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
