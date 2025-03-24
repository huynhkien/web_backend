const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const userRouter = require('./app/routes/user.route');
const productRouter = require('./app/routes/product.route');




const app = express();
app.use(cookieParser());

const allowedOrigins = [
    'https://web-frontend-snowy-seven.vercel.app/',
  ];

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

app.get('/', (req, res) => {
    res.json({message: "Project 28/02/2025"});
});




module.exports = app;