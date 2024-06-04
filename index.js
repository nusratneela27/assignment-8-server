const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require('bcrypt');
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
        const userCollection = db.collection("users")

        // User Registration
        app.post("/register", async (req, res) => {
            const { name, email, password } = req.body;

            // Check if email already exists
            const existingUser = await userCollection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into the database
            await userCollection.insertOne({ name, email, password: hashedPassword });

            res.status(201).json({
                success: true,
                message: 'User registered successfully'
            });
        });

        // User Login
        app.post("/login", async (req, res) => {
            const { email, password } = req.body;

            // Find User by email
            const user = await userCollection.findOne({ email })
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" })
            }

            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            res.json({
                success: true,
                message: 'Login successful',
                token
            });
        })


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