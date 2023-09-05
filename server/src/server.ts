import express, { Request, Response, json } from "express"
import cors from "cors"
import multer from "multer"


let server = express()

server.use(express.json())

server.use(cors())

server.listen(3001, () => {
    console.log("listening");

})

let uploadImage = multer({ storage: multer.memoryStorage() })


let apiKey = "AIzaSyB1my6I_lDCFr8dBStU_RXRitO8cI5-kSg"
let authDomain = "imagesdatabasemongodb.firebaseapp.com"
let projectId = "imagesdatabasemongodb"
let storageBucket = "imagesdatabasemongodb.appspot.com"
let messagingSenderId = "636958635338"
let appId = "1:636958635338:web:13833c681ea86e60f5fdb3"
let measurementId = "G-GNQJ5T6LNP"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let Config = {
    firebaseConfig: {
        apiKey ,
        authDomain, 
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
        measurementId
    }
};

let uploadUserImage = multer({ storage: multer.memoryStorage() })

import { initializeApp } from "firebase/app"
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

initializeApp(Config.firebaseConfig);
let storage = getStorage()

server.post("/signup", uploadImage.single("image"), async(req: Request, res: Response) => {

    try {

        //! the sign-yp data that we receive from the frontend 
        let { name, email, password } = req.body;
        let { originalname, mimetype } = req.file!
        let image = originalname + "  " + email;

        console.log(req);
        

        //! Uploading the image to firebase
        let snapshot = await uploadBytesResumable(ref(storage, `user-images/${image}`), req.file!.buffer, { contentType: mimetype })

        let downloadURL = await getDownloadURL(snapshot.ref)

        res.json({ success: "done" });
    }
    catch (err: any) {

        let Errors: any = {}

        if (err.code === 11000) {
            Errors["email"] = "This email already exists";
        }
        else if (err.message.includes("main validation failed")) {
            Object.values(err.errors).forEach((one: any) => {
                Errors[one.properties.path] = one.properties.message;
            })
        }
        else {
            Errors["email"] = err;
        }

        //! Sending an Errors object in case of error
        res.json(Errors);
    }
})