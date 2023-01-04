const express = require('express');
const router = express.Router();

const { insertModulo, listModulos, changeVendido, updateModulo, getCantModulos, getModulosToken, deleteModuloId, newModuloDoble, getModulosDobles } = require('../controllers/moduloController');
const { verifyToken, verifyBasicAuth } = require('../middlewares/authVerify');

router.get('/', verifyToken, listModulos);
router.get('/cantidad-modulos', verifyToken, getCantModulos);
router.get('/:token', verifyBasicAuth, getModulosToken);
router.get('/listen/modulo-doble', verifyToken, getModulosDobles);
router.post('/insert', verifyToken, insertModulo);
router.post('/update/vendido/:id', verifyToken, changeVendido);
router.post('/update/:id', verifyToken, updateModulo);
router.post('/delete/:id', verifyToken, deleteModuloId);
router.post('/modulo-doble', verifyToken, newModuloDoble);

module.exports = router;