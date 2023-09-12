# PROJECT'S LOW LEVEL DESIGN

## Security
1. The Login & signup forms is validated on the frontend using *zod* and in the backend using *mongoose*
2. ### The process of signing up
    1. The user enters their full information, and sends them to the backend to evaluate if they are valid. if valid continue:
    2. The system sends the user a verification email to check if it's their email or not. if checked continue:
    3. When the user clicks the verify button in their email, we'll direct them to the api end point *signup-GET* with the user's information attached as search params as well as a jwt to maintain the safety of the process.
    4. Then in this route the user's information is saved to the database except the image(because I can't send it in the url or the jwt payload step2) then redirect them to the *status* page to show them wither their email is verified or not.
    5. The user clicks the verified button to check that his/her data is saved & Patch the image to firebase, and finally authenticate them.
3. ### The process of resetting the password
   1. The user enters the email that he/she signed up with previously, and send it to the backend.
   2. We check on the backend if the email does exist in the database, if so send them an email.
   3. the email contains a 2 minute expired jwt with the user's email as the payload. so when the user clicks the reset button in their email
   we redirect to a server component with the token as a search params.
   4. In the server component we check the validation of the jwt, and get the email from the payload, and then we allow th user to reset his/her password
   5. When the user fills the new password info, we send a PUT request to update their password.
4. 

## FrontEnd
1. This application has **three** main pages;
    1. Landing page
    1. Signup Login pages
    1. MainDashboard

## Backend

## User Interface Structure
1. This is an overall image of the [user interface design](./assets//user-interface.png).
2. This is the link to the [figma file](https://www.figma.com/file/ApodrSdWEShpHn36QqRmDV/Chat-Call-app?type=design&mode=design&t=3ujTHEChPxCtH6T4-0)

## File Structure
1. This is a [diagram](./assets//user-interface.png) of the File Structure in depth.  

## DataBase
1. This project uses the **UserModel** which is the used for database interaction & storing the data.
2. And uses the **AccountModel** which is used for the accounts collection in the database.

3. ### The messages process
   1. In each user's document there is a connections array that has the user's each connection.
   2. For each connection, we store the other user's information, including their name, ID, email, and profile image. Additionally, we maintain a 'messages' array that records the conversation between the two users.
   3. Each connection is uniquely identified by a ***RoomConnectionID***. This ensures that only those specific users can communicate with each other.
   4. When users exchange messages between each other, we'll preform send & receive through the socket connection, and then update the messages array of that connection (with each message we'll update the database. in a O(n) time complexity) The sown side of this will be a heavy load on the database. 
   5. The users receive the new fresh messages from the socket connection not the database, but when refreshing they'll receive it from the database.
   6. During the initial page refresh, we retrieve the user's complete data, which includes the most recent connections and messages. 

4. ### The users settings
    1. When a user wants to connect with a private user, the private user must accept the connection request.
    2. When a user searches for another user and clicks on it. each user will be add to the connections fo the other.
    3. When a user deletes another user from his contacts, it will be deleted only from his contacts. The deleted user still has the user who deleted him in his contacts , and when he messages the other user it will be add again.
    4. When a user clicks on the yser that he searched for, a new connection will be made between the two users.