require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mistakeRoutes = require('./routes/mistakeRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/mistakes', mistakeRoutes);
app.use('/results', resultRoutes);

// Root route for health check
app.get('/', (req, res) => {
    res.send('MindForge Mistakes API is running...');
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindforge')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
