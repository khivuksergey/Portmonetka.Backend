# ![Logo](https://svgshare.com/i/vCb.svg) Portmonetka

The backend of this project is powered by ASP.NET Core and Entity Framework Core, providing a robust and efficient foundation for data management and business logic. It is designed to support the client app's functionality and ensure secure data handling.

### Features

**ASP.NET Core**: The backend is built using ASP.NET Core, a versatile framework that enables the development of high-performance web applications.

**Entity Framework Core**: Entity Framework Core is used for database access, allowing for seamless data operations. Repositories are employed to encapsulate data interactions for maintainability and modularity.

**Microservices Architecture**: The project has adopted a microservices architecture, enhancing scalability and separation of concerns. Docker containers will be used for deployment and isolation.

**API Gateway**: An API Gateway is established to centralize request routing, providing a single entry point for client app interactions. This simplifies communication and enables load balancing.

**JWT Token Authentication**: Security is ensured through JWT token-based authentication, controlling access to endpoints and protecting sensitive user data.

### Future Plans
The project has a roadmap for future enhancements and improvements:

- [x] Authentication: Implement user authentication to allow users to log in and securely access their data.

- [x] Microservices Architecture: Extract the frontend and backend parts into separate applications and adopt a microservices architecture. New features will be developed as separate services.

3. Microservices communication through RabbitMQ. Each microservice will run in Docker containers for improved scalability and deployment.

4. Advanced Statistics: Create a dedicated microservice for calculating advanced statistics for wallets and currencies. These statistics will be presented to users with numerical data and infographics, offering valuable insights into their financial management.

5. Wallet and Category Management: Develop convenient tools for managing wallets and categories, allowing users to easily add, edit, and remove entities as needed.
