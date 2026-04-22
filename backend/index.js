require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

// --- Configuration ---
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; // Ensure this is in your .env

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MongoDB Connection ---
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('---------------------------------');
        console.log('✅ MongoDB Connected Successfully');
        console.log(`📡 Status: Active`);
        console.log('---------------------------------');
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Failed:', err.message);
        process.exit(1); 
    });

// --- User Schema ---
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'] 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        lowercase: true 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'] 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const User = mongoose.model('User', userSchema);

// --- API Routes ---

/** * @route   POST /register
 * @desc    Register a new student
 */
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and save user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "Student registered successfully!" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/** * @route   POST /login
 * @desc    Authenticate student & Login
 */
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // 3. Success Response
        res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            student: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});