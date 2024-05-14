var express = require("express");
var router = express.Router();

const { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");

const usuarioController = require("../controllers/usuarioController")

router.get("/", verificarUsuAutenticado, function (req, res) {
  res.render("pages/index", req.session.autenticado);
});

router.get("/sair", limparSessao, function (req, res) {
  res.redirect("/");
});

router.get("/login", function (req, res) {
  res.render("pages/login", { listaErros: null });
});

router.post(
  "/login",
  usuarioController.regrasValidacaoFormLogin,
  gravarUsuAutenticado,
  function (req, res) {
    usuarioController.logar(req, res);
  });

router.get("/cadastro", function (req, res) {
  res.render("pages/cadastro", { listaErros: null, valores: { nome_usu: "", nomeusu_usu: "", email_usu: "", senha_usu: "" } });
});

router.post("/cadastro",
  usuarioController.regrasValidacaoFormCad,
  async function (req, res) {
    usuarioController.cadastrar(req, res);
  });

router.get(
  "/adm",
  verificarUsuAutorizado([2, 3], "pages/restrito"),
  function (req, res) {
    res.render("pages/adm", req.session.autenticado);
  });

module.exports = router