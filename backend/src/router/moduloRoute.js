const express = require('express');
const router = express.Router();

const { insertModulo, listModulos, changeVendido, updateModulo, getCantModulos } = require('../controllers/moduloController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, listModulos);
router.get('/cantidad-modulos', verifyToken, getCantModulos)
router.post('/insert', verifyToken, insertModulo);
router.post('/update/vendido/:id', verifyToken, changeVendido);
router.post('/update/:id', verifyToken, updateModulo);

module.exports = router;