const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("connected to MongoDB");

        const db = client.db('women-cloth');
        const productsCollection = db.collection('products');

        // Get All Products
        app.get("/women-wear", async (req, res) => {
            const result = await productsCollection.find().toArray()
            res.send(result)
        })

        //Get Single Details Products
        app.get("/women-wear/:id", async (req, res) => {
            const id = (req.params.id)
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.findOne(query)
            res.send(result);
        });

    } finally {
    }
}

run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is running");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})