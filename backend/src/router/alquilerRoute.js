const express = require('express');
const router = express.Router();

const { getAlquileres, insertAlquiler, getAlquileresId } = require('../controllers/alquilerController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, getAlquileres);
router.get('/:id', verifyToken, getAlquileresId);
router.post('/insert', verifyToken, insertAlquiler);

module.exports = router;