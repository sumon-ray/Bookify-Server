const express = require("express")
const { CohereClient } = require("cohere-ai");
const cors = require("cors");
// const OpenAI = require('openai');
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const axios = require('axios');
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4000;

// CORS configuration
const allowedOrigins = [
  "https://bookify-mocha.vercel.app",
  "https://bookify06.vercel.app",
  "https://bookify-server-lilac.vercel.app",
  "http://localhost:3000",
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
    const takeBook = Bookify.collection("takeBook");
    const giveBook = Bookify.collection("giveBook");
    const notification = Bookify.collection("notification");
    const message = Bookify.collection("message");
    // const exchange = Bookify.collection("exchange");
    const request = Bookify.collection("exchange-request");
    const test = Bookify.collection("test");
    const users = Bookify.collection("users");
    const reviews = Bookify.collection("reviews");
    const rent = Bookify.collection("rent");
    const cart = Bookify.collection("cart");
    const audioBook = Bookify.collection("audioBook");

    app.get("/dashboard", async (req, res) => {
      const exchangeBooks = await books.countDocuments();
      const rentBooks = await rent.countDocuments();
      const audioBooks = await audioBook.countDocuments();
      const totalUsers = await users.countDocuments();
      const book = await books.find().toArray();
      const topBooks = book.filter((b) => b.rating < 4.5);
      const totalReview = await reviews.find().toArray();
      const Users = await users.find().toArray();
      const date = new Date();
      const thisMonth = date.getMonth() + 1;
      const newUsers = Users.filter(
        (u) =>
          parseInt(u.createdAt.toLocaleString().split("/")[0]) === thisMonth
      );
      res.send({
        exchangeBooks,
        rentBooks,
        audioBooks,
        totalUsers,
        topBooks,
        newUsers,
        totalReview,
      });
    });

    // exchange books
    // Get all books or get by genre
    app.get("/books", async (req, res) => {
      const genre = req.query.genre;
      const owner = req.query.owner || "";
      const title = req.query.title;
      const search = req.query.search || ''
      const email = req.query.email;
      const excludeEmail = req.query.excludeEmail;
      let query = {};
      
      if (owner && excludeEmail && search) {
        query = { AuthorEmail: { $ne: excludeEmail }, owner, title: { $regex: search, $options: "i" } };
      } else if (owner !== ' ' && owner && excludeEmail) {
        query = { AuthorEmail: { $ne: excludeEmail }, owner };
      } else if (search && excludeEmail) {
        query = { AuthorEmail: { $ne: excludeEmail }, title: { $regex: search, $options: "i" } };
      } else if (email && genre) {
        query = { AuthorEmail: email, genre };
      } else if (genre && title) {
        query = { genre, title: { $ne: title } };
      } else if (email && search) {
        query = { AuthorEmail: email, title: { $regex: search, $options: "i" } };
      } else if (excludeEmail) {
        query = { AuthorEmail: { $ne: excludeEmail } };
      } else if (genre) {
        query = { genre };
      } else if (search) {
        query = { title: { $regex: search, $options: "i" } };
      } else if (email) {
        query = { AuthorEmail: email };
      }

      const result = await books.find(query).toArray();
      res.send(result);
    });
    // pagination of dashboard's home route
    app.get("/books/paginated", async (req, res) => {
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
        const result = await books
          .find(query)
          .skip(skip)
          .limit(limit)
          .toArray();

        res.send({ books: result, totalPages });
      } catch (error) {
        console.error("Error fetching paginated books:", error);
        res.status(500).send({ error: "Failed to fetch paginated books" });
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


    //  update my books api
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const { book } = req.body;
      const options = { upsert: true };
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          book: book,
        },
      };
      const result = await books.updateOne(filter, updateDoc, options);
      res.send(result);
    });


    // api for book exchange
    app.post('/take-book', async (req, res) => {
      const requesterBooks = await takeBook.find({ requester: req?.query?.email }).toArray()
      const uniqueBook = await takeBook.findOne({ _id: req?.query?.id })
      if (uniqueBook) {
        return res.send({ message: 'Already added in take books' });
      }
      if (requesterBooks[0]?.AuthorEmail === req?.query?.AuthorEmail) {
        const result = await takeBook.insertOne(req.body)
        return res.send({ result, message: "Book added successfully!" })
      }
      else {
        if (requesterBooks?.length === 0) {
          const result = await takeBook.insertOne(req.body)
          return res.send(result)
        }
        else {
          return res.send({ message: `All books in this exchange must come from ${requesterBooks[0]?.owner}` });
        }
      }
    })
    app.post('/give-book', async (req, res) => {
      const existed = await giveBook.findOne({ _id: req?.query?.id })
      if (existed) return res.send({ message: "Already added in give books" })
      const result = await giveBook.insertOne(req.body)
      res.send({ result, message: `Book added successfully!` })
    })
    app.get('/take-book', async (req, res) => {
      const result = await takeBook.find({ requester: req?.query?.email }).toArray();
      res.send(result)
    })
    app.get('/give-book', async (req, res) => {
      const result = await giveBook.find({ requester: req?.query?.email }).toArray();
      res.send(result)
    })
    app.delete('/take-book/:id', async (req, res) => {
      const result = await takeBook.deleteOne({ _id: req.params.id })
      res.send(result)
    })
    app.delete('/take-books', async (req, res) => {
      const result = await takeBook.deleteMany({ requester: { $regex: req.query.email } })
      res.send(result)
    })
    app.delete('/give-book/:id', async (req, res) => {
      const result = await giveBook.deleteOne({ _id: req.params.id })
      res.send(result)
    })
    app.delete('/give-books', async (req, res) => {
      const result = await giveBook.deleteMany({ requester: { $regex: req.query.email } })
      res.send(result)
    })

    app.post('/exchange-request', async (req, res) => {
      const result = await request.insertOne(req.body)
      res.send(result)
    })
    app.get('/exchange-request', async (req, res) => {
      const requesterEmail = req?.query?.requesterEmail
      const ownerEmail = req?.query?.ownerEmail

      let query = {}
      if (requesterEmail) {
        query = { requesterEmail: { $regex: requesterEmail } }
      } else if (ownerEmail) {
        query = { ownerEmail: { $regex: ownerEmail } }
      } else {
        return res.send({ message: "You don't access the data!. Be careful" })
      }

      const result = await request.find(query).toArray()
      res.send(result)
    })
    app.patch('/get-request-cancel', async (req, res) => {
      const result = await request.updateOne({ _id: new ObjectId(req.query.id) }, { $set: { ownerEmail: '', status: 'canceled' } })
      res.send(result)
    })
    app.delete('/send-request-delete', async (req, res) => {
      const result = await request.deleteOne({ _id: new ObjectId(req?.query?.id) })
      res.send(result)
    })

    app.put("/exchange", async (req, res) => {
      const { requesterName, requesterEmail, requesterProfile, ownerEmail, ownerProfile, ownerName, ownerBooksIds, requesterBooksIds, id, status } = req?.body || {}
      try {
        if (status !== 'pending') return res.send({ message: "Request is already approved." })

        const requesterBooksUpdate = await books.updateMany(
          { _id: { $in: requesterBooksIds.map(id => new ObjectId(id)) } },
          { $set: { owner: ownerName, AuthorEmail: ownerEmail, AuthorProfile: ownerProfile } }
        )
        const ownerBooksUpdate = await books.updateMany(
          { _id: { $in: ownerBooksIds.map(id => new ObjectId(id)) } },
          { $set: { owner: requesterName, AuthorEmail: requesterEmail, AuthorProfile: requesterProfile } }
        )

        if (requesterBooksUpdate.modifiedCount > 0 && ownerBooksUpdate.modifiedCount > 0) {
          const statusUpdate = await request.updateOne({ _id: new ObjectId(id) }, { $set: { status: 'approved' } })
          if (statusUpdate.modifiedCount > 0) {
            res.send({ message: "Book exchange approved successfully." })
          } else {
            res.send({ message: 'This book is already exchanged' });
          }
        }

      } catch (error) {
        res.send({ error: error.message })
      }
    });

    // Notification
    app.post('/notification', async (req, res) => {
      const result = await notification.insertOne(req.body);
      res.send(result)
    })
    app.get('/notifications', async (req, res) => {
      const owner = req.query.owner
      const approved = req.query.approved
      let query = {}
      if (owner) {
        query = { ownerEmail: req.query.owner }
      } else if (approved) {
        query = { approvedEmail: req.query.approved }
      }
      const result = await notification.find(query).toArray()
      res.send(result)
    })

    // Update book
    app.put("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updateDoc = {};

      const allowedFields = [
        "title",
        "author",
        "genre",
        "condition",
        "description",
        "coverImage",
        "exchangeStatus",
        "publishYear",
        "totalPage",
        "location",
        "rating",
        "AuthorEmail",
        "AuthorProfile",
        "owner",
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateDoc[field] = req.body[field];
        }
      });

      const filter = { _id: new ObjectId(id) };

      try {
        const result = await books.updateOne(filter, { $set: updateDoc });

        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .send({ message: "Book not found or no changes made." });
        }
        res.send(result);
      } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).send({ error: "Failed to update book" });
      }
    });

    // rent books
    // get api for rent data
    app.get("/rent", async (req, res) => {
      const currentPage = parseInt(req?.query?.currentPage) || 1;
      const limit = parseInt(req?.query?.limit) || 10;
      const skip = (currentPage - 1) * limit;
      const { Author, Publisher, PublishYear, Language, Price, Genre } =
        req?.query || {};
      let [minPrice, maxPrice] = Price?.split(",").map(Number) || [350, 500];

      // console.log(Genre.split(','))
      let query = {};

      if (
        Author &&
        Publisher &&
        PublishYear &&
        Language &&
        minPrice &&
        maxPrice &&
        !isNaN(minPrice) &&
        !isNaN(maxPrice) &&
        Genre
      ) {
        query = {
          Author,
          Publisher,
          "Year of Publication": PublishYear,
          Language,
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$Price" }, minPrice] },
              { $lte: [{ $toDouble: "$Price" }, maxPrice] },
            ],
          },
          Genre: { $in: Genre.split(",") },
        };
      } else if (
        Publisher &&
        PublishYear &&
        Language &&
        minPrice &&
        maxPrice &&
        !isNaN(minPrice) &&
        !isNaN(maxPrice) &&
        Genre
      ) {
        query = {
          Publisher,
          "Year of Publication": PublishYear,
          Language,
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$Price" }, minPrice] },
              { $lte: [{ $toDouble: "$Price" }, maxPrice] },
            ],
          },
          Genre: { $in: Genre.split(",") },
        };
      } else if (
        Author &&
        PublishYear &&
        Language &&
        minPrice &&
        maxPrice &&
        !isNaN(minPrice) &&
        !isNaN(maxPrice) &&
        Genre
      ) {
        query = {
          Author,
          "Year of Publication": PublishYear,
          Language,
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$Price" }, minPrice] },
              { $lte: [{ $toDouble: "$Price" }, maxPrice] },
            ],
          },
          Genre: { $in: Genre.split(",") },
        };
      } else if (
        Author &&
        Publisher &&
        Language &&
        minPrice &&
        maxPrice &&
        !isNaN(minPrice) &&
        !isNaN(maxPrice) &&
        Genre
      ) {
        query = {
          Author,
          Publisher,
          Language,
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$Price" }, minPrice] },
              { $lte: [{ $toDouble: "$Price" }, maxPrice] },
            ],
          },
          Genre: { $in: Genre.split(",") },
        };
      } else if (
        PublishYear &&
        Language &&
        minPrice &&
        maxPrice &&
        !isNaN(minPrice) &&
        !isNaN(maxPrice) &&
        Genre
      ) {
        query = {
          "Year of Publication": PublishYear,
          Language,
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$Price" }, minPrice] },
              { $lte: [{ $toDouble: "$Price" }, maxPrice] },
            ],
          },
          Genre: { $in: Genre.split(",") },
        };
      } else if (
        Author &&
        Language &&
        minPrice &&
        maxPrice &&
        !isNaN(minPrice) &&
        !isNaN(maxPrice) &&
        Genre
      ) {
        query = {
          Author,
          Language,
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$Price" }, minPrice] },
              { $lte: [{ $toDouble: "$Price" }, maxPrice] },
            ],
          },
          Genre: { $in: Genre.split(",") },
        };
      } else if (
        Publisher &&
        Language &&
        minPrice &&
        maxPrice &&
        !isNaN(minPrice) &&
        !isNaN(maxPrice) &&
        Genre
      ) {
        query = {
          Publisher,
          Language,
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$Price" }, minPrice] },
              { $lte: [{ $toDouble: "$Price" }, maxPrice] },
            ],
          },
          Genre: { $in: Genre.split(",") },
        };
      } else if (
        minPrice &&
        maxPrice &&
        !isNaN(minPrice) &&
        !isNaN(maxPrice) &&
        Genre
      ) {
        query = {
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$Price" }, minPrice] },
              { $lte: [{ $toDouble: "$Price" }, maxPrice] },
            ],
          },
          Genre: { $in: Genre.split(",") },
        };
      } else if (minPrice && maxPrice && !isNaN(minPrice) && !isNaN(maxPrice)) {
        query = {
          $expr: {
            $and: [
              { $gte: [{ $toDouble: "$Price" }, minPrice] },
              { $lte: [{ $toDouble: "$Price" }, maxPrice] },
            ],
          },
        };
      }

      const totalBooks = await rent.countDocuments(query);
      const totalPages = Math.ceil(totalBooks / limit);
      const result = await rent.find(query).skip(skip).limit(limit).toArray();
      res.send({ result, totalPages });
    });

    app.post('/cart', async (req, res) => {
      const existed = await cart.findOne({ _id: req?.query?.id })
      if (existed) {
        return res.send({ message: 'This book already added in cart' })
      }
      const result = await cart.insertOne(req.body)
      res.send(result)
    })

    app.get('/cart', async (req, res) => {
      const result = await cart.find({ cartOwner: req.query.email }).toArray()
      res.send(result);
    })

    // chat system
    app.post('/message', async (req, res) => {
      const result = await message.insertOne(req.body)
      res.send(result)
    })
    app.get('/message', async (req, res) => {
      const email1 = req.query.senderEmail;
      const email2 = req.query.receiverEmail;
      const result = await message.find({
        $or: [
          { senderEmail: email1, receiverEmail: email2 },
          { senderEmail: email2, receiverEmail: email1 }
        ]
      }).toArray();
      res.send(result);
    })


    // for only genre
    app.get("/rent-values", async (req, res) => {
      const result = await rent.find().toArray();
      res.send(result);
    });


    // audioBooks
    //  get all audio books api
    app.get("/audioBook", async (req, res) => {
      const result = await audioBook.find().toArray();
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


    app.get("/genres", async (req, res) => {
      try {
        const genres = await books.aggregate([
          { $group: { _id: "$genre" } },
          { $project: { genre: "$_id", _id: 0 } }
        ]).toArray();

        res.json(genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).json({ message: "Failed to fetch genres" });
      }
    });

    // Chat with Ai
    const cohere = new CohereClient({
      apiKey: "CO_API_KEY",
    });

    app.use(express.json());

    app.post("/ask-ai", async (req, res) => {
      try {
        const { query } = req.body;
        const chatResponse = await cohere.chat({
          model: "command",
          message: query,
        });

        res.json({ answer: chatResponse.text });
      } catch (error) {
        console.error("Error:", error);
        res
          .status(500)
          .json({ error: "An error occurred while processing your request." });
      }
    });


// Create a POST api
app.post("/generate-content", async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const data = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  // console.log("Request Payload:", JSON.stringify(data)); 

  try {
    const response = await axios.post(url, data);
    // console.log("Gemini API Response:", response.data);

    const candidates = response.data.candidates;
    if (candidates && candidates.length > 0) {
      const content = candidates[0].content;
      // console.log("Content Object:", content);

      const answer = content.parts.map(part => part.text).join('');
      res.json({ answer }); 
    } else {
      res.json({ answer: "No response from API" });
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to generate content." });
  }
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



