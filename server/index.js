require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


const corsOptions = {
    origin: [process.env.frontend_url, 'http://localhost:5173'], 
    optionsSuccessStatus: 200,
};

//database connection

mongoose.connect(process.env.MongoDb_Url, {
    useNewUrlParser:true, 
    useUnifiedTopology:true
});

const db = mongoose.connection;

db.on('error', (e)=>console.log(e));
db.once('open', ()=>console.log("connected to the database"));


// Middlewares
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: process.env.Secret_Key,
    saveUninitialized: true,
    resave: false,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

const routes = require('./routes/routes');
app.use(routes);


app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, ()=>{
    console.log(`server connected at port ${port}`);
});