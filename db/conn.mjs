import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

// Create connectionn string
const connectionString = process.env.atlasURI || "";

const client = new MongoClient (connectionString);

let conn;

try {
    conn = await client.connect();
    console.log(`Connected to MongoDB Server`);
} catch (err) {
    console.error(err)
}

let db = conn.db("sample_training");

export default db;