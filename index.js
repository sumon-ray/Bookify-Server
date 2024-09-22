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

        //  database
        const Bookify = client.db('Bookify');
        // collection
        const books = Bookify.collection('test');


        // Get all books
        app.get('/books', async (req, res) => {
            const result = await books.find().toArray();
            res.send(result)
        })
        // Add one book
        app.post('/books', async (req, res) => {
            const result = await books.insertOne(req.body);
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








const data = [
    {
        "book_id": 101,
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "genre": "Fiction",
        "year_published": 1925,
        "condition": "Good"
    },
    {
        "book_id": 102,
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "genre": "Historical Drama",
        "year_published": 1960,
        "condition": "Excellent"
    },
    {
        "book_id": 103,
        "title": "1984",
        "author": "George Orwell",
        "genre": "Dystopian",
        "year_published": 1949,
        "condition": "Fair"
    },
    {
        "book_id": 104,
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "genre": "Romance",
        "year_published": 1813,
        "condition": "New"
    }
]