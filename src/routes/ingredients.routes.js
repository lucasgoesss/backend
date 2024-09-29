const { Router } = require('express');
const IngredientController = require('../controllers/IngredientController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const ensureAdmin = require('../middlewares/ensureAdmin');

const ingredientsRoutes = Router();
const ingredientController = new IngredientController();

// Criação de ingrediente (somente admin)
ingredientsRoutes.post('/', ensureAuthenticated, ensureAdmin, ingredientController.create);

// Atualização de ingrediente (somente admin)
ingredientsRoutes.put('/:id', ensureAuthenticated, ensureAdmin, ingredientController.update);

// Remoção de ingrediente (somente admin)
ingredientsRoutes.delete('/:id', ensureAuthenticated, ensureAdmin, ingredientController.delete);

module.exports = ingredientsRoutes;
