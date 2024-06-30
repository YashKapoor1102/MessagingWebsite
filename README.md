# Instant Messaging Website

## Introduction
Welcome to our instant messaging website, a dynamic platform designed to facilitate
real-time communication across the internet. 

## Demo 
See our instant messaging website in action. Watch this quick demo:
https://drive.google.com/file/d/1V6eaOUXjuAsTEJaRKxQ37y0lwn40D8kg/view?usp=drive_link

## Description
This instant messaging website facilitates real-time communication, allowing users to interact seamlessly. 

Key features of this application include:

1. **Profile Setup:** Users can quickly set up their profiles to start messaging.
2. **Messaging Capabilities:** Exchange text, emojis, and media files in a user-friendly environment.
3. **Conversation Options:** Engage in private one-on-one conversations or create group chats.
4. **Group Management:** Easily add new members to existing group chats.
5. **Message Scheduling:** An innovative feature of our application is that users can schedule messages to be sent at a later time. 

## Installation
1. Ensure you have Node.js installed on your machine. You can download it from https://nodejs.org/.
2. Install MySQL on your machine following the installation guide at https://www.mysql.com/.

## Usage
**Step 1:**  Clone the repository by typing the following command in your terminal:

```
https://github.com/YashKapoor1102/InstantMessagingWebsite.git
cd InstantMessagingWebsite
```

**Step 2:** Navigate to the project repository and install the necessary Node.js packages
in the client and server folders.

Type the following commands in the terminal sequentially:

```
cd client
npm install
```

```
cd ../server
npm install
```

**Step 3:** Ensure that MySQL is installed and running on your machine. 
Then, import the database schema into your local MySQL server by executing the following command:

`mysql -u username -p database-name < database/InstantMessagingWebsiteSchema.sql`

Replace "username" with your MySQL username and "database-name" with the name of the database you are using for this project. 
Make sure you replace "database-name" with the actual name of the database you created for this application.

If you have not created a database yet, you can do so using the following command:

`mysql -u username -p -e "CREATE DATABASE database-name"`

**Step 4:** Create a ".env" file by navigating to the server directory and add the following:

```
PORT=5000

DB_HOST="localhost"
DB_USER=yourUsername
DB_PASSWORD=yourPassword
DB_NAME=yourDatabaseName

CLIENT_URL="http://localhost:3000"

MAIL_ADDRESS = "your-email@example.com"
MAIL_PASSWORD = "your-email-password"
```

**Step 5:** Create a ".env" file by navigating to the client directory and add the following:

```
REACT_APP_PARLONS_URL="http://localhost:5000/api"
REACT_APP_PARLONS_PROFILE_URL="http://localhost:5000"
```

**Step 6:** Navigate to the server directory and start the Node.js server by running:

```
cd server
npm start
```

This will start the backend server. Keep this terminal window open to continue running the server.

Next, open a new terminal window or tab. Navigate to the client directory and start the React application:

```
cd client 
npm start
```

This will launch the React application that is typically accessible at http://localhost:3000. 
Keep this terminal window open to continue running the client.

## Full Report
For a comprehensive understanding of the development and functionalities of our instant messaging website, access the full capstone project report. This document includes detailed discussions of the planning process, design decisions, technologies used, challenges faced, and solutions implemented during the development process. 

You can view the report using the following link:  
https://drive.google.com/file/d/1iC-d2Z7P4U_WXVh4qFWcEahzYZ5pB01l/view?usp=drive_link

## Credits
- Yash Kapoor: Conversation window, list of chats interface and associated back-end functionality, one-on-one and group chats functionality, multimedia support, and scheduled messages.
- Yaw Asamoah: Registration, back-end contacts page, email verification, and forget password functionality.
- Ibrahim Saidhi: Notifications, Emoji support, and Profile Customization page.
- Tao Lufula: Front-end contacts, homepage design, login, and logout functionality.

**Author of this README file:** Yash Kapoor   
**Email:** yashkapooruni@gmail.com
