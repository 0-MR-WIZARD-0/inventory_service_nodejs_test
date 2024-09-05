const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/index');

router.post('/products', inventoryController.createProduct);
router.post('/stock', inventoryController.createStock);
router.patch('/stock/increase/:id', inventoryController.patchIncreaseStock);
router.patch('/stock/decrease/:id', inventoryController.patchDecreaseStock);
router.get('/stock', inventoryController.getStockFiltered);
router.get('/products', inventoryController.getProductsFiltered);

module.exports = router;