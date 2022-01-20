const express = require('express');
const router = express.Router();

const { insertIngreso, listIngresos, listIngresosId } = require('../controllers/ingresosController');
const { verifyToken } = require('../middlewares/authVerify');

router.post('/insert', verifyToken, insertIngreso);
router.get('/', verifyToken, listIngresos);
router.get('/:id', verifyToken, listIngresosId);

module.exports = router;