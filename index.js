const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const cors = require("cors");

const port = process.env.PORT || 6070;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//IovSoCTvx19X2IMh

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@tourism.fxfz8.mongodb.net/?retryWrites=true&w=majority&appName=tourism`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const Usercollection = client.db("userscollection").collection("users");
    const Touristspotcollection = client
      .db("Touristspotcollection")
      .collection("spots");
    await client.connect();

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await Usercollection.insertOne(user);
      res.send(result);
    });

    app.get("/touristspot", async (req, res) => {
      const cursor = Touristspotcollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/spot/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await Touristspotcollection.findOne(query);
      res.send(result);
    });

    app.get("/sort", async (req, res) => {
      const cursor = Touristspotcollection.find();
      const result = await cursor.toArray();
      const sort = req.query.sort;
      let Sortdata;
      if (sort === "ascending") {
        Sortdata = result.sort((a, b) => a.average - b.average);
      } else if (sort === "descending") {
        Sortdata = result.sort((a, b) => b.average - a.average);
      } else {
        Sortdata = result;
      }
      res.send(Sortdata);
    });

    app.post("/addtourist", async (req, res) => {
      const tourist = req.body;
      // console.log(tourist);

      const result = await Touristspotcollection.insertOne(tourist);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("my tourism server is running");
});

app.listen(port, () => {
  console.log("server");
});
