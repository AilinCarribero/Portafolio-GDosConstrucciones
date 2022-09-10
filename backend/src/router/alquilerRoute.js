const express = require('express');
const router = express.Router();

const { getAlquileres, insertAlquiler, getAlquileresId, updateContrato } = require('../controllers/alquilerController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, getAlquileres);
router.get('/:id', verifyToken, getAlquileresId);
router.post('/insert', verifyToken, insertAlquiler);
router.post('/renovar/contrato', verifyToken, updateContrato );

module.exports = router;