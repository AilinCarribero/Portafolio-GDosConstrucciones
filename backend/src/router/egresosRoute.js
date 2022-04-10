const express = require('express');
const router = express.Router();

const { insertEgreso, listEgresos, listEgresosId, updateEgreso } = require('../controllers/egresosController');
const { verifyToken } = require('../middlewares/authVerify');

router.post('/insert', verifyToken, insertEgreso);
router.get('/:id', verifyToken, listEgresosId);
router.get('/', verifyToken, listEgresos);
router.post('/update', verifyToken, updateEgreso);

module.exports = router;