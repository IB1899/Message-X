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

## The Cache
1. I either maintain manual hold of the cache through assigning it to a state and with end of each operation(making the requests to the backend)
   I update that state.
2. Or I refresh the page using next refresh that causes the data to be re-fetched.

## DataBase
1. This project uses the **UserModel** which is the used for database interaction & storing the data.
2. And uses the **AccountModel** which is used for the accounts collection in the database.

3. ### The messages process
   1. The messages section will be in a separate route => */main/*
   2. In each user's document there is a connections array that has the user's each connection.
   3. For each connection, we store the other user's information, including their name, ID, email, and profile image. Additionally, we maintain a 'messages' array that records the conversation between the two users.
   4. Each connection is uniquely identified by a ***RoomConnectionID***. This ensures that only those specific users can communicate with each other.
   5. When users exchange messages between each other, we'll preform send & receive through the socket connection, and then update the messages array of that connection (with each message we'll update the database. in a O(n) time complexity) The sown side of this will be a heavy load on the database. 
   6. The users receive the new fresh messages from the socket connection not the database, but when refreshing they'll receive it from the database.
   7. During the initial page refresh, we retrieve the user's complete data, which includes the most recent connections and messages. 

4. ### The users settings
    1. When a user wants to connect with a private user, the private user must accept the connection request.
    2. When a user searches for another user and clicks on it. each user will be add to the connections fo the other.
    3. When a user deletes another user from his contacts, it will be deleted only from his contacts. The deleted user still has the user who deleted him in his contacts , and when he messages the other user it will be add again.
    4. When a user clicks on the user that he searched for, a new connection will be made between the two users.

5. ### The profile process
   1. When a user change their data it will be changed for them and inside any connections they are in.
   2. The user can change their password just like in the login page( it's the same process )

6. ### The stories process
   1. The Stories section will be in a separate route => */main/stories/* 
   2. The stories are in a different collection.
   3. The user can only add one story each day.
   4. The story will be removed automatically from the database after a one day.
   5. A user can only see the stories of his/her friends (connections).
   6. Deleting the users stories automatically can be done through multiple ways: (3ed) is chosen.
      1. In A common visited page, we trigger a request to a backend API end point that evaluates & deletes expired stories. ***Benefit:*** Big accuracy ***Drawback:*** Big demand on your database & server.
      2. **In Node.js server:** we can implement a cron job or scheduled job(They are in forms of functions just like setTimeOut) using a library like node-cron or cron to periodically check and delete expired stories inside the server level-code. ***Benefit:*** Less demand on the server & database ***Drawback:*** Low accuracy.
      3. **In Next.js** we'll have in our nodejs server a cron job that will trigger a request to a Next.js end point that deletes the expired stories. ***Benefit:*** Less demand on the server & database ***Drawback:*** Low accuracy.
      4. Use an outside service cron-job that will trigger a request to our backend API end point ***Benefits & Drawbacks*** depend on you cron job configuration.
 
7. ### The Connections process
   1. When the current user adds another user to his/her connection each user will be added to the connections of each other.
   2. When the current user deletes another user from his/her connection, it will only be deleted in the current user's connections.
   3. Before adding each user to the connections of each other we check first if the current user does exist in the other user's contacts,
      and if they do exist we only add the other user to the current user connections
 
