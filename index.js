const express = require("express");

const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4000;

// CORS configuration
const allowedOrigins = [
  "https://bookify-mocha.vercel.app",
  "http://localhost:3000",
  "http://localhost:4000",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// home path
app.get("/", (req, res) => {
  res.send("run properly");
});

// Mongodb
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Data base
async function run() {
  try {
    //  database
    const Bookify = client.db("Bookify");
    // collection
    const books = Bookify.collection("books");
    const rent = Bookify.collection("rent");
    const test = Bookify.collection("test");
    const users = Bookify.collection("users");
    const reviews = Bookify.collection("reviews");

    // Get all books by genre && Pagination
    app.get("/books", async (req, res) => {
        try {
          const genre = req.query.genre || "";
          const search = req.query.search || "";
          const email = req.query.email || "";
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 8;
          const skip = (page - 1) * limit;
      
          let query = {};
          if (email) query.AuthorEmail = email;
          if (genre) query.genre = genre;
          if (search) query.title = { $regex: search, $options: "i" };
      
          const totalBooks = await books.countDocuments(query);
          const totalPages = Math.ceil(totalBooks / limit);
          const result = await books.find(query).skip(skip).limit(limit).toArray();
          
          res.send({ books: result, totalPages });
        } catch (error) {
          console.error("Error fetching books:", error);
          res.status(500).send({ error: "Failed to fetch books" });
        }
      });
      




    // get one book
    app.get("/book/:id", async (req, res) => {
      const result = await books.findOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    });
    // Add one book
    app.post("/book", async (req, res) => {
      const result = await books.insertOne(req.body);
      res.send(result);
    });
    // delete one book
    app.delete("/book/:id", async (req, res) => {
      const result = await books.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });
    // get api for rent data
    app.get("/rent", async (req, res) => {
      const result = await rent.find().toArray();
      res.send(result);
    });

    // user api
    app.get("/users", async (req, res) => {
      const result = await users.find().toArray();
      res.send(result);
    });
    app.delete("/user", async (req, res) => {
      const result = await users.deleteOne({ _id: new ObjectId(req.query.id) });
      res.send(result);
    });

    app.put("/user", async (req, res) => {
      try {
        const filter = { _id: new ObjectId(req.query.id) };
        const updateData = {
          name: req.body.name,
          email: req.body.email,
          image: req.body.image,
          role: req.body.role,
        };

        // If a password is provided in the request, hash it before updating.
        if (req.body.password) {
          const saltRounds = 15;
          const hashedPassword = await bcrypt.hash(
            req.body.password,
            saltRounds
          );
          updateData.password = hashedPassword;
        }

        const update = {
          $set: updateData,
        };

        const result = await users.updateOne(filter, update);
        res.send(result);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("An error occurred while updating the user.");
      }
    });

    app.patch("/user", async (req, res) => {
      const filter = { _id: new ObjectId(req.query.id) };
      // Initialize an empty update object
      const updateFields = {};
      // Dynamically add only provided fields to the update object
      if (req.body.name) updateFields.name = req.body.name;
      if (req.body.email) updateFields.email = req.body.email;
      if (req.body.password) updateFields.password = req.body.password;
      if (req.body.image) updateFields.userImage = req.body.image;
      if (req.body.role) updateFields.role = req.body.role;
      // Use $set to update only provided fields
      const update = { $set: updateFields };

      try {
        const result = await users.updateOne(filter, update);
        res.send(result);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ error: "Failed to update user" });
      }
    });

    // POST route to handle user signup
    app.post("/user", async (req, res) => {
      try {
        const newUser = req.body;

        // Check if the user already exists
        const exist = await users.findOne({ email: newUser.email });
        if (exist) {
          return res.status(409).json({ message: "User Exists" }); // Conflict if user exists
        }
        // Hash the password
        const hashPassword = bcrypt.hashSync(newUser.password, 15);
        // Insert new user
        await users.insertOne({ ...newUser, password: hashPassword });
        return res.status(200).json({ message: "User created" });
      } catch (error) {
        return res.status(500).json({
          message: "Something went wrong from catch",
          error: error.message, // Provide a more specific error message
        });
      }
    });

    // review and rating apis
    app.post("/review", async (req, res) => {
      const result = await reviews.insertOne(req.body);
      res.send(result);
    });
    app.get("/reviews", async (req, res) => {
      const bookId = req.query.bookId;
      let query = {};
      if (bookId) {
        query = { bookId: bookId };
      }
      const result = await reviews.find(query).toArray();
      res.send(result);
    });

    // test api
    app.post("/test", async (req, res) => {
      const result = await test.insertOne(req.body);
      res.send(result);
    });

  
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

// the port
app.listen(port, () => {
  console.log("bookify server is run properly");
});
