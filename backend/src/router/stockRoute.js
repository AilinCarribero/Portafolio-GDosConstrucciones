const express = require('express');
const router = express.Router();

const { insertStock, listStock, updateStockRestante } = require('../controllers/stockController');
const { verifyToken } = require('../middlewares/authVerify');

router.post('/insert', verifyToken, insertStock);
router.post('/update', verifyToken, updateStockRestante);
router.get('/', verifyToken, listStock);

module.exports = router;