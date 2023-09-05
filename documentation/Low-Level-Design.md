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
1. This is an overall image of the [user interface design](./assets/Screenshot%20from%202023-08-28%2016-52-49.png)

## File Structure
1. This is a [diagram](./assets/kerm%20AI%202.jpg) of the File Structure in depth.  

## DataBase
1. This project uses one model which is the **User** model for database interaction & storing the data.
    
