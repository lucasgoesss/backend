"use strict";

const { compare, hash } = require("bcrypt");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    const { name, email, password, isAdmin = false } = request.body;

    const queryCheckUserExists = await knex("users").where({ email }).first();

    if (queryCheckUserExists) {
      const { message, statusCode } = new AppError(
        "Este e-mail já está em uso.",
        400
      );
      return response.status(statusCode).json({ message, statusCode });
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
      is_admin: isAdmin
    });

    return response.status(201).json("Usuário criado com sucesso");
  }

  async get(request, response) {
  

    const queryCheckUserExists = await knex("users").where({ email }).first();

    if (queryCheckUserExists) {
      const { message, statusCode } = new AppError(
        "Este e-mail já está em uso.",
        400
      );
      return response.status(statusCode).json({ message, statusCode });
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
      is_admin: isAdmin
    });

    return response.status(201).json("Usuário criado com sucesso");
  }
  async update(request, response) {
    const { name, email, password, oldPassword } = request.body;
    const user_id = request.user.id;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      const { message, statusCode } = new AppError(
        "Usuário não encontrado.",
        400
      );
      return response.status(statusCode).json({ message, statusCode });
    }

    const userExists = await knex("users").where({ email }).first();

    if (email !== user.email && userExists) {
      const { message, statusCode } = new AppError(
        "Este e-mail já está em uso.",
        400
      );
      return response.status(statusCode).json({ message, statusCode });
    }

    if (password && !oldPassword) {
      const { message, statusCode } = new AppError(
        "A senha atual deve ser informada.",
        400
      );
      return response.status(statusCode).json({ message, statusCode });
    }

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if (!checkOldPassword) {
        const { message, statusCode } = new AppError(
          "A senha está incorreta.",
          400
        );
        return response.status(statusCode).json({ message, statusCode });
      }

      user.password = await hash(password, 8);
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await knex("users")
      .update({
        name: user.name,
        email: user.email,
        password: user.password,
        updated_at: knex.fn.now(),
      })
      .where({ id: user_id });

    return response.status(200).json("Usuário atualizado com sucesso");
  }
}

module.exports = UsersController;
