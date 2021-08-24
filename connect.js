import { MongoClient } from "mongodb";
import dotenv from 'dotenv'
dotenv.config() // import 'dotenv/config'

const mongoURI = process.env['MONGO_URI'];

const client = new MongoClient(mongoURI);

async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}
run().catch(console.dir);
