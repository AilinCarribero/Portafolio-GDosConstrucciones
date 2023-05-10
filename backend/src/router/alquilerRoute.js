const express = require('express');
const router = express.Router();

const { getAlquileres, insertAlquiler, getAlquileresId, updateNewRenovarContrato, deleteContrato } = require('../controllers/alquilerController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, getAlquileres);
router.get('/:id', verifyToken, getAlquileresId);
router.post('/insert', verifyToken, insertAlquiler);
router.post('/ren-agr-upd/contrato', verifyToken, updateNewRenovarContrato );
router.post('/delete/:id', verifyToken, deleteContrato);

module.exports = router;