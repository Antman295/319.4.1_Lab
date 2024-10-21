// Imports
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import gradeRoutes from './routes/gradeRoutes.mjs'

const app = express();
dotenv.config();
let PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

// Routes
app.use('/grades', gradeRoutes)

// Listener
app.listen(PORT, () => {
    console.log(`${PORT} worked. You're welcome!`)
})