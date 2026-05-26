var express = require("express");
var router = express.Router();

const { inicializarSessao, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../middlewares/autenticadorMiddleware");

const {usuarioController}   = require("../controllers/usuarioController")

router.get("/", inicializarSessao, function (req, res) {
  res.render("pages/index", { autenticado: req.session.autenticado });
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
  usuarioController.logar
);

router.get("/cadastro", function (req, res) {
  res.render("pages/cadastro", { listaErros: null, valores: { nome_usu: "", nomeusu_usu: "", email_usu: "", senha_usu: "" } });
});

router.post("/cadastro",
  usuarioController.regrasValidacaoFormCad,
  usuarioController.cadastrar
);

router.get(
  "/adm",
  verificarUsuAutorizado([2, 3], "pages/restrito"),
  function (req, res) {
    res.render("pages/adm", { autenticado: req.session.autenticado });
  });

module.exports = router