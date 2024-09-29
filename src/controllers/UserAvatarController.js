"use strict";

const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const { filename } = request.file;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user)
      throw new AppError(
        "Somente usuário autenticado pode mudar o avatar",
        401
      );

    const diskStorage = new DiskStorage();

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const fileName = await diskStorage.saveFile(filename);

    user.avatar = fileName;

    await knex("users").update(user).where({ id: user_id });

    return response.status(200).json(user);
  }
}

module.exports = UserAvatarController;
