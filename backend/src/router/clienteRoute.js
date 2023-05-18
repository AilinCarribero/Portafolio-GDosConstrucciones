const express = require('express');
const router = express.Router();

const { getClientes, newCliente, updateCliente } = require('../controllers/clienteController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, getClientes);
router.post('/nuevo', verifyToken, newCliente);
router.post('/update', verifyToken, updateCliente);

module.exports = router;