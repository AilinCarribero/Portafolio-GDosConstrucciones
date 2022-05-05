const express = require('express');
const router = express.Router();

const { insertEgreso, listEgresos, listEgresosId, updateEgreso, deleteEgreso } = require('../controllers/egresosController');
const { verifyToken } = require('../middlewares/authVerify');

router.post('/insert', verifyToken, insertEgreso);
router.get('/:id', verifyToken, listEgresosId);
router.get('/', verifyToken, listEgresos);
router.post('/update', verifyToken, updateEgreso);
router.post('/delete/:id', verifyToken, deleteEgreso);

module.exports = router;