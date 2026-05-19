const { validationResult } = require("express-validator");
const usuario = require("../models/usuarioModel");
const bcrypt = require("bcryptjs");

verificarUsuAutenticado = (req, res, next) => {
    let autenticado = { usuLogado: null, id: null, tipo: null };
    if (req.session.autenticado) {
        autenticado = req.session.autenticado;
    } 
    req.session.autenticado = autenticado;
    next();
}

limparSessao = (req, res, next) => {
    req.session.destroy();
    next()
}

gravarUsuAutenticado = async (req, res, next) => {
    let autenticado =  { usuLogado: null, id: null, tipo: null };
    erros = validationResult(req)
    if (erros.isEmpty()) {
        var dadosForm = {
            user_usuario: req.body.nome_usu,
            senha_usuario: req.body.senha_usu,
        };
        let results = await usuario.findUserEmail(dadosForm);
        let total = Object.keys(results).length;
        if (total == 1) {
            if (bcrypt.compareSync(dadosForm.senha_usuario, results[0].senha_usuario)) {
                autenticado = {
                    usuLogado: results[0].nome_usuario,
                    id: results[0].id_usuario,
                    tipo: results[0].tipo_usuario
                };
            }
        } 
    } 
    req.session.autenticado = autenticado;
    next();
}

verificarUsuAutorizado = (tipoPermitido, destinoFalha) => {
    return (req, res, next) => {
        if (req.session.autenticado.usuLogado != null &&
            tipoPermitido.find( (element)=> { return element == req.session.autenticado.tipo }) != undefined) {
            next();
        } else {
            res.render(destinoFalha, req.session.autenticado);
        }
    };
}

module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}
