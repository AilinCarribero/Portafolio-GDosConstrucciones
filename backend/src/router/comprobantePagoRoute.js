const express = require('express');
const router = express.Router();

const { listComprobantePago } = require('../controllers/comprobantePagoController');
const { verifyToken } = require('../middlewares/authVerify');

router.get('/', verifyToken, listComprobantePago);

module.exports = router;