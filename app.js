const express = require("express");
const app = express();

const env = require("dotenv").config();
var session = require("express-session");

app.use(express.static("./app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "HELLonODE",
    resave: false,
    saveUninitialized: false,
  }));

var rotas = require("./app/routes/router");
app.use("/", rotas);

app.listen(process.env.APP_PORT, () => {
  console.log(`Servidor online...\nhttp://localhost:${process.env.APP_PORT}`);
}); 

// teste