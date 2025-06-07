`  `**HACKSTAB** 

TEAM – 6
# <a name="_ljxfta6lf1hk"></a>**SENIOR DEVELOPERS**
**SATYA BALAJI - [TEAM LEAD .]**

REKHA BENAYARAM - [FIGMA  & DEPLOYMENT]

CHANDINI - [DOCUMENTATION & FRONT END]

DHANUNJAI RAM - [BACKEND AND ARCHITECTURE]

PATNALA SRI KRISHNA SAI - [FULLY FRONT END ]
# <a name="_rtxgcpb1qktd"></a>**JUNIOR DEVELOPERS**
SHAIK.RAHAMATH - [DOCUMENTATION & DEPLOYMENT ]

AMBATI PADMASRI - [FIGMA & DOCUMENTATION]

VAISHNAVI PRABALA - [COLOURS & ARCHITECTURE & BACKEND]

M.RUSHIKA SRITHA - [DOCUMENTATION & FRONT END]




** 

<a name="_b4bncti74q11"></a>**Introduction:**
## <a name="_uad8yen8p0xn"></a>**Project Overview**
- ` `This document provides a comprehensive overview of the Hackathon Website project, including its scope, requirements, design, implementation, and usage. The website facilitates registration, team creation, project submissions, and other functionalities essential for organising and participating in hackathons.

**Scope**

- The scope includes developing a fully functional hackathon website with features for user registration, team creation, project submissions, event scheduling, and coding contests.

**Audience**

- The primary audience includes hackathon organisers, participants, and judges. The website aims to provide a user-friendly interface for managing and participating in hackathons.

**Requirements**

**1)**    **Functional Requirements**

1\.    User Registration and Login

2\.    Team Creation and Management

3\.    Project Submission and Review

4\.    Event Scheduling

5\.    Coding Quiz Contests

6\.    In-built Compiler

**2)**    **Non-Functional Requirements**

1\.    Responsive Design

2\.    High Availability

3\.    Security and Privacy

4\.    Scalability

5\.    Performance Optimization

**3)**    **Technical Requirements**

1\.    **Frontend:** HTML, CSS, JavaScript, React

2\.    **Backend:** FASTAPI

3\.    **Database:** MongoDB

4\.    **Authentication:** JWT

5\.    **Version control:** GitHub
## <a name="_v37nqi342gxk"></a>**System Architecture**
### <a name="_dp2kqckky876"></a>**Overview**
The system architecture includes a frontend for user interaction, a backend for data processing, and a database for persistent storage.






**FlowChart**

![](Aspose.Words.797f05e8-7d8a-41c0-b7cf-c04fe094b0d4.001.png)






**Diagram**

![](Aspose.Words.797f05e8-7d8a-41c0-b7cf-c04fe094b0d4.002.png)

**Components**

**Frontend (Client Side):**

·        **React (or similar):** Handles the user interface, routing, and client-side logic. Manages state using tools like Redux and ensures a responsive design.

·        **API Communication:** Uses Axios or Fetch API to make HTTP requests to the backend.

**Backend (Server Side):**

·        **FastAPI :** Processes incoming requests, handles routing, authentication .

·        **JWT Authentication:** Manages user sessions and ensures secure access to resources.

·        **RESTful API:** Provides endpoints for user registration, login, hackathon listings, project submissions, and more.

**Database Layer:**

·        **MongoDB:** Stores user data, hackathon details, team information, and submissions. NoSQL database is chosen for its flexibility and scalability.

**Design and Implementation**

**1. Design**

·        **Frontend Framework (React):**

o   **Choice:** React was chosen for its component-based architecture, which allows for reusable UI components, making the development process more efficient and maintainable.


o   **Reasons:**

§  **Performance:** React’s virtual DOM ensures efficient updates and rendering, leading to a smooth user experience.

§  **Community Support:** A large and active community, extensive documentation, and a wide range of third-party libraries make it easier to find solutions and extend functionality.

§  **State Management:** Redux or Context API can be integrated for managing global state effectively, which is essential in a dynamic application like a hackathon website.

·        **Backend Framework (FastAPI):**

o   **Choice:** FastAPI was selected for its speed and ability to handle asynchronous operations, which is crucial for a responsive and scalable application.

o   **Reasons:**

§  **Performance:** FastAPI is one of the fastest web frameworks for Python, making it suitable for handling high loads, especially during peak times (e.g., submission deadlines).

§  **Ease of Use:** Built-in data validation, automatic generation of interactive API documentation (Swagger), and support for Python type hints make development faster and less error-prone.

§  **Security:** FastAPI’s integration with OAuth2 and JWT makes it easy to implement secure authentication.

·        **Database (MongoDB):**

o   **Choice:** MongoDB was chosen for its flexibility in handling unstructured and semi-structured data, which is common in hackathon projects where submissions can vary greatly in structure.

o   **Reasons:**

§  **Scalability:** MongoDB’s ability to scale horizontally across multiple servers makes it ideal for handling large volumes of data, which is expected during hackathon events.

§  **Flexibility:** The schema-less nature of MongoDB allows for easy modifications to the data model as the project evolves.

§  **Integration:** MongoDB’s integration with FastAPI is straightforward, making it easier to manage data operations.

**2. Code Structure**

`  `**Frontend:**

o   **/src**

§  **/Components:** Contains reusable UI components (e.g., Navbar, Footer, Form).

§  **/Pages:** Each page of the application (e.g., Home, Hackathon List, Team Formation).

§  **/Services:** API service files for making HTTP requests to the backend.

§  **/Redux (or /context):** State management files (e.g., actions, reducers, store).

§  **/Assets:** Static files like images, fonts, and styles.

§  **index.js:** Entry point of the React application.

§  **App.js:** Main application component that includes routing and layout.

·        **Backend:**

o   **/App**

§  **/main.py:** Entry point of the FastAPI application.

§  **/Routes:** Contains route definitions (e.g., auth\_routes.py, hackathon\_routes.py).

§  **/Models:** Database models (e.g., User, Hackathon, Submission).

§  **/Schemas:** Pedantic models for request and response validation.

§  **/Services:** Business logic and service layer (e.g., user\_service.py, hackathon\_service.py).

§  **/Auth:** Authentication and authorization logic (e.g., JWT handling, OAuth2).

§  **/Config:** Configuration settings (e.g., environment variables, database settings).

§  **/Tests:** Unit and integration tests.

§  **/Utils:** Utility functions and helpers (e.g., email\_utils.py, logger.py).

**3. Key Algorithms**

·        **User Authentication (JWT):**

o   **Algorithm:** JSON Web Tokens (JWT) are used for user authentication. When a user logs in, a JWT is generated and sent to the client. This token is then used for subsequent requests to authenticate the user.

o   **Reason:** JWT is stateless, meaning the server does not need to store sessions, which improves scalability and performance. It also provides a secure way to handle authentication across distributed systems.

·        **Project Scoring Algorithm:**

o   **Algorithm:** A weighted scoring system is used to evaluate hackathon submissions. Each criterion (e.g., innovation, functionality, presentation) is assigned a weight, and judges score submissions based on these criteria. The final score is calculated using a weighted average.

o   **Reason:** This algorithm ensures a fair and balanced evaluation by considering the importance of each criterion, allowing for objective comparison of submissions.

·        **Team Matching Algorithm:**

o   **Algorithm:** A preference-based matching algorithm is used to form teams. Participants can specify their skills and preferences (e.g., project theme, role), and the algorithm matches individuals based on these preferences.

o   **Reason:** This approach increases the likelihood of creating well-balanced teams with complementary skills, leading to better collaboration and project outcomes.

**4. Database Design**

·        **Users Collection:**

o   **Fields:**

§  name

§  email

§  phone

§ college name

§  password hash

§  registered hackathons (Array of Hackathon IDs)

o   **Relationships:**

§  Each user can participate in multiple hackathons (One-to-Many relationship).

·        **Hackathons Collection:**

o   **Fields:**

§  hackathon 

§  title

§  description

§  start date

§  end date

§  teams (Array of Team IDs)

§  submissions (Array of Submission IDs)

o   **Relationships:**

§  Each hackathon can have multiple teams and submissions (One-to-Many relationship).

·        **Teams Collection:**

o   **Fields**

§  team\_id (Primary Key)

§  team name

§  members (Array of User IDs)

§  hackathon\_id (Foreign Key)

o   **Relationships:**

§  Each team is associated with a specific hackathon and can have multiple members (Many-to-Many relationship).

·        **Submissions Collection:**

o   **Fields:**

§  submission\_id 

§  project title

§  description

§  team\_id 

§  hackathon\_id 

§  file\_url

§  scores

o   **Relationships:**

§  Each submission is associated with a specific team and hackathon (Many-to-One relationship with both Team and Hackathon).

**Installation and Setup for a Hackathon Website**

**1. Prerequisites**

Before you begin the installation, ensure you have the following software and tools installed on your system:

·        **Operating System:**

o   Linux or macOS or Windows 

·        **Software:**

o   **Python 3.8+**: Required for running the FastAPI backend.

o   **Node.js 14+ and npm**: Required for running the React frontend.

o   **MongoDB**: For storing the database.

o   **Git**: Version control system for cloning the project repository.

·        **Tools:**

o   **VS Code or any IDE/Text Editor**: For editing the code.

o   **Postman**: For testing API endpoints.

o   **Terminal/Command Line**: For running commands.

**2. Step-by-Step Guide**

Follow these steps to set up the project environment:

**1. Clone the Repository**

<https://github.com/RCTS-K-Hub/2024YearlyProject-Team6>

cd hackathon-website

**2. Backend Setup (FastAPI)**

·        **Navigate to the backend directory:** cd backend

·        **Create a virtual environment:** python3 -m venv venv

source venv/bin/activate  # On Windows use `venv\Scripts\activate`

·        **Install the required dependencies:** pip install -r requirements.txt

·        **Run the FastAPI server:** uvicorn app.main:app --reload

` `The server should now be running at http://localhost:8000.

**3. Frontend Setup (React)**

·        **Navigate to the frontend directory:** cd ../frontend

·        **Install the required dependencies:** npm install

·        **Start the React development server:** npm start

The frontend should now be running at http://localhost:3000.

**4. Database Setup (MongoDB)**

·        **Ensure MongoDB is installed and running.**

o   On Linux or macOS, you can start MongoDB with: sudo service mongodb start

o   On Windows, use the MongoDB Compass application or start the MongoDB server from the command line.

·        **Create the necessary databases and collections:**

o   Access the MongoDB shell: mongo

o   Create a database for the hackathon: use hackathonDB

o   The collections (users, hackathons, teams, submissions) will be automatically created when the application runs and data is inserted.

**5. Test the Setup**

·        **Backend:** Visit http://localhost:8000/docs to see the automatically generated API documentation (Swagger UI).

·        **Frontend:** Visit http://localhost:3000 to see the website in action.

·        **Database:** Use MongoDB Compass or a similar tool to verify that the database and collections are set up correctly.

**3. Configuration**

There are several configuration files and settings that need to be adjusted before running the application in different environments:

**1. Backend Configuration (config.py or .env):**

·        **Database Connection:**

o   Modify the database connection string in config.py or in an environment variable: MONGODB\_URI = "mongodb://localhost:27017/hackathonDB"

·        **JWT Secret Key:**

o   Set the JWT secret key for token generation: SECRET\_KEY = "your-secret-key"

·        **Environment Variables (Optional):**

o   You can set environment-specific variables (e.g., production, development) using a .env file: DATABASE\_URL=mongodb://localhost:27017/hackathonDB 

`     `SECRET\_KEY=your-secret-key

**2. Frontend Configuration (.env):**

·        **API Base URL:**

o   Configure the base URL for API calls in a .env file in the frontend directory: REACT\_APP\_API\_URL=http://localhost:8000

·        **Environment-specific settings:**

o   You can also add other environment-specific variables such as REACT\_APP\_ENV=development or production.

**Usage Guide for a Hackathon Website**

**1. How to Run the Project**

**1.1. Local Development**

1\.      **Start the Backend Server:**

o   Open a terminal and navigate to the backend directory: **cd backend**

o   Activate the virtual environment: **source venv/bin/activate**  # On Windows use  `venv\Scripts\activate`

o   Start the FastAPI server: **uvicorn app.main: app --reload**

` `o   The backend server will be running at **http://localhost:8000.**

2\.      **Start the Frontend Server:**

o   Open a new terminal and navigate to the frontend directory: **cd ../frontend**

o   Install dependencies (if not done already): **npm install**

o   Start the React development server: **npm start**

o   The frontend will be running at **http://localhost:3000.**

3\.      **Ensure MongoDB is Running:**

o   Start the MongoDB server: sudo service mongodb start  # On Linux

4\.      **Verify the Setup:**

o   Open your browser and visit http://localhost:3000 to access the website.

**1.2. Production Deployment (Docker)**

1\.      **Build and Start Containers:**

o   Navigate to the root directory where docker-compose.yml is located.

o   Run the following command to build and start the containers: docker-compose up --build

o   The application will be available at http://localhost:3000.

2\.      **Access Docker Containers:**

o   For managing containers and inspecting logs, use Docker commands or Docker Compose: docker-compose logs -f  # Follow logs for all containers docker-compose ps       # List running containers


**2. User Interface Guide**

**2.1. Homepage**

·        **Navigation Bar:**

o   Includes links to different sections such as Home, Hackathons, My Profile, and Login/Register.

·        **Hackathon Listings:**

o   Displays a list of upcoming and ongoing hackathons.

o   Users can click on a hackathon to view more details.

**2.2. Hackathon Details Page**

·        **Overview:**

o   Provides detailed information about the hackathon, including dates, themes, rules, and prizes.

·        **Register/Join Button:**

o   Allows users to register or join an existing team for the hackathon.

**2.3. Team Formation Page**

·        **Create or Join Team:**

o   Users can create a new team or join an existing one.

o   Team creation involves specifying the team name and inviting members.

o   Joining a team involves searching for existing teams and requesting to join.

**2.4. Project Submission Page**

·        **Submit Project:**

o   Users can submit their project by uploading files, entering a description, and providing links to documentation or presentations.

·        **Submission Status:**

o   Users can view the status of their submissions and any feedback from judges.

**2.5. Profile Page**

·        **User Information:**

o   Displays user profile details, including their registered hackathons, teams, and past submissions.

·        **Edit Profile:**

o   Users can update their profile information and change their password.

**2.6. Admin Panel**

·        **Manage Hackathons:**

o   Admins can create, update, or delete hackathon events.

·        **User Management:**

o   Admins can view and manage user accounts and roles.

·        **Submission Review:**

o   Admins can review and score project submissions.

**3. Examples**

**Example 1: Registering for a Hackathon**

1\.      **Navigate to Hackathon Listings:**

o   Click on “Hackathons” in the navigation bar to view the list of hackathons.

2\.      **Select a Hackathon:**

o   Click on a hackathon to view details.

3\.      **Register or Join a Team:**

o   Click on the “Register” button or “Join a Team” button if you are already part of a team.

o   Follow the prompts to complete the registration.

**Example 2: Submitting a Project**

1\.      **Go to the Submission Page:**

o   Click on “My Submissions” or navigate through the hackathon details page.

2\.      **Upload Files and Enter Details:**

o   Fill out the submission form with project details, upload relevant files, and provide a link to additional documentation.

3\.      **Submit and Review Status:**

o   Click “Submit” to finalise your entry. Check the status of your submission on the profile page or submissions list.

**Example 3: Creating a New Team**

1\.      **Navigate to Team Formation Page:**

o   Click on “Teams” or navigate to the team formation section from the hackathon details page.

2\.      **Create a Team:**

o   Enter a team name and invite members by entering their email addresses.

3\.      **Confirm and Manage Team:**

o   Once the team is created, manage team members and update settings as needed.

This guide provides instructions on how to use the hackathon website effectively, from running the project locally to navigating the user interface and using key features.
### <a name="_ede4wlp2jh1"></a>**Simple Testing for a Hackathon Website**
#### <a name="_w4vp21dv7xhl"></a>**1. Test Plan**
**1.1. Overview**

Testing will focus on ensuring that the basic features of the hackathon website work correctly. This includes verifying that users can perform key actions like registering, logging in, and submitting projects. The goal is to catch major issues before deploying the site.

**1.2. Types of Tests**

- **Unit Tests:** Test individual functions or components.
- **Manual Testing:** Test the overall functionality through the user interface.
#### <a name="_anb5a3ieye3t"></a>**2. Test Cases**
**2.1. Backend Test Cases**

- **Test Case 1: User Registration**
  - **Description:** Ensure users can register successfully.
  - **Steps:**
    - Send a POST request to /api/register with valid user details (name, email, password).
  - **Expected Result:**
    - Response status code is 201 Created.
    - Users are saved in the database.
    - Response contains user details without sensitive information (e.g., password).
- **Test Case 2: User Login**
  - **Description:** Verify that users can log in with correct credentials.
  - **Steps:**
    - Send a POST request to /api/login with valid email and password.
  - **Expected Result:**
    - Response status code is 200 OK.
    - Response contains a JWT token.
- **Test Case 3: Project Submission**
  - **Description:** Check if users can submit a project.
  - **Steps:**
    - Send a POST request to /api/submit with project details and file upload.
  - **Expected Result:**
    - Response status code is 201 Created.
    - Project is saved and retrievable from the database.

**2.2. Frontend Test Cases**

- **Test Case 1: Navigation Links**
  - **Description:** Verify that navigation links work.
  - **Steps:**
    - Click on various navigation links (e.g., Home, Hackathons, Login).
  - **Expected Result:**
    - Each link takes the user to the correct page.
- **Test Case 2: Form Validation**
  - **Description:** Ensure form validation works on registration.
  - **Steps:**
    - Submit the registration form with invalid data (e.g., missing email).
  - **Expected Result:**
    - Error messages are shown for invalid fields.
- **Test Case 3: Submit Project Form**
  - **Description:** Test the project submission form.
  - **Steps:**
    - Fill out the submission form with valid details and upload a file.
    - Submit the form.
  - **Expected Result:**
    - Confirmation of successful submission.
    - Project details are visible in the submissions list.
#### <a name="_fs665y5qh3cq"></a>**3. Bug Reporting**
**3.1. Reporting Bugs**

- **Platform:** Use GitHub Issues or a similar tool.
- **Details to Include:**
  - **Title:** Brief summary of the issue.
  - **Description:** Steps to reproduce the issue, what was expected, and what actually happened.
  - **Screenshots/Logs:** Attach screenshots or logs if relevant.
  - **Environment:** Specify where the bug was found (e.g., browser, version).

**3.2. Tracking Bugs**

- **Status Updates:** Regularly update the status of reported bugs.
- **Verification:** After a bug is fixed, retest the related functionality to ensure the issue is resolved.

This simple testing approach helps ensure that core features of the hackathon website function correctly and that users have a smooth experience.
### <a name="_n5ad399fo328"></a>**Maintenance for a Hackathon Website**
#### <a name="_qgaunw77rvpi"></a>**1. Troubleshooting**
**1.1. Common Issues and Resolutions**

- **Issue 1: Backend Server Not Starting**
  - **Possible Cause:** Missing dependencies or configuration issues.
  - **Resolution:**
    - **Check Dependencies:** Ensure all required packages are installed. Run pip install -r requirements.txt in the backend directory.
    - **Check Configuration:** Verify that environment variables and configuration files are correctly set up (e.g., database connection strings).
- **Issue 2: Frontend Not Displaying Correctly**
  - **Possible Cause:** Build issues or missing dependencies.
  - **Resolution:**
    - **Check Console Errors:** Open the browser’s developer tools and check the console for errors.
    - **Rebuild Frontend:** Run npm install to ensure all dependencies are up to date, then npm start to rebuild the project.
- **Issue 3: Database Connection Errors**
  - **Possible Cause:** MongoDB server is not running or connection string is incorrect.
  - **Resolution:**
    - **Check MongoDB Status:** Ensure MongoDB is running. Use sudo service mongodb status (Linux) or check MongoDB Compass.
    - **Verify Connection String:** Check the database connection string in your configuration files.
- **Issue 4: Authentication Failures**
  - **Possible Cause:** Incorrect JWT secret key or expired tokens.
  - **Resolution:**
    - **Check Secret Key:** Ensure the JWT secret key is correctly set in the backend configuration.
    - **Refresh Tokens:** Ensure that token expiration is handled properly and users can obtain new tokens.
#### <a name="_mxlkgi5kht7e"></a>**2. Updating**
**2.1. Instructions for Updating the Project**

- **Update Dependencies:**
  - **Backend:**
    - Update requirements.txt with new dependencies or versions.
    - Run pip install -r requirements.txt to install updates.
  - **Frontend:**
    - Update package.json with new dependencies or versions.
    - Run npm install to update packages.
- **Update Codebase:**
  - **Backend:**
    - Make code changes in the backend directory.
    - Test updates locally and ensure all unit tests pass.
  - **Frontend:**
    - Make code changes in the frontend directory.
    - Test the UI and functionality locally.
- **Deploy Changes:**
  - **Local Deployment:** Run the updated backend and frontend servers locally to test changes.
  - **Production Deployment:**
    - Build the frontend with npm run build.
    - Deploy the backend and frontend to the production server or use Docker for containerized deployment.
- **Add New Features:**
  - **Define Requirements:** Clearly specify the new feature requirements and how they fit into the existing system.
  - **Develop and Test:** Implement the feature and thoroughly test it through unit, integration, and end-to-end tests.
  - **Update Documentation:** Revise project documentation to include information about the new feature.
### <a name="_p17vqzrdddt0"></a>**Glossary for a Hackathon Website**
#### <a name="_j3mdcof7jvqg"></a>**Terms and Abbreviations**
- **API (Application Programming Interface):** A set of rules and protocols that allows different software applications to communicate with each other. it refers to the endpoints that the frontend and backend use to interact.
- **Backend:** The server-side part of the website responsible for processing requests, managing the database, performing application logic.
- **Frontend:** The client-side part of the website that users interact with directly. It includes everything that users see and interact with on their web browsers.
- **JWT (JSON Web Token):** A compact, URL-safe token used for securely transmitting information between parties. It is often used for authentication purposes.
- **MongoDB:** A NoSQL database used for storing data in a flexible, JSON-like format. It is used as the database system for this hackathon website.
- **React:** A JavaScript library used for building user interfaces, particularly single-page applications, by creating reusable UI components.
- **REST (Representational State Transfer):** An architectural style for designing networked applications. RESTful APIs use HTTP requests to perform CRUD operations (Create, Read, Update, Delete) on resources.
- **UAT (User Acceptance Testing):** The phase of testing where the end-users test the application to ensure it meets their needs and requirements before it goes live.
- **Unit Test:** A type of testing that focuses on individual components or functions in isolation to ensure they work as expected.
- **Integration Test:** A type of testing that evaluates how different components of the application work together.
- **End-to-End Test:** A comprehensive testing approach that simulates real user scenarios to ensure that the entire application functions as intended.
- **Docker:** A platform that uses containerization to package applications and their dependencies into a standardised unit for software development and deployment.
- **Container:** A lightweight, standalone, and executable package that includes everything needed to run a piece of software, including code, runtime, system tools, libraries, and settings.
- **Version Control:** A system (e.g., Git) that records changes to files or code over time, allowing you to revert to previous versions and track changes.
- **Deployment:** The process of making an application available for use, typically by transferring it to a server or cloud environment.
### <a name="_mhtjh2vqp74q"></a>**Project Overview: Hackathon Website**
#### <a name="_8u37h5w5kgqo"></a>**1. Project Name**
***HackStab*:** A Platform for Managing and Participating in Hackathons
#### <a name="_qkbmvbj09x75"></a>**2. Project Description**
HackHub is a web-based platform designed to streamline the organisation and participation process for hackathons. It allows organisers to create and manage hackathon events, while participants can register, form teams, submit projects, and view results. The platform is built to support both in-person and virtual hackathons, offering features like project submissions, judging, and real-time leaderboards.
#### <a name="_rv60bitkz95i"></a>**3. Key Features**
- **Hackathon Management:** Organisers can create and manage hackathon events, including setting up challenges, judging criteria, and schedules.
- **User Registration:** Participants can create accounts, join hackathons, and form teams with other participants.
- **Project Submission:** Teams can submit their projects through the platform, including uploading files and providing descriptions.
- **Judging and Scoring:** Judges can review projects and assign scores based on predefined criteria.
- **Real-Time Leaderboard:** Displays the current rankings of teams based on their project scores, updated in real-time.
- **Notifications:** Participants receive updates and reminders about important deadlines, announcements, and results.
- **Admin Dashboard:** Provides organisers with insights and control over the entire hackathon, including participant management, project submissions, and scoring.
#### <a name="_7yvgxvcuq2nk"></a>**4. Target Audience**
- **Hackathon Organisers:** Educational institutions,and community groups that host hackathons.
- **Participants:** Students, professionals, and hobbyists interested in competing in hackathons to showcase their skills and collaborate on innovative projects.
- **Judges:** Industry experts, mentors, and educators who assess and score the projects submitted by participants.
#### <a name="_dvfmrqz9tgj4"></a>**5. Technologies Used**
- **Frontend:** React.js for building a dynamic and responsive user interface.
- **Backend:** FastAPI for handling API requests, user authentication, and business logic.
- **Database:** MongoDB for storing user data, hackathon details, project submissions, and scores.
- **Authentication:** JWT (JSON Web Token) for secure user authentication and session management.
- **Deployment:** Docker for containerizing the application, enabling easy deployment and scalability.
#### <a name="_7ihch0cjc1sx"></a>**6. Goals and Objectives**
- **Streamline Hackathon Management:** Provide a user-friendly platform that simplifies the organisation of hackathons, reducing administrative overhead.
- **Enhance Participant Experience:** Create an intuitive and engaging interface for participants to easily navigate the hackathon process, from registration to project submission.
- **Facilitate Fair Judging:** Implement a robust judging system that ensures projects are evaluated fairly and consistently based on predefined criteria.
- **Encourage Collaboration:** Promote teamwork by allowing participants to form and manage teams within the platform.
#### <a name="_naiarewn9sbc"></a>**7. Project Status**
The hackathon website is currently under development, with the core features being actively implemented. 


