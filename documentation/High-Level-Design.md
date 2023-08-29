# PROJECT'S HIGH LEVEL DESIGN

## security
- This Application uses login authentication system through **email & password**
and **OAuth by Next-Auth (Google, GitHub, and Facebook)**.
- We'll provide a email verification.
- We'll allow users to rest their passwords in case they forgot them.
- Only Logged-in users can use the app features through Routes Protection.
- The Application's API is only used by the Application frontend.
- Possibly the Route Handlers will be protected.

## Hardware
- This Application should run on all devisees that supports browsers.
- Next versions it will run on Android & IOS.

## Software
1. ### **General** : 
    - ***Typescript***
    - ***Eslint***
    - ***jose or JWT***
    - ***Lottie*** 
    - ***Lottie*** 



2. ### **Backend will use** : 
    - ***Next.js 13 Route Handlers*** for all API interaction except  Messaging & Calling.
    - ***Express.js & Socket.io*** for Messaging & Calling.
    - ***Mongoose & MongoDb*** for the database.
    - ***Firebase*** for storing images & audio.
    - ***Peerjs*** for running the peers server.
    - ***Nodemailer*** for sending emails.


3. ### **Frontend will use** :
     - ****Next.js 13** for the entire application.
     - ***Peer.js*** for keeping track of peers & enabling webRTC.
     - ***Next-Auth*** for Authentication.
     - ***Zod & react-hook-form*** for form validation.
     - ***SCSS*** for styling.
     - ***Redux*** for state management.
     - ***Socket.io-client*** for sockets.

## User Interface Structure
1. This Application consists of **4** pages.
   1. **Lading page** for Introducing the application.
   2. **Register page** to login & signup new users to the application.
   3. **Main dashboard** page for interacting with the application's features.
   4. **Profile page** for customizing the application & users details.
1. Check the [Low-Level-Design](Low-Level-Design.md) for the map & design & deeper details.

## File (code) Structure
1. This Application uses the **MVC** Design pattern.
1. The **client** folder for the frontend related code.
1. The **server** folder for the backend related code. 
1. The **Documentation** folder for the project's docs.
1. This is a [diagram](./assets/kerm%20AI%202.jpg) of the File Structure in depth.  

## DataBase
1. This application uses **MongoDB Atlas** free-ter for data storing and **Firebase** for images & audio storing.
2. This application uses one collection only.
3. Only **Super developers** have access to the database.
4. Users sensitive information is hashed using **Bcrypt Algorithms**.
5. Doesn't support **Audit Trail** and **Maintenance**.
6. Check the [Low-Level-Design](Low-Level-Design.md) for the document design.

## Configuration data
This application doesn't use configuration screens, or allow users to configure data.

**[Back to README.md](../README.md)**