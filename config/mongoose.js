const mongoose = require("mongoose");
// connect mongodb to node app
// mongoose.connect() takes 2 arguments : 1. Which db to connect (db Url) , 2. Connection options
// MongoDB connection
mongoose.connect(
  "mongodb+srv://Video:" +
    process.env.MONGO_PASSWORD +
    "@cluster0.dsrim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// acquiring the connection to check if it is succesfull
const db = mongoose.connection;

// checking for the error
db.on(
  "error",
  console.error.bind(console, "Getting error in connecting to database")
);

// up and running then print the statement
db.once("open", () => {
  console.log("succesfully connected to database");
});

// exporting the connection
module.exports = db;
