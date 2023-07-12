# ![Logo](data:image/svg+xml;base64,PHN2ZyBzdHJva2U9ImN1cnJlbnRDb2xvciIgZmlsbD0iI2ZlYzM2ZiIgc3Ryb2tlLXdpZHRoPSIwIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgaGVpZ2h0PSIxZW0iIHdpZHRoPSIxZW0iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI2NC40IDk1LjAxYy0zNS42LS4wNi04MC4yIDExLjE5LTEyNC4yIDM0LjA5Qzk2LjI3IDE1MiA2MS40NSAxODIgNDEuMDEgMjExLjNjLTIwLjQ1IDI5LjItMjUuOTggNTYuNC0xNS45MiA3NS44IDEwLjA3IDE5LjMgMzUuNTMgMzAuNCA3MS4yMiAzMC40IDM1LjY5LjEgODAuMjktMTEuMiAxMjQuMTktMzQgNDQtMjIuOSA3OC44LTUzIDk5LjItODIuMiAyMC41LTI5LjIgMjUuOS01Ni40IDE1LjktNzUuOC0xMC4xLTE5LjMtMzUuNS0zMC40OS03MS4yLTMwLjQ5em05MS45IDcwLjI5Yy0zLjUgMTUuMy0xMS4xIDMxLTIxLjggNDYuMy0yMi42IDMyLjMtNTkuNSA2My44LTEwNS43IDg3LjgtNDYuMiAyNC4xLTkzLjEgMzYuMi0xMzIuNSAzNi4yLTE4LjYgMC0zNS44NC0yLjgtNTAuMzctOC43bDEwLjU5IDIwLjRjMTAuMDggMTkuNCAzNS40NyAzMC41IDcxLjE4IDMwLjUgMzUuNyAwIDgwLjMtMTEuMiAxMjQuMi0zNC4xIDQ0LTIyLjggNzguOC01Mi45IDk5LjItODIuMiAyMC40LTI5LjIgMjYtNTYuNCAxNS45LTc1Ljd6bTI4LjggMTYuOGMxMS4yIDI2LjcgMi4yIDU5LjItMTkuMiA4OS43LTE4LjkgMjcuMS00Ny44IDUzLjQtODMuNiA3NS40IDExLjEgMS4yIDIyLjcgMS44IDM0LjUgMS44IDQ5LjUgMCA5NC4zLTEwLjYgMTI1LjktMjcuMSAzMS43LTE2LjUgNDkuMS0zOC4xIDQ5LjEtNTkuOSAwLTIxLjgtMTcuNC00My40LTQ5LjEtNTkuOS0xNi4xLTguNC0zNS43LTE1LjMtNTcuNi0yMHptMTA2LjcgMTI0LjhjLTEwLjIgMTEuOS0yNC4yIDIyLjQtNDAuNyAzMS0zNSAxOC4yLTgyLjIgMjkuMS0xMzQuMyAyOS4xLTIxLjIgMC00MS42LTEuOC02MC43LTUuMi0yMy4yIDExLjctNDYuNSAyMC40LTY4LjkgMjYuMSAxLjIuNyAyLjQgMS4zIDMuNyAyIDMxLjYgMTYuNSA3Ni40IDI3LjEgMTI1LjkgMjcuMXM5NC4zLTEwLjYgMTI1LjktMjcuMWMzMS43LTE2LjUgNDkuMS0zOC4xIDQ5LjEtNTkuOXoiPjwvcGF0aD48L3N2Zz4=) Portmonetka

## Home Bookkeeping Web Application

This is a web application built using ASP.NET Core as the backend framework and Entity Framework Core as the ORM framework for database access. The application serves as a home bookkeeping tool that allows users to manage their finances by creating wallets, adding transactions, and viewing balance and statistics. The frontend is developed using React and TypeScript, providing a responsive and user-friendly interface for desktop and mobile devices.

### Features
1. **Wallet Management**

* Add and name wallets with specified currencies and starting balances.
* Edit wallet properties such as name, currency, and initial amount.
* View current balance and transaction history for each wallet.
* Sort, filter, and search transactions within a wallet.
* Remove transactions from a wallet.

2. **Transaction Management**

* Add multiple transactions at once, specifying descriptions, amounts, categories, and dates.
* Validate data on both the front-end and back-end to ensure accurate inputs.

3. **Balance Section**

* Display the total balance across all wallets, grouped by currency.
* Show statistics for each currency, including absolute income and outcome amounts.
* Present trends compared to the previous time period (feature in development).

### Tech Stack

* Backend:
    * ASP.NET Core - Backend framework for building web applications.
    * Entity Framework Core - Object-Relational Mapping (ORM) framework for interacting with the database.
    * C# - Primary programming language for the backend development.
  
* Frontend:
    * React - JavaScript library for building user interfaces.
    * TypeScript - Typed superset of JavaScript for enhanced development experience and code reliability.


### Code Details

The project follows good coding practices, adhering to SOLID principles.
* Encapsulate data operations and UI elements, each with its own specific responsibilities, to promote reusability and improved convenience.
* Handle data retrieval, posting, and deletion with error messages and status indicators to improve user experience during data transfers, displaying loading placeholders while fetching data.
* Utilize date and currency utilities for streamlined operations. These utilities aid in tasks such as calculating statistics and formatting data appropriately.

### Future Plans
The project has a roadmap for future enhancements and improvements:

1. Authentication: Implement user authentication to allow users to log in and securely access their data.

2. Microservices Architecture: Extract the frontend and backend parts into separate applications and adopt a microservices architecture. New features will be developed as separate services, communicating with each other through RabbitMQ. Each microservice will run in Docker containers for improved scalability and deployment.

3. Advanced Statistics: Create a dedicated microservice for calculating advanced statistics for wallets and currencies. These statistics will be presented to users with numerical data and infographics, offering valuable insights into their financial management.

4. Wallet and Category Management: Develop convenient tools for managing wallets and categories, allowing users to easily add, edit, and remove entities as needed.

5. UI/UX Enhancements: Continuously improve the user interface design to provide a visually appealing and intuitive user experience across different devices and screen sizes.

### Getting Started

To get started with the application, please follow the instructions below:

1. Clone the repository: `git clone https://github.com/khivuksergey/Portmonetka`
2. Install the required dependencies for the frontend and backend applications.
3. Set up the database using Entity Framework Core migrations.
4. Run the backend server.
5. Start the frontend development server.
6. Access the application in your web browser.

### Contributions

Contributions to the project are welcome! If you encounter any issues or have ideas for new features, please open an issue on the project's GitHub repository. Additionally, you can submit pull requests with proposed changes, bug fixes, or enhancements.

### License
The project is licensed under the MIT License. You are free to use, modify, and distribute the code for personal or commercial purposes. Refer to the license file for more information.

### Contact
For any inquiries or questions about the project, please feel free to contact me at khivuksergey@gmail.com.
