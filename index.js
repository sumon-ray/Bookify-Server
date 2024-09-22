const express = require('express')
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4000;

// home path
app.get("/", (req, res) => {
    res.send('run properly')
})

// Mongodb
const uri = process.env.MONGODB_URL
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


// Data base
async function run() {
    try {











        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);


// the port
app.listen(port, () => {
    console.log('bookify server is run properly')
})