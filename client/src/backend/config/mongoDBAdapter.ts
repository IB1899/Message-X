import { MongoClient } from "mongodb";


let uri = process.env.MONGODB_URI as string
if (!uri) throw Error("You didn't provide the mongodb uri")

let client:MongoClient;
let clientPromise:Promise<MongoClient>

if(process.env.NODE_ENV === "development"){

    let GlobalWithMongo = global as typeof globalThis & {
        _mongoClientPromise:Promise<MongoClient>
    }
    if(!GlobalWithMongo._mongoClientPromise){
        client = new MongoClient(uri)
        GlobalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = GlobalWithMongo._mongoClientPromise;
}
else{

    client = new MongoClient(uri);
    clientPromise = client.connect();

}

export default clientPromise
