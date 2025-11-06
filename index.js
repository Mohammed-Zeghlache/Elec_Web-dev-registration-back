
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const User = require('./models/User');


app.use(express.json());

// app.use (cors(
//     {origin: 'http://localhost:5173',
//     }
// ));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://register-webdev.netlify.app',
    'https://register-webdev-25.netlify.app'
  ]
}));


app.post('/users/create', async (req, res) => {
    console.log(req.body);
    
    try {
        
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.json({ message: "Email already exists" });
       
        
        const existPhone = await User.findOne({ phone: req.body.phone });
        if (existPhone) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        
        const new_user = new User({
            username: req.body.username,
            userlastname: req.body.userlastname,
            email: req.body.email,
            phone: req.body.phone,
            date: req.body.date
        });

        await new_user.save();
        res.status(201).json({ message: 'User created successfully' });
        
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// const PORT = process.env.PORT || 10000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);

    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
