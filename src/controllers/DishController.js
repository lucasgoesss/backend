"use strict";

const knex = require('../database/knex');
const DiskStorage = require("../providers/DiskStorage");
const AppError = require('../utils/AppError');

class DishController {

    async index(req, res) {
        const { name } = req.query; // Captura o filtro de nome da query string

        // Consulta base para buscar pratos
        let dishesQuery = knex('dishes')
            .select('dishes.id', 'dishes.name', 'dishes.image', 'dishes.category', 'dishes.price', 'dishes.description');

        // Adiciona o filtro por nome, se fornecido
        if (name) {
            dishesQuery = dishesQuery.where('dishes.name', 'like', `%${name}%`);
        }

        // Executa a consulta de pratos
        const dishes = await dishesQuery;

        // Para cada prato, busca os ingredientes associados
        const dishesWithIngredients = await Promise.all(
            dishes.map(async (dish) => {
                const ingredients = await knex('ingredients')
                    .join('dish_ingredients', 'ingredients.id', 'dish_ingredients.ingredient_id')
                    .where('dish_ingredients.dish_id', dish.id)
                    .select('ingredients.id', 'ingredients.name');

                return {
                    ...dish,
                    ingredients // Adiciona os ingredientes ao prato
                };
            })
        );

        return res.status(200).json(dishesWithIngredients);
    }

    async show(req, res) {
        const { id } = req.params; // Captura o id do prato dos parâmetros da rota

        try {
            // Busca o prato pelo ID
            const dish = await knex('dishes')
                .select('dishes.id', 'dishes.name', 'dishes.image', 'dishes.category', 'dishes.price', 'dishes.description')
                .where('dishes.id', id)
                .first(); // Retorna apenas o primeiro resultado

            if (!dish) {
                return res.status(404).json({ message: 'Prato não encontrado' });
            }

            // Busca os ingredientes associados ao prato
            const ingredients = await knex('ingredients')
                .join('dish_ingredients', 'ingredients.id', 'dish_ingredients.ingredient_id')
                .where('dish_ingredients.dish_id', id)
                .select('ingredients.id', 'ingredients.name');

            // Adiciona os ingredientes ao prato e retorna o resultado
            const dishWithIngredients = {
                ...dish,
                ingredients
            };

            return res.status(200).json(dishWithIngredients);
        } catch (error) {
            console.error('Erro ao buscar prato:', error);
            return res.status(500).json({ message: 'Erro ao buscar prato' });
        }
    }

    async create(req, res) {
        const { name, category, ingredients, price, description } = req.body;
        const { filename: imageFilename } = req.file;

        const diskStorage = new DiskStorage();

        // Salva o arquivo de imagem na pasta final
        const image = await diskStorage.saveFile(imageFilename);

        // Cria o prato
        const [dishId] = await knex('dishes').insert({
            name,
            image,
            category,
            price,
            description
        });

        // Adiciona os ingredientes ao prato
        if (ingredients && ingredients.length > 0) {
            const dishIngredients = [];

            for (let ingredientName of ingredients) {
                // Tenta encontrar o ingrediente pelo nome
                let ingredient = await knex('ingredients').where({ name: ingredientName }).first();

                // Se o ingrediente não existir, cria um novo
                if (!ingredient) {
                    const [newIngredientId] = await knex('ingredients').insert({ name: ingredientName });
                    ingredient = { id: newIngredientId };
                }

                // Adiciona o relacionamento entre prato e ingrediente
                dishIngredients.push({
                    dish_id: dishId,
                    ingredient_id: ingredient.id
                });
            }

            // Insere o relacionamento entre o prato e os ingredientes
            await knex('dish_ingredients').insert(dishIngredients);
        }

        return res.status(201).json({ message: 'Prato criado com sucesso!', dishId });
    }

    async update(req, res) {
        const { id } = req.params;
        const { name, category, ingredients, price, description } = req.body;

        // Verifica se existe um arquivo de imagem sendo enviado
        let imageFilename;
        if (req.file) {
            imageFilename = req.file.filename;
        }

        const diskStorage = new DiskStorage();

        // Busca o prato existente
        const dish = await knex('dishes').where({ id }).first();

        if (!dish) {
            throw new AppError('Prato não encontrado', 404);
        }

        // Se uma nova imagem for enviada, deleta a anterior e salva a nova
        let image = dish.image;
        if (imageFilename) {
            if (dish.image) {
                await diskStorage.deleteFile(dish.image); // Deleta a imagem anterior
            }

            // Salva o novo arquivo de imagem
            image = await diskStorage.saveFile(imageFilename);
        }

        // Atualiza o prato
        await knex('dishes').where({ id }).update({
            name,
            image,
            category,
            price,
            description,
            updated_at: knex.fn.now()
        });

        if (ingredients && ingredients.length > 0) {
            // Remove os ingredientes antigos
            await knex('dish_ingredients').where({ dish_id: id }).del();

            const dishIngredients = [];

            for (let ingredientName of ingredients) {
                // Tenta encontrar o ingrediente pelo nome
                let ingredient = await knex('ingredients').where({ name: ingredientName }).first();

                // Se o ingrediente não existir, cria um novo
                if (!ingredient) {
                    const [newIngredientId] = await knex('ingredients').insert({ name: ingredientName });
                    ingredient = { id: newIngredientId };
                }

                // Adiciona o relacionamento entre prato e ingrediente
                dishIngredients.push({
                    dish_id: id,
                    ingredient_id: ingredient.id
                });
            }

            // Insere o relacionamento entre o prato e os ingredientes
            await knex('dish_ingredients').insert(dishIngredients);
        }

        return res.status(200).json({ message: 'Prato atualizado com sucesso!' });
    }

}

module.exports = DishController;
