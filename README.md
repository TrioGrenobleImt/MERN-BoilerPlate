# MERN-APP BOILERPLATE README

Welcome to the MERN-APP boilerplate, a complete solution to quickly start a modern and secure full-stack application. This project is designed to help you create robust applications with secure authentication, role management, and much more.

## Table of Contents

- [Author](#author)
- [Technologies Used](#technologies-used)
- [Backend](#backend)
- [Frontend](#frontend)
- [Unit Tests](#unit-tests)
- [Features](#features)

## Author

- [Téo Villet](https://github.com/teovlt) - Web Developer

## Technologies Used

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## Backend

Navigate to the `server` directory.
You first need to create a **.env** file containing the backend environment variables.

Example below:

```env
PORT=
MONG_URI=
MONG_URI_TEST=
SECRET_ACCESS_TOKEN=
CORS_ORIGIN=
```

PORT -> The port your server will use.  
MONG_URI -> Connection address to a MongoDB database (Don't forget to add your IP address in **Network Access**).  
MONG_URI_TEST -> Connection address to a test database (You can use the same as the main app, but the data will be wiped during tests, **not recommended**).  
SECRET_ACCESS_TOKEN -> **Secret** token used to generate user access tokens.
CORS_ORIGIN -> The origin address of your frontend application.

Then, install the required **packages** to run your server:

```shell
$ pnpm i
```

Now start the server with the command below:

```shell
$ pnpm run dev
```

Once done, you should see a message in your console indicating that the server is running and connected to the database.

## Frontend

For the frontend, it's even simpler. Navigate to the `client` directory and follow the procedure below:

Create a **.env** file containing the frontend environment variables.

Example below:

```env
VITE_API_URL=
```

VITE_API_URL -> Connection address to your backend server

Example: `http://localhost:5000/api`

**(The `/api` is important to correctly route requests to the server)**

Install the required **packages** to run your client:

```shell
$ pnpm i
```

Now start the frontend with the following command:

```shell
$ pnpm run dev
```

Go to the URL displayed in your console.
And there you have it, a secure authentication application.

## Unit Tests

Navigate to the `server` directory, make sure your server is turned off, and run the following command:

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
- 📋 **Login Form**: Preconfigured login form for quick integration.
- 🔄 **Prettier Configuration**: Integrated code formatting with Prettier for consistent styling.
