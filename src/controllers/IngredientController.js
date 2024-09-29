"use strict";

const knex = require('../database/knex');

class IngredientController {
    async create(req, res) {
        const { name } = req.body;

        const [ingredientId] = await knex('ingredients').insert({
            name
        });

        return res.status(201).json({ message: 'Ingrediente criado com sucesso!', ingredientId });
    }

    async update(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        await knex('ingredients').where({ id }).update({
            name,
            updated_at: knex.fn.now()
        });

        return res.status(200).json({ message: 'Ingrediente atualizado com sucesso!' });
    }

    async delete(req, res) {
        const { id } = req.params;

        await knex('ingredients').where({ id }).del();

        return res.status(200).json({ message: 'Ingrediente removido com sucesso!' });
    }
}

module.exports = IngredientController;
