const express = require('express')
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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

        //  database
        const Bookify = client.db('Bookify');
        // collection
        const books = Bookify.collection('books');
        const rent = Bookify.collection('rent');
        const test = Bookify.collection('test');
        const users = Bookify.collection('users');


        // Get all books or get by genre
        app.get('/books', async (req, res) => {
            const genre = req.query.genre;
            const search = req.query.search;
            const email = req.query.email;
            let query = {};

            if (genre) { query = { genre } }
            else if (search) {
                query = { title: { $regex: search, $options: "i" } }
            }
            else if (email) {
                query = { AuthorEmail: email }
            }

            const result = await books.find(query).toArray();
            res.send(result)
        })
        // get one book
        app.get('/book/:id', async (req, res) => {
            const result = await books.findOne({ _id: new ObjectId(req.params.id) });
            res.send(result);
        })
        // Add one book
        app.post('/book', async (req, res) => {
            const result = await books.insertOne(req.body);
            res.send(result);
        })
        // delete one book
        app.delete('/book/:id', async (req, res) => {
            const result = await books.deleteOne({ _id: new ObjectId(req.params.id) });
            res.send(result);
        })
        // get api for rent data
        app.get('/rent', async (req, res) => {
            const result = await rent.find().toArray();
            res.send(result)
        })



        // user info get api
        app.get('/users', async (req, res) => {
            const result = await users.find().toArray();
            res.send(result)
        })







        //    test api
        app.post('/test', async (req, res) => {
            const result = await test.insertOne(req.body);
            res.send(result);
        })


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

