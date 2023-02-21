const express = require('express');
const router = express.Router();

const { insertIngresoAlquiler } = require('../controllers/ingresoAlquilerController');
const { verifyToken } = require('../middlewares/authVerify');

router.post('/insert', verifyToken, insertIngresoAlquiler);
router.get('/', verifyToken );

module.exports = router;