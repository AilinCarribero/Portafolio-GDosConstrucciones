const express = require('express');
const router = express.Router();

const { listAnalisisCosto, listAnalisisCostosDetalles } = require('../controllers/analisisCostoController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/detalles', verifyToken, listAnalisisCostosDetalles);
router.get('/', verifyToken, listAnalisisCosto);

module.exports = router;