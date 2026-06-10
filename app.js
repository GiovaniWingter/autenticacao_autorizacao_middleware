const env = require("dotenv").config();
const express = require("express");
//Importa o módulo express para criar o servidor web. 

const app = express();
//Cria o servidor express e o armazena na constante app

var session = require("express-session");
//importa o módulo express-session para gerenciar sessões de usuário.

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);
// Configura o middleware de sessão para o aplicativo express. 
// O segredo é usado para assinar a ID da sessão, 
// resave e saveUninitialized controlam o comportamento de salvamento da sessão,
// e cookie define as opções do cookie de sessão.

app.use(express.static("./app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var rotas = require("./app/routes/router");
app.use("/", rotas);

app.listen(process.env.APP_PORT, () => {
  console.log(`Servidor online...\nhttp://localhost:${process.env.APP_PORT}`);
}); 
