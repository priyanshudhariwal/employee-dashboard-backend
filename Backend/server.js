const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
});
const db = mongoose.connection
db.on('error', (err) => {
    console.log(err);
});
db.once('open', () => {
    console.log('connected to db');
});

//importing routes
const postRoutes = require('./routes/postRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

app.use('/api', postRoutes);
app.use('/api', employeeRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'working'
    });
}); 

app.listen(process.env.PORT || 3000, () => {
    console.log(`running on port ${process.env.port}`);
});