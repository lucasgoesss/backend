"use strict";

const { verify } = require("jsonwebtoken");
const { jwt } = require("../configs/auth.js");
const AppError = require("../utils/AppError.js");

module.exports = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    const { message, statusCode } = new AppError("Token não informado.", 401);
    return response.status(statusCode).json({ message, statusCode });
  }

  const [, token] = authHeader.split(" ");

  try {
    // Decodificando o token, pegando todos os dados (is_admin e sub)
    const decoded = verify(token, jwt.secret);
    const { sub: user_id, is_admin } = decoded; // Aqui estamos desestruturando o is_admin e sub

    // Atribuindo os dados ao req.user
    request.user = {
      id: user_id,
      is_admin: is_admin,  // Atribuindo o campo is_admin
    };

    return next();
  } catch {
    const { message, statusCode } = new AppError("Token inválido.", 401);
    return response.status(statusCode).json({ message, statusCode });
  }
};
