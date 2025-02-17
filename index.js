const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vyipd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("coffeeDB").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    app.get("/coffees", async (req, res) => {
      const coffees = await coffeeCollection.find().toArray();
      res.send(coffees);
    });

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const coffees = await coffeeCollection.findOne(query);
      res.send(coffees);
    });

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: coffee.name,
          supplier: coffee.supplier,
          category: coffee.category,
          chef: coffee.chef,
          taste: coffee.taste,
          details: coffee.details,
          photo: coffee.photo,
          price: coffee.price,
        },
      };
      const coffees = await coffeeCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(coffees);
    });

    app.post("/coffees", async (req, res) => {
      const coffee = req.body;
      const result = await coffeeCollection.insertOne(coffee);
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
  } catch (error) {
    console.log("Error Occure on", error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run();

app.get("/", (req, res) => {
  res.send("home route");
});

app.listen(port, () => {
  console.log("Server Listening On Port 3000");
});
