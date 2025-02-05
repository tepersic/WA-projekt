import bcrypt1 from 'bcrypt';
import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { connectToDatabase } from '../db.js'; // Import the updated function

dotenv.config();

const router = express.Router();


router.post('/korisnici', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const { client, db } = await connectToDatabase();
        const usersCollection = db.collection('korisnici');

        // Check if user already exists with the same email
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            client.close();
            return res.status(400).json({ message: "User already exists" });
        }

        // Check if nickname (name) is already taken
        const existingNickname = await usersCollection.findOne({ name });
        if (existingNickname) {
            client.close();
            return res.status(400).json({ message: "Nickname already taken. Please choose another one." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to DB
        await usersCollection.insertOne({ name, email, password: hashedPassword });
        client.close();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
});



router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Connect to the database
        const { client, db } = await connectToDatabase();
        const usersCollection = db.collection('korisnici');

        // Check if user exists
        const user = await usersCollection.findOne({ email });
        if (!user) {
            client.close();
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            client.close();
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token with 1-hour expiration
        const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

        // Close the database connection
        client.close();

        // Respond with user data and token
        res.json({
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});



router.get('/profesori', async (req, res) => {
    try {
        const { client, db } = await connectToDatabase();
        const profesoriCollection = db.collection('profesori'); // Ensure collection exists
        const profesori = await profesoriCollection.find().toArray();
        client.close();

        res.json(profesori);
    } catch (error) {
        console.error("Error fetching professors:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;