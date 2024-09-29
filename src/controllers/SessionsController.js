"use strict";

const { compare } = require("bcrypt");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const authConfigs = require("../configs/auth.js");
const { sign } = require("jsonwebtoken");

class SessionsController {
  async login(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      const { message, statusCode } = new AppError(
        "Email e/ou senha incorreto(s).",
        401
      );
      return response.status(statusCode).json({ message, statusCode });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      const { message, statusCode } = new AppError(
        "Email e/ou senha incorreto(s).",
        401
      );
      return response.status(statusCode).json({ message, statusCode });
    }

    const { expiresIn, secret } = authConfigs.jwt;
    const token = sign(
      {
        is_admin: user.is_admin, // Incluindo is_admin no token
      },
      String(secret),
      {
        subject: String(user.id),
        expiresIn,
      }
    );

    return response.status(201).json({ user, token });
  }

  async logout(request, response) {
    const token = request.headers.authorization?.split(" ")[1];
    if (token) {
      await knex("revoked_tokens").insert({ token });
    }

    return response.status(200).json({ message: "Logout realizado com sucesso" });
  }
}

module.exports = SessionsController;
