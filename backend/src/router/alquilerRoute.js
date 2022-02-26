const express = require('express');
const router = express.Router();

const { getAlquileres, insertAlquiler } = require('../controllers/alquilerController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, getAlquileres);
router.post('/insert', verifyToken, insertAlquiler);

module.exports = router;