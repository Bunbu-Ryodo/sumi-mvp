import { MongoClient, ServerApiVersion } from "mongodb";

const URI = `mongodb+srv://sumi_admin:momiji@sumi.rriuz.mongodb.net/?retryWrites=true&w=majority&appName=sumi`
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} catch (err) {
  console.error(err);
}

let db = client.db("sumi");

export default db;