const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(require("./routes/api.js"));



const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI || 'mongodb://vaughnsmcp>:Password1@ds263248.mlab.com:63248/heroku_6s2j85hm', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});