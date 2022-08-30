const express = require('express');
const router = express.Router();

const { insertModulo, listModulos, changeVendido } = require('../controllers/moduloController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, listModulos);
router.post('/insert', verifyToken, insertModulo);
router.post('/update/vendido/:id', verifyToken, changeVendido);

module.exports = router;