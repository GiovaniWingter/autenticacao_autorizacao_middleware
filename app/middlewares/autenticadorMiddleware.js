const { validationResult } = require("express-validator");
const usuario = require("../models/usuarioModel");
const bcrypt = require("bcryptjs");

gravarUsuAutenticado = async (req, res, next) => {
    let autenticado = { usuLogado: null, id: null, tipo: null };
    const erros = validationResult(req);
    if (erros.isEmpty()) {
        try {
            var dadosForm = {
                user_usuario: req.body.nome_usu,
                senha_usuario: req.body.senha_usu,
            };
            let results = await usuario.findUserEmail(dadosForm);
            if (results.length === 1) {
                if (await bcrypt.compare(dadosForm.senha_usuario, results[0].senha_usuario)) {
                    autenticado = {
                        usuLogado: results[0].nome_usuario,
                        id: results[0].id_usuario,
                        tipo: results[0].tipo_usuario
                    };
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    req.session.autenticado = autenticado;
    next();
}

inicializarSessao = (req, res, next) => {
    if (!req.session.autenticado) {
        req.session.autenticado = { usuLogado: null, id: null, tipo: null };
    }
    next();
}

limparSessao = (req, res, next) => {
    req.session.destroy();
    next()
}

verificarUsuAutorizado = (tipoPermitido, destinoFalha) => {
    return (req, res, next) => {
        if (req.session.autenticado.usuLogado != null &&
            tipoPermitido.includes(req.session.autenticado.tipo)) {
            next();
        } else {
            res.render(destinoFalha, { autenticado: req.session.autenticado });
        }
    };
}

module.exports = {
    inicializarSessao, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado
}
