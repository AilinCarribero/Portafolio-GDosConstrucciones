const express = require('express');
const router = express.Router();

const { getClientes, newCliente, updateCliente, deleteCliente } = require('../controllers/clienteController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, getClientes);
router.post('/nuevo', verifyToken, newCliente);
router.post('/update', verifyToken, updateCliente);
router.get('/delete/:id', verifyToken, deleteCliente)

module.exports = router;