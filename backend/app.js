const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const sequelize = require("./config/db");

const uploadRoutes = require('./routes/upload'); 


const app = express();
const port = process.env.PORT || 3000;

//database
sequelize.sync() 
    .then(() => console.log("Database synchronized"))
    .catch(err => console.error("Sync error:", err));


//middlewares    
app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: ['http://localhost:5173'],
  methods: "*",
  allowedHeaders: "*",
};
app.use(cors(corsOptions));




//routes
app.use('/api', uploadRoutes); 


//server
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
