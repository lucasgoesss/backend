const { Router } = require('express');
const multer = require("multer");

const DishController = require('../controllers/DishController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const ensureAdmin = require('../middlewares/ensureAdmin');
const uploadConfig = require("../configs/upload.js");

const dishesRoutes = Router();
const dishController = new DishController();
const upload = multer(uploadConfig.MULTER);

dishesRoutes.get('/', ensureAuthenticated, dishController.index);
dishesRoutes.get('/:id', ensureAuthenticated, dishController.show);
dishesRoutes.post('/', ensureAuthenticated, ensureAdmin, upload.single('image'), dishController.create);
dishesRoutes.put('/:id', ensureAuthenticated, ensureAdmin, upload.single('image'), dishController.update);

module.exports = dishesRoutes;
