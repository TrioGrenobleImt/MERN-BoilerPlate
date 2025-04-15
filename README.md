# MERN-APP BOILERPLATE README

Welcome to the MERN-APP boilerplate, a complete solution to quickly start a modern and secure full-stack application. This project is designed to help you create robust applications with secure authentication, role management, and much more.

## Table of Contents

<details>
  <summary>📑 Table of Contents</summary>
  
  - [Author](#author)
  - [Technologies Used](#technologies-used)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Unit Tests](#unit-tests)
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

## Backend

🔙 Navigate to the `server` directory.  
You first need to create a **.env** file containing the backend environment variables.

Example below:

```env
PORT=
MONG_URI=
MONG_URI_TEST=
SECRET_ACCESS_TOKEN=
CORS_ORIGIN=
```

- **PORT** -> The port your server will use.
- **MONG_URI** -> Connection address to a MongoDB database (Don't forget to add your IP address in **Network Access**).
- **MONG_URI_TEST** -> Connection address to a test database (You can use the same as the main app, but the data will be wiped during tests, **not recommended**).
- **SECRET_ACCESS_TOKEN** -> **Secret** token used to generate user access tokens.
- **CORS_ORIGIN** -> The origin address of your frontend application.

For a clear example, please refer to the **.env.example** file in the server directory.

## Frontend

🎨 For the frontend, it's even simpler. Navigate to the `client` directory and follow the procedure below:

Create a **.env** file containing the frontend environment variables.

Example below:

```env
VITE_API_URL=
```

- **VITE_API_URL** -> Connection address to your backend server

Example: `http://localhost:5000`. For a clear example, please refer to the **.env.example** file in the client directory.

## Run the Application

⚡ From the root of the application, run the following command to install all dependencies:

```shell
$ pnpm install
```

Then to start yout application, run the following command:

```shell
$ pnpm run dev
```

This command will start both the backend and frontend servers.
Go to your browser and navigate to `http://localhost:5173` to see the application in action.

## Unit Tests

🧪 First, Make sure your server is turned off, and run the following command:

```shell
$ pnpm run test
```

Unit tests should run one by one.  
If you want full coverage, run the following command:

```shell
$ pnpm run coverage
```

Your coverage report should be located in the `coverage` directory of the server.  
Don't forget to restart your backend after running tests.

## Features

🚀 **Features:**

- 📜 **Log Management**: Track app usage for better maintenance and analysis.
- 👥 **User CRUD**: Manage users with create, read, update, and delete operations.
- 🔒 **Secure Authentication with JWT**: Secure login and logout with JWT tokens to protect data.
- 🏢 **Role Management**: Differentiated access based on user roles (Admin, User).
- ✅ **Unit Testing**: Unit tests to ensure application stability.
- 📝 **Commented Backend**: All backend code is commented for better understanding and maintenance.
- 🔗 **Axios for API Requests**: Uses Axios for simplified and efficient HTTP requests.
- 📊 **Admin Dashboard**: Dedicated interface for user management and tracking application usage logs.
- 🔐 **Protected Routes**: Conditional access to specific pages based on user rights (Admin Dashboard, etc.).
- 🚧 **Conditional Routing**: Block certain routes based on login state.
- 🌙 **Theme Management**: Toggle between "light" and "dark" themes for a customized user experience.
- 🌍 **Internationalization with I18n**: Multi-language support with JSON translation files.
- 🎨 **Modern UI**: Uses **TailwindCSS** and **ShadCN** for a responsive and elegant design.
- 📋 **Auth Forms**: Preconfigured login and register form for quick integration
- 🔄 **Prettier Configuration**: Integrated code formatting with Prettier for consistent styling.
- 🖼 **Avatar Upload with GIF Support**: Users can upload profile pictures, including animated GIFs.
- 📡 **Real-Time Online Status**: See which users are online in real-time through WebSockets.

## Contribution

🤝 We encourage contributions from the community! If you wish to contribute, please follow these steps:

1. **Fork** the project.
2. Create a branch for your feature (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

### Contribution Guidelines

- Ensure your code is well-commented.
- Follow the project's naming and style conventions.
- Add unit tests for your changes.
