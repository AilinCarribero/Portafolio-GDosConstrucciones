const express = require('express');
const router = express.Router();

const { insertIngresoAlquiler, editIngresoAlquiler } = require('../controllers/ingresoAlquilerController');
const { verifyToken } = require('../middlewares/authVerify');

router.post('/insert', verifyToken, insertIngresoAlquiler);
router.post('/edit', verifyToken, editIngresoAlquiler);
router.get('/', verifyToken );

module.exports = router;